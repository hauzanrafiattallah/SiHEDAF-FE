import assert from "node:assert/strict";
import test from "node:test";

import {
  RegisterFormSchema,
  RegisterRequestSchema,
} from "../features/auth/register/shared/RegisterSchema";

const validRegistration = {
  fullname: "User Satu",
  email: "User.Satu@Example.com ",
  password: "User!123",
  confirmation: "User!123",
};

test("normalizes valid registration data", () => {
  const result = RegisterFormSchema.parse(validRegistration);

  assert.deepEqual(result, {
    fullname: "User Satu",
    email: "user.satu@example.com",
    password: "User!123",
    confirmation: "User!123",
  });
});

test("rejects the invalid registration example", () => {
  const result = RegisterRequestSchema.safeParse({
    fullname: "Us",
    email: "bsnzjsnsj0",
    password: "Use",
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const fields = result.error.flatten().fieldErrors;
    assert.ok(fields.fullname);
    assert.ok(fields.email);
    assert.ok(fields.password);
  }
});

test("requires matching password confirmation", () => {
  const result = RegisterFormSchema.safeParse({
    ...validRegistration,
    confirmation: "Different!123",
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(
      result.error.flatten().fieldErrors.confirmation?.[0],
      "Konfirmasi kata sandi tidak cocok.",
    );
  }
});

for (const [name, password] of [
  ["uppercase", "user!123"],
  ["lowercase", "USER!123"],
  ["number", "User!Pass"],
  ["symbol", "User1234"],
  ["whitespace", "User! 123"],
] as const) {
  test("password requires " + name, () => {
    const result = RegisterRequestSchema.safeParse({
      fullname: "User Satu",
      email: "user@example.com",
      password,
    });

    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.error.flatten().fieldErrors.password);
    }
  });
}
