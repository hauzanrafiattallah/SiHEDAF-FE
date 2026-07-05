import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { loginAccount } from "../features/auth/session/client/services/LoginClient";
import { refreshSession } from "../features/auth/session/client/services/RefreshSessionClient";

const credentials = {
  email: "user@example.com",
  password: "User!123",
};

test("login client posts credentials to the same-origin BFF", async () => {
  let requestBody = "";
  const result = await loginAccount(credentials, async (url, init) => {
    assert.equal(url, "/api/v1/auth/login");
    assert.equal(init?.method, "POST");
    requestBody = String(init?.body);
    return Response.json({ success: true, message: "Berhasil masuk." });
  });

  assert.deepEqual(JSON.parse(requestBody), credentials);
  assert.deepEqual(result, { success: true, message: "Berhasil masuk." });
  assert.equal("access_token" in result, false);
  assert.equal("refresh_token" in result, false);
});

test("login client normalizes network and malformed responses", async () => {
  const network = await loginAccount(credentials, async () => {
    throw new TypeError("offline");
  });
  assert.deepEqual(network, {
    success: false,
    message: "Layanan autentikasi sedang bermasalah. Coba lagi beberapa saat.",
  });

  const malformed = await loginAccount(credentials, async () =>
    Response.json({ access_token: "must-not-leak" }),
  );
  assert.deepEqual(malformed, {
    success: false,
    message: "Terjadi kesalahan. Silakan coba lagi.",
  });
});

test("refresh client posts an empty same-origin request", async () => {
  const result = await refreshSession(async (url, init) => {
    assert.equal(url, "/api/v1/auth/refresh-token");
    assert.equal(init?.method, "POST");
    assert.equal(init?.body, undefined);
    return Response.json({
      success: true,
      message: "Sesi berhasil diperbarui.",
    });
  });

  assert.deepEqual(result, {
    success: true,
    message: "Sesi berhasil diperbarui.",
  });
});

test("login hook exposes pending state and duplicate-submit guard", async () => {
  const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
  const hook = await readFile(
    path.resolve(
      testsDirectory,
      "../features/auth/session/client/hooks/UseLogin.ts",
    ),
    "utf8",
  );

  assert.match(hook, /^"use client";/);
  assert.match(hook, /useRef\(false\)/);
  assert.match(hook, /if \(inFlight\.current\) return null/);
  assert.match(hook, /setIsPending\(true\)/);
  assert.match(hook, /setIsPending\(false\)/);
  assert.match(hook, /loginAccount\(input\)/);
});
