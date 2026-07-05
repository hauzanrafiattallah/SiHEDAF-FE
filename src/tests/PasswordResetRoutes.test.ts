import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { POST as emailPost } from "../app/api/v1/auth/email-reset-password/route";
import { POST as resetPost } from "../app/api/v1/auth/reset-password/route";
import { GET as verifyGet } from "../app/api/v1/auth/verify-reset-password/[token]/route";

test("reset email route rejects malformed and invalid requests", async () => {
  const malformed = await emailPost(
    new Request("http://localhost/api/v1/auth/email-reset-password", {
      method: "POST",
      body: "{",
    }),
  );
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), {
    success: false,
    message: "Format permintaan tidak valid.",
  });

  const originalFetch = globalThis.fetch;
  let backendCalled = false;
  globalThis.fetch = async () => {
    backendCalled = true;
    return Response.json({});
  };

  try {
    const invalid = await emailPost(
      new Request("http://localhost/api/v1/auth/email-reset-password", {
        method: "POST",
        body: JSON.stringify({ email: "bukan-email" }),
      }),
    );
    const body = await invalid.json();

    assert.equal(invalid.status, 422);
    assert.equal(body.success, false);
    assert.ok(body.fieldErrors.email);
    assert.equal(backendCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("reset password route validates passwords and token before backend access", async () => {
  const originalFetch = globalThis.fetch;
  let backendCalled = false;
  globalThis.fetch = async () => {
    backendCalled = true;
    return Response.json({});
  };

  try {
    const response = await resetPost(
      new Request("http://localhost/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          new_password: "lemah",
          confirm_password: "berbeda",
          token: "",
        }),
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.success, false);
    assert.ok(body.fieldErrors.new_password);
    assert.ok(body.fieldErrors.confirm_password);
    assert.ok(body.fieldErrors.token);
    assert.equal(backendCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("verify route validates awaited Next.js params", async () => {
  const response = await verifyGet(
    new Request(
      "http://localhost/api/v1/auth/verify-reset-password/invalid",
    ),
    { params: Promise.resolve({ token: "" }) },
  );
  const body = await response.json();

  assert.equal(response.status, 422);
  assert.equal(body.success, false);
  assert.ok(body.fieldErrors.token);
});

test("verify route uses the server service without exposing token data", async () => {
  const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
  const source = await readFile(
    path.resolve(
      testsDirectory,
      "../app/api/v1/auth/verify-reset-password/[token]/route.ts",
    ),
    "utf8",
  );

  assert.match(source, /params: Promise<\{ token: string \}>/);
  assert.match(source, /await context\.params/);
  assert.match(source, /verifyResetPasswordToken\(parsed\.data\)/);
  assert.doesNotMatch(source, /console\./);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.doesNotMatch(source, /success: true,[\s\S]*?token/);
});
