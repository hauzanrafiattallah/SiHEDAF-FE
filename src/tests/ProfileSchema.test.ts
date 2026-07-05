import assert from "node:assert/strict";
import test from "node:test";

import {
  ProfileUserSchema,
  UpdatePasswordRequestSchema,
  UpdateProfileRequestSchema,
} from "../features/profile/shared/ProfileSchema";

test("parses the documented current-user payload", () => {
  assert.deepEqual(
    ProfileUserSchema.parse({
      id: 1,
      fullname: "User Satu",
      email: "bsnzjsnsj0@gmail.com",
      profileImage: null,
    }),
    {
      id: 1,
      fullname: "User Satu",
      email: "bsnzjsnsj0@gmail.com",
      profileImage: null,
    },
  );
});

test("normalizes a valid profile update", () => {
  assert.deepEqual(
    UpdateProfileRequestSchema.parse({ fullname: "  User Satu Update  " }),
    { fullname: "User Satu Update" },
  );
});

test("rejects a fullname shorter than four characters", () => {
  const result = UpdateProfileRequestSchema.safeParse({ fullname: "Us" });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(
      result.error.flatten().fieldErrors.fullname?.[0],
      "Nama lengkap minimal 4 karakter.",
    );
  }
});

test("requires matching, different password values", () => {
  const mismatch = UpdatePasswordRequestSchema.safeParse({
    old_password: "User!123",
    new_password: "User!1234",
    confirm_password: "Different!123",
  });
  const unchanged = UpdatePasswordRequestSchema.safeParse({
    old_password: "User!123",
    new_password: "User!123",
    confirm_password: "User!123",
  });

  assert.equal(mismatch.success, false);
  assert.equal(unchanged.success, false);
  if (!mismatch.success) {
    assert.equal(
      mismatch.error.flatten().fieldErrors.confirm_password?.[0],
      "Konfirmasi kata sandi baru belum sama.",
    );
  }
  if (!unchanged.success) {
    assert.equal(
      unchanged.error.flatten().fieldErrors.new_password?.[0],
      "Kata sandi baru harus berbeda dari kata sandi saat ini.",
    );
  }
});
