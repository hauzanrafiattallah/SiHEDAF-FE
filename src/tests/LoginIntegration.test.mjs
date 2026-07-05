import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("login UI validates, submits, reports status, and redirects", async () => {
  const form = await readFile(
    path.join(source, "components/auth/LoginForm.tsx"),
    "utf8",
  );

  assert.match(form, /useLogin/);
  assert.match(form, /zodResolver\(LoginRequestSchema\)/);
  assert.match(form, /toast\.success\("Berhasil masuk\."\)/);
  assert.match(form, /toast\.error/);
  assert.match(form, /router\.replace\("\/hubungkan-perangkat"\)/);
  assert.match(form, /Mencoba masuk\.\.\./);
  assert.match(form, /disabled={!isValid \|\| isPending}/);
  assert.match(form, /aria-busy={isPending}/);
  assert.doesNotMatch(form, /localStorage|access_token|refresh_token/);
});
