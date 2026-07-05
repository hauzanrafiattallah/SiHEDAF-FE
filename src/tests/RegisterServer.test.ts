import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "../app/api/v1/auth/register/route";
import {
  RegisterServiceError,
  registerUser,
} from "../features/auth/register/server/services/RegisterService";

const input = {
  fullname: "User Satu",
  email: "user@example.com",
  password: "User!123",
};

test("server service posts the backend payload and returns its message", async () => {
  let body = "";
  const result = await registerUser(input, {
    baseUrl: "https://sihedaf.xianly.cloud/",
    fetcher: async (url, init) => {
      assert.equal(
        String(url),
        "https://sihedaf.xianly.cloud/api/v1/auth/register",
      );
      assert.equal(init?.method, "POST");
      assert.deepEqual(init?.headers, { "Content-Type": "application/json" });
      assert.equal(init?.cache, "no-store");
      body = String(init?.body);
      return Response.json({
        code: 200,
        status: "OK",
        recordsTotal: 1,
        data: { message: "User registered successfully." },
        errors: null,
      });
    },
  });

  assert.deepEqual(JSON.parse(body), input);
  assert.equal(result.message, "User registered successfully.");
});

test("server service normalizes unavailable backend failures", async () => {
  await assert.rejects(
    registerUser(input, {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () => {
        throw new TypeError("network unavailable");
      },
    }),
    (error) =>
      error instanceof RegisterServiceError &&
      error.status === 502 &&
      error.message ===
        "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.",
  );
});

test("server service hides backend details for duplicate accounts", async () => {
  await assert.rejects(
    registerUser(input, {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () =>
        Response.json(
          {
            errors: {
              message:
                "duplicate key value violates unique constraint users_email_key",
            },
          },
          { status: 409 },
        ),
    }),
    (error) =>
      error instanceof RegisterServiceError &&
      error.status === 409 &&
      error.message === "Email sudah terdaftar.",
  );
});

test("server service rejects a malformed successful response", async () => {
  await assert.rejects(
    registerUser(input, {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () => Response.json({ code: 200 }),
    }),
    (error) =>
      error instanceof RegisterServiceError && error.status === 502,
  );
});

test("route rejects invalid data before calling the backend", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return Response.json({});
  };

  try {
    const response = await POST(
      new Request("http://localhost/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullname: "Us",
          email: "invalid",
          password: "Use",
        }),
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.success, false);
    assert.ok(body.fieldErrors.fullname);
    assert.ok(body.fieldErrors.email);
    assert.ok(body.fieldErrors.password);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("route rejects malformed JSON", async () => {
  const response = await POST(
    new Request("http://localhost/api/v1/auth/register", {
      method: "POST",
      body: "{",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    message: "Format permintaan tidak valid.",
  });
});
