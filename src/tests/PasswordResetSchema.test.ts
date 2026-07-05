import assert from "node:assert/strict";
import test from "node:test";

import {
  ResetPasswordEmailSchema,
  ResetPasswordFormSchema,
  ResetPasswordRequestSchema,
  ResetPasswordTokenSchema,
} from "../features/auth/password-reset/shared/PasswordResetSchema";

test("normalizes a valid reset email", () => {
  assert.deepEqual(
    ResetPasswordEmailSchema.parse({ email: " User@Example.com " }),
    { email: "user@example.com" },
  );
});

test("rejects an invalid reset email", () => {
  const result = ResetPasswordEmailSchema.safeParse({ email: "invalid" });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(
      result.error.flatten().fieldErrors.email?.[0],
      "Format email tidak valid.",
    );
  }
});

test("accepts a valid reset password payload", () => {
  assert.deepEqual(
    ResetPasswordRequestSchema.parse({
      new_password: "User!12345",
      confirm_password: "User!12345",
      token: "header.payload.signature",
    }),
    {
      new_password: "User!12345",
      confirm_password: "User!12345",
      token: "header.payload.signature",
    },
  );
});

test("rejects a mismatched password confirmation", () => {
  const result = ResetPasswordFormSchema.safeParse({
    new_password: "User!12345",
    confirm_password: "Different!123",
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(
      result.error.flatten().fieldErrors.confirm_password?.[0],
      "Konfirmasi kata sandi baru belum sama.",
    );
  }
});

for (const [name, password] of [
  ["uppercase", "user!12345"],
  ["lowercase", "USER!12345"],
  ["number", "User!Password"],
  ["symbol", "User123456"],
  ["whitespace", "User! 12345"],
] as const) {
  test("reset password requires " + name, () => {
    const result = ResetPasswordFormSchema.safeParse({
      new_password: password,
      confirm_password: password,
    });

    assert.equal(result.success, false);
  });
}

test("requires a bounded reset token", () => {
  assert.equal(ResetPasswordTokenSchema.safeParse("").success, false);
  assert.equal(
    ResetPasswordTokenSchema.safeParse("a".repeat(2049)).success,
    false,
  );
  assert.equal(
    ResetPasswordTokenSchema.safeParse("header.payload.signature").success,
    true,
  );
});
