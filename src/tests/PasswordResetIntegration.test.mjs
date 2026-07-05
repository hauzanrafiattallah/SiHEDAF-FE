import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("login links to the password recovery flow", async () => {
  const login = await readFile(
    path.join(source, "components/auth/LoginForm.tsx"),
    "utf8",
  );

  assert.match(login, /href="\/lupa-kata-sandi"/);
  assert.doesNotMatch(login, /href="#"/);
});

test("forgot password UI validates, submits, toasts, and shows neutral success", async () => {
  const form = await readFile(
    path.join(source, "components/auth/ForgotPasswordForm.tsx"),
    "utf8",
  );

  assert.match(form, /^"use client";/);
  assert.match(form, /usePasswordResetEmail/);
  assert.match(form, /zodResolver\(ResetPasswordEmailSchema\)/);
  assert.match(form, /toast\.success/);
  assert.match(form, /toast\.error/);
  assert.match(form, /Mengirim tautan\.\.\./);
  assert.match(form, /Jika email terdaftar/);
  assert.match(form, /href="\/login"/);
  assert.match(form, /aria-busy={isPending}/);
});

test("reset password UI verifies token and submits matching passwords", async () => {
  const [page, form] = await Promise.all([
    readFile(path.join(source, "app/reset-password/page.tsx"), "utf8"),
    readFile(
      path.join(source, "components/auth/ResetPasswordForm.tsx"),
      "utf8",
    ),
  ]);

  assert.match(page, /searchParams: Promise<\{/);
  assert.match(page, /await searchParams/);
  assert.match(page, /<ResetPasswordForm token={token}/);

  assert.match(form, /^"use client";/);
  assert.match(form, /useVerifyResetToken\(token\)/);
  assert.match(form, /useResetPassword/);
  assert.match(form, /zodResolver\(ResetPasswordFormSchema\)/);
  assert.match(form, /ResetPasswordRequestSchema\.parse/);
  assert.match(form, /status === "checking"/);
  assert.match(form, /status === "invalid"/);
  assert.match(form, /toast\.success/);
  assert.match(form, /toast\.error/);
  assert.match(form, /Mengatur ulang\.\.\./);
  assert.match(form, /onPaste/);
  assert.doesNotMatch(
    form,
    /localStorage|sessionStorage|document\.cookie|console\./,
  );
});
