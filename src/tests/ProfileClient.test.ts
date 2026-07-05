import assert from "node:assert/strict";
import test from "node:test";

import {
  fetchCurrentProfile,
  logoutAccount,
  updatePassword,
  updateProfile,
} from "../features/profile/client/services/ProfileClient";

const user = {
  id: 1,
  fullname: "User Satu",
  email: "bsnzjsnsj0@gmail.com",
  profileImage: null,
};

test("profile client gets the signed-in user", async () => {
  const result = await fetchCurrentProfile(async (url, init) => {
    assert.equal(String(url), "/api/v1/auth/me");
    assert.equal(init?.method, "GET");
    assert.equal(init?.credentials, "same-origin");
    assert.equal(init?.cache, "no-store");
    return Response.json({ success: true, user });
  });

  assert.deepEqual(result, { success: true, user });
});

test("profile client updates only fullname", async () => {
  let requestBody = "";
  const result = await updateProfile(
    { fullname: "User Satu Update" },
    async (url, init) => {
      assert.equal(String(url), "/api/v1/auth/me/update");
      assert.equal(init?.method, "PUT");
      requestBody = String(init?.body);
      return Response.json({
        success: true,
        message: "Profil berhasil diperbarui.",
      });
    },
  );

  assert.deepEqual(JSON.parse(requestBody), { fullname: "User Satu Update" });
  assert.equal(result.success, true);
});

test("profile client sends the documented password payload", async () => {
  const input = {
    old_password: "User!123",
    new_password: "User!1234",
    confirm_password: "User!1234",
  };
  let requestBody = "";

  const result = await updatePassword(input, async (url, init) => {
    assert.equal(String(url), "/api/v1/auth/me/update-password");
    assert.equal(init?.method, "PATCH");
    requestBody = String(init?.body);
    return Response.json({
      success: true,
      message: "Kata sandi berhasil diperbarui.",
    });
  });

  assert.deepEqual(JSON.parse(requestBody), input);
  assert.equal(result.success, true);
});

test("logout client clears the server-managed session", async () => {
  const result = await logoutAccount(async (url, init) => {
    assert.equal(String(url), "/api/v1/auth/logout");
    assert.equal(init?.method, "POST");
    assert.equal(init?.body, undefined);
    return Response.json({ success: true, message: "Berhasil keluar." });
  });

  assert.deepEqual(result, { success: true, message: "Berhasil keluar." });
});

test("profile client normalizes unauthorized and malformed responses", async () => {
  const unauthorized = await fetchCurrentProfile(async () =>
    Response.json(
      { success: false, message: "Sesi berakhir." },
      { status: 401 },
    ),
  );
  const malformed = await fetchCurrentProfile(async () =>
    Response.json({ code: 200 }),
  );
  const offline = await updateProfile(
    { fullname: "User Satu" },
    async () => {
      throw new TypeError("offline");
    },
  );

  assert.deepEqual(unauthorized, {
    success: false,
    message: "Sesi berakhir.",
    status: 401,
  });
  assert.deepEqual(malformed, {
    success: false,
    message: "Data profil tidak dapat dimuat.",
  });
  assert.deepEqual(offline, {
    success: false,
    message: "Profil tidak dapat diperbarui.",
  });
});
