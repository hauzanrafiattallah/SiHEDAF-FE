# Register Backend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Connect the registration form to the SiHEDAF backend through a server-only Next.js BFF with shared validation, maintainable client/server boundaries, accessible errors, toast feedback, and login redirection.

**Architecture:** A same-origin Route Handler validates requests and delegates external HTTP work to a server service. Feature code is split into client hooks/services, server services, and shared schemas/types; React Hook Form consumes the shared Zod schema, while Sonner supplies a root-level toaster that survives navigation.

**Tech Stack:** Next.js 16.2 Route Handlers, React 19.2, TypeScript 5, React Hook Form 7, Zod 4, Sonner 2, Node test runner through tsx.

---

## File Map

- Create .env: local server-only backend URL.
- Create .env.example: committed environment contract.
- Modify package.json and package-lock.json: install form, schema, toast, and TypeScript test dependencies.
- Create src/features/auth/register/shared/RegisterTypes.ts: normalized API response types.
- Create src/features/auth/register/shared/RegisterSchema.ts: request, form, and response schemas.
- Create src/features/auth/register/server/services/RegisterService.ts: external backend transport and error normalization.
- Create src/app/api/v1/auth/register/route.ts: same-origin validated BFF endpoint.
- Create src/features/auth/register/client/services/RegisterClient.ts: browser transport to the BFF.
- Create src/features/auth/register/client/hooks/UseRegister.ts: pending/error mutation state.
- Create src/components/ui/AppToaster.tsx: global SiHEDAF-styled Sonner wrapper.
- Modify src/app/layout.tsx: mount the global toaster.
- Modify src/components/auth/AuthInput.tsx: accessible inline errors.
- Modify src/components/auth/RegisterForm.tsx: React Hook Form registration flow.
- Add TypeScript behavioral tests and update source-contract tests under src/tests.

### Task 1: Dependencies and TypeScript Test Runner

**Files:**
- Modify: package.json
- Modify: package-lock.json

- [ ] **Step 1: Install runtime dependencies**

Run:

~~~bash
rtk npm install react-hook-form @hookform/resolvers zod sonner
~~~

Expected: package.json and package-lock.json include the four packages.

- [ ] **Step 2: Install the TypeScript test runner**

Run:

~~~bash
rtk npm install --save-dev tsx
~~~

Expected: tsx is present in devDependencies.

- [ ] **Step 3: Keep the current suite green before feature code**

Run:

~~~bash
rtk npm test
~~~

Expected: all existing source-contract tests pass.

- [ ] **Step 4: Commit dependency setup**

~~~bash
rtk git add package.json package-lock.json
rtk git commit -m "build(auth): add register dependencies"
~~~

### Task 2: Shared Registration Contract

**Files:**
- Create: src/tests/RegisterSchema.test.ts
- Create: src/features/auth/register/shared/RegisterTypes.ts
- Create: src/features/auth/register/shared/RegisterSchema.ts
- Modify: package.json

- [ ] **Step 1: Write the failing schema test**

Create src/tests/RegisterSchema.test.ts:

~~~ts
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
~~~

Change the package.json test script to:

~~~json
"test": "tsx --test src/tests/*.test.mjs src/tests/*.test.ts"
~~~

- [ ] **Step 2: Run the schema test and verify RED**

Run:

~~~bash
rtk npx tsx --test src/tests/RegisterSchema.test.ts
~~~

Expected: FAIL because RegisterSchema.ts does not exist.

- [ ] **Step 3: Add normalized shared response types**

Create src/features/auth/register/shared/RegisterTypes.ts:

~~~ts
export type RegisterFieldErrors = Partial<
  Record<"fullname" | "email" | "password", string[]>
>;

export type RegisterSuccess = {
  success: true;
  message: string;
};

export type RegisterFailure = {
  success: false;
  message: string;
  fieldErrors?: RegisterFieldErrors;
};

export type RegisterResponse = RegisterSuccess | RegisterFailure;
~~~

- [ ] **Step 4: Add the shared Zod schemas**

Create src/features/auth/register/shared/RegisterSchema.ts:

~~~ts
import { z } from "zod";

import type { RegisterResponse } from "./RegisterTypes";

const passwordSchema = z
  .string()
  .min(8, "Kata sandi minimal 8 karakter.")
  .max(64, "Kata sandi maksimal 64 karakter.")
  .regex(/[A-Z]/, "Kata sandi harus memiliki huruf besar.")
  .regex(/[a-z]/, "Kata sandi harus memiliki huruf kecil.")
  .regex(/[0-9]/, "Kata sandi harus memiliki angka.")
  .regex(/[^A-Za-z0-9\s]/, "Kata sandi harus memiliki simbol.")
  .regex(/^\S+$/, "Kata sandi tidak boleh mengandung spasi.");

export const RegisterRequestSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, "Nama lengkap minimal 3 karakter.")
    .max(100, "Nama lengkap maksimal 100 karakter."),
  email: z
    .string()
    .trim()
    .max(254, "Email maksimal 254 karakter.")
    .pipe(z.email("Format email tidak valid."))
    .transform((email) => email.toLowerCase()),
  password: passwordSchema,
});

export const RegisterFormSchema = RegisterRequestSchema.extend({
  confirmation: z.string().min(1, "Konfirmasi kata sandi wajib diisi."),
}).refine((data) => data.password === data.confirmation, {
  message: "Konfirmasi kata sandi tidak cocok.",
  path: ["confirmation"],
});

export const RegisterResponseSchema: z.ZodType<RegisterResponse> =
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string().min(1),
    }),
    z.object({
      success: z.literal(false),
      message: z.string().min(1),
      fieldErrors: z
        .object({
          fullname: z.array(z.string()).optional(),
          email: z.array(z.string()).optional(),
          password: z.array(z.string()).optional(),
        })
        .optional(),
    }),
  ]);

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterFormInput = z.input<typeof RegisterFormSchema>;
export type RegisterFormData = z.output<typeof RegisterFormSchema>;
~~~

- [ ] **Step 5: Run schema tests and the full suite**

Run:

~~~bash
rtk npm test
~~~

Expected: schema tests and all prior tests pass.

- [ ] **Step 6: Commit the shared contract**

~~~bash
rtk git add package.json src/tests/RegisterSchema.test.ts src/features/auth/register/shared
rtk git commit -m "feat(auth): add register validation"
~~~

### Task 3: Server Service and BFF Route

**Files:**
- Create: src/tests/RegisterServer.test.ts
- Create: src/features/auth/register/server/services/RegisterService.ts
- Create: src/app/api/v1/auth/register/route.ts

- [ ] **Step 1: Write failing server behavior tests**

Create src/tests/RegisterServer.test.ts with tests that:

~~~ts
import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "../app/api/v1/auth/register/route";
import {
  RegisterServiceError,
  registerUser,
} from "../features/auth/register/server/services/RegisterService";

const input = {
  fullname: "User Satu",
  email: "user@example.com",
  password: "User!123",
};

test("server service posts the backend payload and returns its message", async () => {
  let body = "";
  const result = await registerUser(input, {
    baseUrl: "https://sihedaf.xianly.cloud/",
    fetcher: async (url, init) => {
      assert.equal(
        String(url),
        "https://sihedaf.xianly.cloud/api/v1/auth/register",
      );
      body = String(init?.body);
      return Response.json({
        code: 200,
        status: "OK",
        recordsTotal: 1,
        data: { message: "User registered successfully." },
        errors: null,
      });
    },
  });

  assert.deepEqual(JSON.parse(body), input);
  assert.equal(result.message, "User registered successfully.");
});

test("server service normalizes unavailable backend failures", async () => {
  await assert.rejects(
    registerUser(input, {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () => {
        throw new TypeError("network unavailable");
      },
    }),
    (error) =>
      error instanceof RegisterServiceError &&
      error.status === 502 &&
      error.message ===
        "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.",
  );
});

test("server service preserves a safe backend rejection", async () => {
  await assert.rejects(
    registerUser(input, {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () =>
        Response.json(
          { errors: { message: "Email sudah terdaftar." } },
          { status: 409 },
        ),
    }),
    (error) =>
      error instanceof RegisterServiceError &&
      error.status === 409 &&
      error.message === "Email sudah terdaftar.",
  );
});

test("server service rejects a malformed successful response", async () => {
  await assert.rejects(
    registerUser(input, {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () => Response.json({ code: 200 }),
    }),
    (error) =>
      error instanceof RegisterServiceError && error.status === 502,
  );
});

test("route rejects invalid data before calling the backend", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return Response.json({});
  };

  try {
    const response = await POST(
      new Request("http://localhost/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullname: "Us",
          email: "invalid",
          password: "Use",
        }),
      }),
    );
    const body = await response.json();

    assert.equal(response.status, 422);
    assert.equal(body.success, false);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("route rejects malformed JSON", async () => {
  const response = await POST(
    new Request("http://localhost/api/v1/auth/register", {
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
~~~

- [ ] **Step 2: Run server tests and verify RED**

Run:

~~~bash
rtk npx tsx --test src/tests/RegisterServer.test.ts
~~~

Expected: FAIL because the service and Route Handler do not exist.

- [ ] **Step 3: Implement the external registration service**

Create RegisterService.ts with:

~~~ts
import { z } from "zod";

import type { RegisterRequest } from "../../shared/RegisterSchema";

const BACKEND_UNAVAILABLE =
  "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.";
const REGISTRATION_REJECTED = "Akun tidak dapat didaftarkan.";

const BackendSuccessSchema = z.object({
  code: z.number(),
  status: z.string(),
  recordsTotal: z.number(),
  data: z.object({ message: z.string().min(1) }),
  errors: z.unknown().nullable(),
});

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type RegisterServiceOptions = {
  baseUrl?: string;
  fetcher?: Fetcher;
  signal?: AbortSignal;
};

export class RegisterServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "RegisterServiceError";
  }
}

function safeMessage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const message = value.trim();
  return message.length > 0 && message.length <= 200 ? message : null;
}

function findBackendMessage(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const direct = safeMessage(body.message);
  if (direct) return direct;

  for (const key of ["data", "errors"]) {
    const nested = body[key];
    if (typeof nested === "string") return safeMessage(nested);
    if (nested && typeof nested === "object") {
      const message = safeMessage((nested as Record<string, unknown>).message);
      if (message) return message;
    }
  }
  return null;
}

export async function registerUser(
  input: RegisterRequest,
  options: RegisterServiceOptions = {},
): Promise<{ message: string }> {
  const baseUrl = options.baseUrl ?? process.env.SIHEDAF_API_BASE_URL;
  if (!baseUrl) {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 500);
  }

  const fetcher = options.fetcher ?? fetch;
  let response: Response;
  try {
    response = await fetcher(
      baseUrl.replace(/\/+$/, "") + "/api/v1/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        cache: "no-store",
        signal: options.signal ?? AbortSignal.timeout(10_000),
      },
    );
  } catch {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 502);
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 502);
  }

  if (!response.ok) {
    const status =
      response.status >= 400 && response.status < 500 ? response.status : 502;
    throw new RegisterServiceError(
      findBackendMessage(body) ?? REGISTRATION_REJECTED,
      status,
    );
  }

  const parsed = BackendSuccessSchema.safeParse(body);
  if (!parsed.success || parsed.data.code !== 200) {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 502);
  }

  return { message: parsed.data.data.message };
}
~~~

- [ ] **Step 4: Implement the validated Route Handler**

Create route.ts with:

~~~ts
import { registerUser, RegisterServiceError } from "@/features/auth/register/server/services/RegisterService";
import { RegisterRequestSchema } from "@/features/auth/register/shared/RegisterSchema";
import type { RegisterFailure, RegisterSuccess } from "@/features/auth/register/shared/RegisterTypes";

function json(body: RegisterFailure | RegisterSuccess, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: "Format permintaan tidak valid." }, 400);
  }

  const parsed = RegisterRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        success: false,
        message: "Periksa kembali data pendaftaran.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const result = await registerUser(parsed.data);
    return json({ success: true, message: result.message }, 200);
  } catch (error) {
    if (error instanceof RegisterServiceError) {
      return json({ success: false, message: error.message }, error.status);
    }
    return json(
      {
        success: false,
        message: "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.",
      },
      502,
    );
  }
}
~~~

- [ ] **Step 5: Run server and full tests**

Run:

~~~bash
rtk npx tsx --test src/tests/RegisterServer.test.ts
rtk npm test
~~~

Expected: all tests pass.

- [ ] **Step 6: Commit the server boundary**

~~~bash
rtk git add src/app/api/v1/auth/register src/features/auth/register/server src/tests/RegisterServer.test.ts
rtk git commit -m "feat(auth): add register BFF route"
~~~

### Task 4: Client Service and Registration Hook

**Files:**
- Create: src/tests/RegisterClient.test.ts
- Create: src/features/auth/register/client/services/RegisterClient.ts
- Create: src/features/auth/register/client/hooks/UseRegister.ts

- [ ] **Step 1: Write failing client service tests**

Create RegisterClient.test.ts:

~~~ts
import assert from "node:assert/strict";
import test from "node:test";

import { registerAccount } from "../features/auth/register/client/services/RegisterClient";

const input = {
  fullname: "User Satu",
  email: "user@example.com",
  password: "User!123",
};

test("client posts only the registration request", async () => {
  let requestBody = "";
  const result = await registerAccount(input, async (url, init) => {
    assert.equal(url, "/api/v1/auth/register");
    requestBody = String(init?.body);
    return Response.json({ success: true, message: "Registered" });
  });

  assert.deepEqual(JSON.parse(requestBody), input);
  assert.deepEqual(result, { success: true, message: "Registered" });
});

test("client normalizes malformed and network failures", async () => {
  const malformed = await registerAccount(input, async () =>
    Response.json({ unexpected: true }),
  );
  assert.deepEqual(malformed, {
    success: false,
    message: "Terjadi kesalahan. Silakan coba lagi.",
  });

  const network = await registerAccount(input, async () => {
    throw new TypeError("offline");
  });
  assert.deepEqual(network, {
    success: false,
    message: "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.",
  });
});

test("client preserves a normalized BFF rejection", async () => {
  const result = await registerAccount(input, async () =>
    Response.json(
      { success: false, message: "Email sudah terdaftar." },
      { status: 409 },
    ),
  );

  assert.deepEqual(result, {
    success: false,
    message: "Email sudah terdaftar.",
  });
});
~~~

- [ ] **Step 2: Run client tests and verify RED**

Run:

~~~bash
rtk npx tsx --test src/tests/RegisterClient.test.ts
~~~

Expected: FAIL because RegisterClient.ts does not exist.

- [ ] **Step 3: Implement the browser service**

Create RegisterClient.ts:

~~~ts
import type { RegisterRequest } from "../../shared/RegisterSchema";
import { RegisterResponseSchema } from "../../shared/RegisterSchema";
import type { RegisterResponse } from "../../shared/RegisterTypes";

type Fetcher = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

const UNAVAILABLE =
  "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.";
const UNEXPECTED = "Terjadi kesalahan. Silakan coba lagi.";

export async function registerAccount(
  input: RegisterRequest,
  fetcher: Fetcher = fetch,
): Promise<RegisterResponse> {
  let response: Response;
  try {
    response = await fetcher("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return { success: false, message: UNAVAILABLE };
  }

  try {
    const parsed = RegisterResponseSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.success !== response.ok) {
      return { success: false, message: UNEXPECTED };
    }
    return parsed.data;
  } catch {
    return { success: false, message: UNEXPECTED };
  }
}
~~~

- [ ] **Step 4: Implement the custom mutation hook**

Create UseRegister.ts:

~~~ts
"use client";

import { useCallback, useRef, useState } from "react";

import type { RegisterRequest } from "../../shared/RegisterSchema";
import type { RegisterFailure, RegisterResponse } from "../../shared/RegisterTypes";
import { registerAccount } from "../services/RegisterClient";

export function useRegister() {
  const inFlight = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<RegisterFailure | null>(null);

  const register = useCallback(
    async (input: RegisterRequest): Promise<RegisterResponse | null> => {
      if (inFlight.current) return null;

      inFlight.current = true;
      setIsPending(true);
      setError(null);
      try {
        const result = await registerAccount(input);
        if (!result.success) setError(result);
        return result;
      } finally {
        inFlight.current = false;
        setIsPending(false);
      }
    },
    [],
  );

  return { register, isPending, error };
}
~~~

- [ ] **Step 5: Run client and full tests**

Run:

~~~bash
rtk npx tsx --test src/tests/RegisterClient.test.ts
rtk npm test
~~~

Expected: all tests pass.

- [ ] **Step 6: Commit the client data layer**

~~~bash
rtk git add src/features/auth/register/client src/tests/RegisterClient.test.ts
rtk git commit -m "feat(auth): add register client hook"
~~~

### Task 5: Form, Accessible Errors, and Toast

**Files:**
- Modify: src/tests/AuthPages.test.mjs
- Create: src/tests/RegisterIntegration.test.mjs
- Modify: src/components/auth/AuthInput.tsx
- Modify: src/components/auth/RegisterForm.tsx
- Create: src/components/ui/AppToaster.tsx
- Modify: src/app/layout.tsx

- [ ] **Step 1: Write failing UI source contracts**

In the active-form test in AuthPages.test.mjs, replace the shared form loop and
registration assertions with:

~~~js
for (const formSource of [loginSource, registerSource, deviceSource]) {
  assert.match(formSource, /^["']use client["'];/);
}

for (const localStateForm of [loginSource, deviceSource]) {
  assert.match(localStateForm, /useState/);
  assert.match(localStateForm, /disabled={!isComplete}/);
  assert.match(localStateForm, /required/);
}

assert.match(inputSource, /showPassword/);
assert.match(inputSource, /type="button"/);
assert.match(loginSource, /router\.push\("\/hubungkan-perangkat"\)/);
assert.match(registerSource, /useRegister/);
assert.match(registerSource, /zodResolver\(RegisterFormSchema\)/);
assert.match(registerSource, /disabled={!isValid \|\| isPending}/);
assert.match(registerSource, /router\.replace\("\/login"\)/);
assert.match(deviceSource, /Hubungkan perangkat/);
~~~

Create RegisterIntegration.test.mjs to assert:

~~~js
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
  assert.match(form, /toast\.success/);
  assert.match(form, /toast\.error/);
  assert.match(form, /router\.replace\(\"\/login\"\)/);
  assert.match(form, /Mendaftarkan\.\.\./);
  assert.match(input, /aria-invalid/);
  assert.match(input, /aria-describedby/);
  assert.match(toaster, /from \"sonner\"/);
  assert.match(layout, /<AppToaster/);
});
~~~

- [ ] **Step 2: Run UI contracts and verify RED**

Run:

~~~bash
rtk npx tsx --test src/tests/AuthPages.test.mjs src/tests/RegisterIntegration.test.mjs
~~~

Expected: FAIL because the form, toaster, and accessible errors are absent.

- [ ] **Step 3: Add accessible errors to AuthInput**

Replace AuthInput.tsx with:

~~~tsx
import { type Ref, useId, useState } from "react";

type AuthInputProps = {
  label: string;
  name: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  value: string;
  autoComplete?: string;
  error?: string;
  inputRef?: Ref<HTMLInputElement>;
  required?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
};

export function AuthInput({
  label,
  name,
  placeholder,
  type = "text",
  value,
  autoComplete,
  error,
  inputRef,
  required = true,
  onBlur,
  onChange,
}: AuthInputProps) {
  const inputId = useId();
  const errorId = inputId + "-error";
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label
        className="mb-2.5 block text-[13px] font-semibold tracking-[-0.02em] text-primary-900"
        htmlFor={inputId}
      >
        {label}
      </label>
      <div className="relative">
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className={"h-14 w-full rounded-full border bg-white px-6 pr-13 text-[14px] font-medium text-primary-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-primary-900/24 focus:ring-4 " +
            (error
              ? "border-[#FF4572] focus:border-[#FF4572] focus:ring-[#FFE8EE]"
              : "border-primary-900/10 focus:border-primary-300 focus:ring-primary-100/70")}
          id={inputId}
          name={name}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          ref={inputRef}
          required={required}
          type={inputType}
          value={value}
        />
        {isPassword ? (
          <button
            aria-label={
              showPassword
                ? "Sembunyikan kata sandi"
                : "Tampilkan kata sandi"
            }
            className="absolute top-1/2 right-4 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-primary-300 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M2.5 10s2.7-4 7.5-4 7.5 4 7.5 4-2.7 4-7.5 4-7.5-4-7.5-4Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.35"
              />
              <circle
                cx="10"
                cy="10"
                r="2"
                stroke="currentColor"
                strokeWidth="1.35"
              />
            </svg>
          </button>
        ) : null}
      </div>
      {error ? (
        <p
          className="mt-2 px-4 text-[12px] font-medium text-[#FF4572]"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
~~~

- [ ] **Step 4: Add the global Sonner wrapper**

Create AppToaster.tsx:

~~~tsx
"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      closeButton
      duration={4000}
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-primary-200 bg-white font-[family-name:var(--font-switzer)] text-primary-900 shadow-xl",
          success: "border-[#BDE9C5]",
          error: "border-[#FFC2D1]",
          title: "font-semibold",
          description: "text-primary-900/65",
        },
      }}
    />
  );
}
~~~

Mount AppToaster inside the root body after children.

- [ ] **Step 5: Replace mock registration with the validated mutation flow**

Replace RegisterForm.tsx with:

~~~tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthInput } from "@/components/auth/AuthInput";
import { useRegister } from "@/features/auth/register/client/hooks/UseRegister";
import {
  RegisterFormSchema,
  RegisterRequestSchema,
  type RegisterFormData,
  type RegisterFormInput,
  type RegisterRequest,
} from "@/features/auth/register/shared/RegisterSchema";

const defaultValues: RegisterFormInput = {
  fullname: "",
  email: "",
  password: "",
  confirmation: "",
};

export function RegisterForm() {
  const router = useRouter();
  const { register, isPending, error } = useRegister();
  const {
    control,
    formState: { isValid },
    handleSubmit,
    setError,
  } = useForm<RegisterFormInput, unknown, RegisterFormData>({
    defaultValues,
    mode: "onTouched",
    resolver: zodResolver(RegisterFormSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    const input = RegisterRequestSchema.parse(data);
    const result = await register(input);
    if (!result) return;

    if (!result.success) {
      const fieldErrors = Object.entries(result.fieldErrors ?? {}) as [
        keyof RegisterRequest,
        string[],
      ][];
      for (const [field, messages] of fieldErrors) {
        setError(field, { type: "server", message: messages[0] });
      }
      toast.error(result.message);
      return;
    }

    toast.success("Akun berhasil dibuat. Silakan masuk.", {
      description: result.message,
    });
    router.replace("/login");
  }

  return (
    <div>
      <p className="text-[13px] font-semibold text-primary-300">Buat Akun</p>
      <h1 className="mt-2.5 text-[36px] font-medium tracking-[-0.045em] text-primary-900">
        Daftar Akun
      </h1>

      <form
        aria-busy={isPending}
        className="mt-9 space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="fullname"
          render={({ field, fieldState }) => (
            <AuthInput
              autoComplete="name"
              error={fieldState.error?.message}
              inputRef={field.ref}
              label="Nama Lengkap"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Masukkan nama lengkap"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <AuthInput
              autoComplete="email"
              error={fieldState.error?.message}
              inputRef={field.ref}
              label="Email"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Masukkan email"
              type="email"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <AuthInput
              autoComplete="new-password"
              error={fieldState.error?.message}
              inputRef={field.ref}
              label="Kata sandi"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Buat kata sandi"
              type="password"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmation"
          render={({ field, fieldState }) => (
            <AuthInput
              autoComplete="new-password"
              error={fieldState.error?.message}
              inputRef={field.ref}
              label="Konfirmasi Kata sandi"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Masukkan ulang kata sandi"
              type="password"
              value={field.value}
            />
          )}
        />

        {error ? (
          <p
            className="rounded-2xl bg-[#FFE8EE] px-4 py-3 text-[12px] font-medium text-[#D72D55]"
            role="alert"
          >
            {error.message}
          </p>
        ) : null}

        <button
          className={"mt-2 h-14 w-full rounded-full text-[14px] font-semibold transition-[background-color,transform,box-shadow] duration-200 " +
            (isValid && !isPending
              ? "bg-primary-300 text-white shadow-[0_10px_24px_rgba(0,110,251,0.16)] hover:bg-primary-400"
              : "cursor-not-allowed bg-[#e4e7eb] text-primary-900/30")}
          disabled={!isValid || isPending}
          type="submit"
        >
          {isPending ? "Mendaftarkan..." : "Daftar"}
        </button>
      </form>

      <p className="mt-7 text-center text-[12px] font-medium text-primary-900/35">
        Sudah punya akun?{" "}
        <Link className="font-semibold text-primary-300" href="/login">
          Masuk sekarang
        </Link>
      </p>
    </div>
  );
}
~~~

- [ ] **Step 6: Run UI and full tests**

Run:

~~~bash
rtk npx tsx --test src/tests/AuthPages.test.mjs src/tests/RegisterIntegration.test.mjs
rtk npm test
~~~

Expected: all tests pass.

- [ ] **Step 7: Commit the registration UI**

~~~bash
rtk git add src/app/layout.tsx src/components/auth src/components/ui/AppToaster.tsx src/tests
rtk git commit -m "feat(auth): connect register form"
~~~

### Task 6: Environment Contract and Final Verification

**Files:**
- Create: .env
- Create: .env.example
- Modify: src/tests/RegisterIntegration.test.mjs

- [ ] **Step 1: Add a failing environment source contract**

Extend RegisterIntegration.test.mjs to read .env.example from the repository
root and assert the exact server-only key and absence of NEXT_PUBLIC:

~~~js
assert.match(envExample, /^SIHEDAF_API_BASE_URL=https:\/\/sihedaf\.xianly\.cloud$/m);
assert.doesNotMatch(envExample, /NEXT_PUBLIC/);
~~~

- [ ] **Step 2: Run the contract and verify RED**

Run:

~~~bash
rtk npx tsx --test src/tests/RegisterIntegration.test.mjs
~~~

Expected: FAIL because .env.example does not exist.

- [ ] **Step 3: Add local and example environment files**

Create both files with:

~~~dotenv
SIHEDAF_API_BASE_URL=https://sihedaf.xianly.cloud
~~~

Only .env.example is committed; .env remains ignored.

- [ ] **Step 4: Run focused and full automated checks**

Run:

~~~bash
rtk npm test
rtk npm run lint
rtk npm run build
~~~

Expected: each command exits 0 with no test, lint, type, or build failures.

- [ ] **Step 5: Exercise the real BFF locally without creating an account**

Start the development server and submit the known-invalid payload to the local
Route Handler:

~~~bash
rtk npm run dev
rtk curl --request POST http://localhost:3000/api/v1/auth/register --header "Content-Type: application/json" --data '{"fullname":"Us","email":"bsnzjsnsj0","password":"Use"}'
~~~

Expected: HTTP 422 with a normalized failure and fieldErrors. The external
backend is not called because shared validation rejects the request.

- [ ] **Step 6: Verify the browser flow**

Open /register, confirm inline errors for the invalid example, verify the
loading label and disabled submit behavior, and confirm there are no console
errors. Do not create a real account during browser verification.

- [ ] **Step 7: Commit the environment contract**

~~~bash
rtk git add .env.example src/tests/RegisterIntegration.test.mjs
rtk git commit -m "chore(auth): document backend URL"
~~~

- [ ] **Step 8: Review the final diff against the design**

Run:

~~~bash
rtk git diff main...HEAD --check
rtk git status --short
~~~

Expected: no whitespace errors and a clean worktree.
