import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("register UI uses the hook, shared validation, toast, and accessible errors", async () => {
  const [form, input, toaster, layout] = await Promise.all([
    readFile(path.join(source, "components/auth/RegisterForm.tsx"), "utf8"),
    readFile(path.join(source, "components/auth/AuthInput.tsx"), "utf8"),
    readFile(path.join(source, "components/ui/AppToaster.tsx"), "utf8"),
    readFile(path.join(source, "app/layout.tsx"), "utf8"),
  ]);

  assert.match(form, /useRegister/);
  assert.match(form, /zodResolver\(RegisterFormSchema\)/);
  assert.match(form, /RegisterRequestSchema\.parse\(data\)/);
  assert.match(form, /toast\.success/);
  assert.match(form, /toast\.error/);
  assert.doesNotMatch(form, /description: result\.message/);
  assert.match(form, /router\.replace\("\/login"\)/);
  assert.match(form, /Mendaftarkan\.\.\./);
  assert.match(input, /aria-invalid/);
  assert.match(input, /aria-describedby/);
  assert.match(toaster, /from "sonner"/);
  assert.match(layout, /<AppToaster/);
});

test("documents the backend URL as a server-only environment variable", async () => {
  const envExample = await readFile(
    path.resolve(source, "../.env.example"),
    "utf8",
  );

  assert.match(
    envExample,
    /^SIHEDAF_API_BASE_URL=https:\/\/sihedaf\.xianly\.cloud$/m,
  );
  assert.doesNotMatch(envExample, /NEXT_PUBLIC/);
});
