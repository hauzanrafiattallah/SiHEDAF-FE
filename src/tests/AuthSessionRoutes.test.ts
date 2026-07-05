import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { POST as loginPost } from "../app/api/v1/auth/login/route";

test("login route rejects malformed JSON", async () => {
  const response = await loginPost(
    new Request("http://localhost/api/v1/auth/login", {
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

test("login route rejects invalid fields before backend access", async () => {
  const originalFetch = globalThis.fetch;
  let backendCalled = false;
  globalThis.fetch = async () => {
    backendCalled = true;
    return Response.json({});
  };

  try {
    const response = await loginPost(
      new Request("http://localhost/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "invalid", password: "" }),
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.success, false);
    assert.ok(body.fieldErrors.email);
    assert.ok(body.fieldErrors.password);
    assert.equal(backendCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("auth routes keep tokens inside HttpOnly cookie operations", async () => {
  const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
  const [loginRoute, refreshRoute] = await Promise.all([
    readFile(
      path.resolve(testsDirectory, "../app/api/v1/auth/login/route.ts"),
      "utf8",
    ),
    readFile(
      path.resolve(
        testsDirectory,
        "../app/api/v1/auth/refresh-token/route.ts",
      ),
      "utf8",
    ),
  ]);

  assert.match(loginRoute, /await cookies\(\)/);
  assert.match(loginRoute, /writeSessionCookies\(cookieStore, tokens\)/);
  assert.match(loginRoute, /message: "Berhasil masuk\."/);
  assert.doesNotMatch(loginRoute, /access_token:/);
  assert.doesNotMatch(loginRoute, /refresh_token:/);

  assert.match(refreshRoute, /REFRESH_TOKEN_COOKIE/);
  assert.match(refreshRoute, /cookieStore\.get\(REFRESH_TOKEN_COOKIE\)/);
  assert.match(refreshRoute, /writeAccessTokenCookie/);
  assert.match(refreshRoute, /clearSessionCookies/);
  assert.match(refreshRoute, /message: SESSION_EXPIRED/);
  assert.doesNotMatch(refreshRoute, /refresh_token:/);
});
