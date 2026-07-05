import assert from "node:assert/strict";
import test from "node:test";

import { LoginRequestSchema } from "../features/auth/session/shared/SessionSchema";

test("normalizes valid login credentials", () => {
  assert.deepEqual(
    LoginRequestSchema.parse({
      email: " User@Example.com ",
      password: "User!123",
    }),
    { email: "user@example.com", password: "User!123" },
  );
});

test("rejects an invalid email and empty password", () => {
  const result = LoginRequestSchema.safeParse({
    email: "invalid",
    password: "",
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const fields = result.error.flatten().fieldErrors;
    assert.ok(fields.email);
    assert.ok(fields.password);
  }
});

test("rejects an excessively long password", () => {
  const result = LoginRequestSchema.safeParse({
    email: "user@example.com",
    password: "x".repeat(129),
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(
      result.error.flatten().fieldErrors.password?.[0],
      "Kata sandi maksimal 128 karakter.",
    );
  }
});
