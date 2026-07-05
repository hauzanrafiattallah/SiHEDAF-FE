import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { PATCH as updatePassword } from "../app/api/v1/auth/me/update-password/route";
import { PUT as updateProfile } from "../app/api/v1/auth/me/update/route";

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("profile update route rejects malformed and invalid input", async () => {
  const malformed = await updateProfile(
    new Request("http://localhost/api/v1/auth/me/update", {
      method: "PUT",
      body: "{",
    }),
  );
  const invalid = await updateProfile(
    new Request("http://localhost/api/v1/auth/me/update", {
      method: "PUT",
      body: JSON.stringify({ fullname: "Us", email: "invalid" }),
    }),
  );

  assert.equal(malformed.status, 400);
  assert.equal(invalid.status, 422);
  assert.deepEqual(await malformed.json(), {
    success: false,
    message: "Format permintaan tidak valid.",
  });
  const invalidBody = await invalid.json();
  assert.equal(invalidBody.success, false);
  assert.ok(invalidBody.fieldErrors.fullname);
});

test("password update route validates all documented fields", async () => {
  const response = await updatePassword(
    new Request("http://localhost/api/v1/auth/me/update-password", {
      method: "PATCH",
      body: JSON.stringify({
        old_password: "User!123",
        new_password: "User!1234",
        confirm_password: "Different!123",
      }),
    }),
  );

  assert.equal(response.status, 422);
  const body = await response.json();
  assert.equal(body.success, false);
  assert.ok(body.fieldErrors.confirm_password);
});

test("authenticated profile routes use the shared refresh boundary", async () => {
  const [meRoute, profileRoute, passwordRoute, logoutRoute] = await Promise.all([
    readFile(path.join(source, "app/api/v1/auth/me/route.ts"), "utf8"),
    readFile(path.join(source, "app/api/v1/auth/me/update/route.ts"), "utf8"),
    readFile(
      path.join(source, "app/api/v1/auth/me/update-password/route.ts"),
      "utf8",
    ),
    readFile(path.join(source, "app/api/v1/auth/logout/route.ts"), "utf8"),
  ]);

  assert.match(meRoute, /withSessionRefresh/);
  assert.match(meRoute, /getCurrentProfile/);
  assert.match(profileRoute, /UpdateProfileRequestSchema\.safeParse/);
  assert.match(profileRoute, /updateCurrentProfile/);
  assert.doesNotMatch(profileRoute, /email:/);
  assert.match(passwordRoute, /UpdatePasswordRequestSchema\.safeParse/);
  assert.match(passwordRoute, /updateCurrentPassword/);
  assert.match(logoutRoute, /await cookies\(\)/);
  assert.match(logoutRoute, /clearSessionCookies/);
});
