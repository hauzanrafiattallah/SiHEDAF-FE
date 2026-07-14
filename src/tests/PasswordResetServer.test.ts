import assert from "node:assert/strict";
import test from "node:test";

import {
  INVALID_RESET_TOKEN,
  PasswordResetServiceError,
} from "../features/auth/password-reset/server/PasswordResetServiceError";
import {
  resetPassword,
  sendResetPasswordEmail,
  verifyResetPasswordToken,
} from "../features/auth/password-reset/server/services/PasswordResetService";

const baseUrl = "https://sihedaf.xianly.cloud/api";
const token = "header.payload.signature/value";

function backendResponse(message: string) {
  return Response.json({
    code: 200,
    status: "OK",
    recordsTotal: 1,
    data: { message },
    errors: null,
  });
}

test("sends the reset email request to the backend", async () => {
  let requestBody = "";
  const result = await sendResetPasswordEmail(
    { email: "user@example.com" },
    {
      baseUrl,
      fetcher: async (url, init) => {
        assert.equal(
          String(url),
          "https://sihedaf.xianly.cloud/api/v1/auth/email-reset-password",
        );
        assert.equal(init?.method, "POST");
        assert.equal(init?.cache, "no-store");
        assert.deepEqual(init?.headers, {
          "Content-Type": "application/json",
        });
        requestBody = String(init?.body);
        return backendResponse(
          "Successfully send reset password. Please check your email to reset your password",
        );
      },
    },
  );

  assert.deepEqual(JSON.parse(requestBody), { email: "user@example.com" });
  assert.deepEqual(result, {
    message: "Jika email terdaftar, tautan reset telah dikirim.",
  });
});

test("does not reveal whether a reset email exists", async () => {
  const result = await sendResetPasswordEmail(
    { email: "unknown@example.com" },
    {
      baseUrl,
      fetcher: async () => Response.json({}, { status: 404 }),
    },
  );

  assert.deepEqual(result, {
    message: "Jika email terdaftar, tautan reset telah dikirim.",
  });
});

test("verifies a URL-encoded reset token", async () => {
  const result = await verifyResetPasswordToken(token, {
    baseUrl,
    fetcher: async (url, init) => {
      assert.equal(
        String(url),
        "https://sihedaf.xianly.cloud/api/v1/auth/verify-reset-password/header.payload.signature%2Fvalue",
      );
      assert.equal(init?.method, "GET");
      assert.equal(init?.cache, "no-store");
      return Response.json({
        code: 200,
        status: "OK",
        recordsTotal: 1,
        data: null,
        errors: null,
      });
    },
  });

  assert.deepEqual(result, { message: "Tautan reset kata sandi valid." });
});

test("accepts the backend direct reset redirect as a valid token", async () => {
  const result = await verifyResetPasswordToken(token, {
    baseUrl,
    fetcher: async () =>
      new Response(null, {
        status: 302,
        headers: {
          location: `https://si-hedaf-fe.vercel.app/reset-password?token=${encodeURIComponent(token)}`,
        },
      }),
  });

  assert.deepEqual(result, { message: "Tautan reset kata sandi valid." });
});

test("resets password with body and bearer token", async () => {
  const input = {
    new_password: "User!12345",
    confirm_password: "User!12345",
    token,
  };
  let requestBody = "";

  const result = await resetPassword(input, {
    baseUrl,
    fetcher: async (url, init) => {
      assert.equal(
        String(url),
        "https://sihedaf.xianly.cloud/api/v1/auth/reset-password",
      );
      assert.equal(init?.method, "POST");
      assert.deepEqual(init?.headers, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });
      requestBody = String(init?.body);
      return backendResponse("Password reset succesfully");
    },
  });

  assert.deepEqual(JSON.parse(requestBody), input);
  assert.deepEqual(result, { message: "Kata sandi berhasil diatur ulang." });
});

test("normalizes invalid tokens and unavailable services", async () => {
  await assert.rejects(
    verifyResetPasswordToken("expired.token", {
      baseUrl,
      fetcher: async () => Response.json({}, { status: 401 }),
    }),
    (error) =>
      error instanceof PasswordResetServiceError &&
      error.status === 400 &&
      error.message === INVALID_RESET_TOKEN,
  );

  await assert.rejects(
    resetPassword(
      {
        new_password: "User!12345",
        confirm_password: "User!12345",
        token: "valid.token",
      },
      {
        baseUrl,
        fetcher: async () => {
          throw new TypeError("offline");
        },
      },
    ),
    (error) =>
      error instanceof PasswordResetServiceError && error.status === 502,
  );
});
