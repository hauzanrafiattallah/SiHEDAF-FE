import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  requestPasswordResetEmail,
  submitResetPassword,
  verifyPasswordResetToken,
} from "../features/auth/password-reset/client/services/PasswordResetClient";

test("password reset client calls each same-origin BFF endpoint", async () => {
  let emailBody = "";
  const emailResult = await requestPasswordResetEmail(
    { email: "user@example.com" },
    async (url, init) => {
      assert.equal(url, "/api/v1/auth/email-reset-password");
      assert.equal(init?.method, "POST");
      assert.equal(init?.credentials, "same-origin");
      emailBody = String(init?.body);
      return Response.json({ success: true, message: "Email dikirim." });
    },
  );
  assert.deepEqual(JSON.parse(emailBody), { email: "user@example.com" });
  assert.deepEqual(emailResult, { success: true, message: "Email dikirim." });

  const verifyResult = await verifyPasswordResetToken(
    "header.payload/with-slash",
    async (url, init) => {
      assert.equal(
        url,
        "/api/v1/auth/verify-reset-password/header.payload%2Fwith-slash",
      );
      assert.equal(init?.method, "GET");
      assert.equal(init?.credentials, "same-origin");
      return Response.json({ success: true, message: "Token valid." });
    },
  );
  assert.deepEqual(verifyResult, { success: true, message: "Token valid." });

  const resetInput = {
    new_password: "User!12345",
    confirm_password: "User!12345",
    token: "header.payload.signature",
  };
  let resetBody = "";
  const resetResult = await submitResetPassword(
    resetInput,
    async (url, init) => {
      assert.equal(url, "/api/v1/auth/reset-password");
      assert.equal(init?.method, "POST");
      assert.equal(init?.credentials, "same-origin");
      resetBody = String(init?.body);
      return Response.json({ success: true, message: "Berhasil." });
    },
  );
  assert.deepEqual(JSON.parse(resetBody), resetInput);
  assert.deepEqual(resetResult, { success: true, message: "Berhasil." });
});

test("password reset client preserves BFF errors and response status", async () => {
  const result = await submitResetPassword(
    {
      new_password: "User!12345",
      confirm_password: "User!12345",
      token: "expired.token",
    },
    async () =>
      Response.json(
        { success: false, message: "Token kedaluwarsa." },
        { status: 400 },
      ),
  );

  assert.deepEqual(result, {
    success: false,
    message: "Token kedaluwarsa.",
    status: 400,
  });
});

test("password reset client normalizes malformed and network responses", async () => {
  const malformed = await verifyPasswordResetToken("token", async () =>
    Response.json({ unexpected: true }),
  );
  assert.deepEqual(malformed, {
    success: false,
    message: "Tautan reset tidak dapat diverifikasi.",
  });

  const network = await requestPasswordResetEmail(
    { email: "user@example.com" },
    async () => {
      throw new TypeError("offline");
    },
  );
  assert.deepEqual(network, {
    success: false,
    message: "Email reset tidak dapat dikirim.",
  });
});

test("password reset hooks expose pending guards and token verification state", async () => {
  const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
  const hooksDirectory = path.resolve(
    testsDirectory,
    "../features/auth/password-reset/client/hooks",
  );
  const [emailHook, verifyHook, resetHook] = await Promise.all([
    readFile(path.join(hooksDirectory, "UsePasswordResetEmail.ts"), "utf8"),
    readFile(path.join(hooksDirectory, "UseVerifyResetToken.ts"), "utf8"),
    readFile(path.join(hooksDirectory, "UseResetPassword.ts"), "utf8"),
  ]);

  for (const hook of [emailHook, resetHook]) {
    assert.match(hook, /^"use client";/);
    assert.match(hook, /useRef\(false\)/);
    assert.match(hook, /if \(inFlight\.current\) return null/);
    assert.match(hook, /setIsPending\(true\)/);
    assert.match(hook, /setIsPending\(false\)/);
  }

  assert.match(verifyHook, /^"use client";/);
  assert.match(verifyHook, /useEffect/);
  assert.match(verifyHook, /verifyPasswordResetToken\(token/);
  assert.match(verifyHook, /"checking" \| "valid" \| "invalid"/);
  assert.doesNotMatch(verifyHook, /localStorage|sessionStorage|console\./);
});
