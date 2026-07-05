# Login and Refresh Token Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Authenticate users through the SiHEDAF backend, keep access and refresh tokens in secure HttpOnly cookies, and expose a safe refresh-session boundary.

**Architecture:** Same-origin Next.js Route Handlers validate browser input, call external backend services, and manage cookies. Shared Zod contracts, isolated client services, and a useLogin mutation hook mirror the registration feature while a shared URL helper accepts base URLs with or without a trailing /api segment.

**Tech Stack:** Next.js 16.2 Route Handlers and async cookies, React 19.2, React Hook Form 7, Zod 4, Sonner 2, TypeScript 5, Node test runner through tsx.

---

## File Map

- Create src/features/auth/shared/server/BackendUrl.ts.
- Create src/features/auth/session/shared/SessionTypes.ts.
- Create src/features/auth/session/shared/SessionSchema.ts.
- Create src/features/auth/session/server/SessionServiceError.ts.
- Create src/features/auth/session/server/AuthCookies.ts.
- Create src/features/auth/session/server/services/LoginService.ts.
- Create src/features/auth/session/server/services/RefreshTokenService.ts.
- Create src/features/auth/session/client/services/LoginClient.ts.
- Create src/features/auth/session/client/services/RefreshSessionClient.ts.
- Create src/features/auth/session/client/hooks/UseLogin.ts.
- Create src/app/api/v1/auth/login/route.ts.
- Create src/app/api/v1/auth/refresh-token/route.ts.
- Modify src/features/auth/register/server/services/RegisterService.ts.
- Modify src/components/auth/LoginForm.tsx.
- Modify src/tests/AuthPages.test.mjs and src/tests/RegisterIntegration.test.mjs.
- Add focused behavioral tests under src/tests.

### Task 1: Shared Contracts and Backend URL

**Tests:**
- Create src/tests/AuthSessionSchema.test.ts.
- Create src/tests/BackendUrl.test.ts.
- Modify src/tests/RegisterIntegration.test.mjs.

- [ ] **Step 1: Preserve the failing environment contract as RED**

The current RegisterIntegration test fails because the user intentionally
changed .env.example to a placeholder URL. Change its assertion to validate a
non-public key with a non-empty HTTP URL:

~~~js
assert.match(envExample, /^SIHEDAF_API_BASE_URL=https?:\/\/\S+$/m);
assert.doesNotMatch(envExample, /NEXT_PUBLIC/);
~~~

The new BackendUrl test must assert:

~~~ts
assert.equal(
  buildBackendApiUrl("/auth/login", "https://sihedaf.xianly.cloud"),
  "https://sihedaf.xianly.cloud/api/v1/auth/login",
);
assert.equal(
  buildBackendApiUrl("auth/login", "http://127.0.0.1:3001/api/"),
  "http://127.0.0.1:3001/api/v1/auth/login",
);
assert.throws(() => buildBackendApiUrl("auth/login", ""));
~~~

The schema test must validate normalization and rejection:

~~~ts
assert.deepEqual(
  LoginRequestSchema.parse({
    email: " User@Example.com ",
    password: "User!123",
  }),
  { email: "user@example.com", password: "User!123" },
);
assert.equal(
  LoginRequestSchema.safeParse({ email: "invalid", password: "" }).success,
  false,
);
~~~

- [ ] **Step 2: Run focused tests and confirm RED**

Run:

~~~bash
rtk npx tsx --test src/tests/AuthSessionSchema.test.ts src/tests/BackendUrl.test.ts src/tests/RegisterIntegration.test.mjs
~~~

Expected: new modules are missing and the old exact environment assertion
fails until updated.

- [ ] **Step 3: Implement shared session contracts**

SessionTypes.ts exports AuthFieldErrors, AuthSuccess, AuthFailure,
AuthResponse, SessionTokens, and AccessTokenResult. SessionSchema.ts exports:

~~~ts
export const LoginRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, "Email maksimal 254 karakter.")
    .pipe(z.email("Format email tidak valid."))
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(1, "Kata sandi wajib diisi.")
    .max(128, "Kata sandi maksimal 128 karakter."),
});

export const AuthResponseSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), message: z.string().min(1) }),
  z.object({
    success: z.literal(false),
    message: z.string().min(1),
    fieldErrors: z
      .object({
        email: z.array(z.string()).optional(),
        password: z.array(z.string()).optional(),
      })
      .optional(),
  }),
]);
~~~

- [ ] **Step 4: Implement the URL helper and migrate registration**

BackendUrl.ts exports buildBackendApiUrl(path, baseUrl?) and throws
BackendConfigurationError when the variable is absent. It trims trailing
slashes, removes one terminal /api segment, strips leading slashes from path,
and returns root + /api/v1/ + path.

RegisterService must replace its string concatenation with:

~~~ts
buildBackendApiUrl("auth/register", options.baseUrl)
~~~

- [ ] **Step 5: Run tests and commit**

Run npm test, then commit:

~~~bash
rtk git commit -m "refactor(auth): share backend URL builder"
~~~

### Task 2: Backend Services and Cookie Policy

**Tests:**
- Create src/tests/AuthSessionServer.test.ts.

- [ ] **Step 1: Write failing service and cookie tests**

Tests must verify:

- login posts exactly { email, password } to auth/login;
- documented login responses produce accessToken and refreshToken;
- 401/403 become "Email atau kata sandi salah.";
- refresh posts exactly { refresh_token } to auth/refresh-token;
- documented refresh responses produce only accessToken;
- malformed/network responses become status 502;
- session cookie values use HttpOnly, SameSite=Lax, Path=/, Priority=high,
  production Secure, 86400 access max age, and 31536000 refresh max age;
- refreshing writes only the access cookie;
- clearing sets both cookies to empty values with maxAge 0.

Use a fake cookie store that records calls to set. Token values are fixed test
strings and are never printed.

- [ ] **Step 2: Run the server test and confirm RED**

~~~bash
rtk npx tsx --test src/tests/AuthSessionServer.test.ts
~~~

Expected: server session modules do not exist.

- [ ] **Step 3: Implement normalized service errors**

SessionServiceError stores a sanitized message and HTTP status. LoginService
and RefreshTokenService accept optional baseUrl, fetcher, and signal for
testing, use no-store requests with a ten-second timeout, validate documented
backend JSON with Zod, and never forward backend error text.

- [ ] **Step 4: Implement cookie helpers**

AuthCookies.ts exports:

~~~ts
export const ACCESS_TOKEN_COOKIE = "sihedaf_access_token";
export const REFRESH_TOKEN_COOKIE = "sihedaf_refresh_token";
export function writeSessionCookies(store, tokens, secure?): void;
export function writeAccessTokenCookie(store, token, secure?): void;
export function clearSessionCookies(store, secure?): void;
~~~

- [ ] **Step 5: Run tests and commit**

Run focused and full tests, then commit:

~~~bash
rtk git commit -m "feat(auth): add session backend services"
~~~

### Task 3: Login and Refresh Route Handlers

**Tests:**
- Create src/tests/AuthSessionRoutes.test.ts.

- [ ] **Step 1: Write failing route tests**

Directly test login POST with malformed JSON and invalid fields. Assert 400 and
422 without backend calls. Add source contracts confirming:

- login route awaits cookies, writes both tokens, and returns no token fields;
- refresh route reads only REFRESH_TOKEN_COOKIE;
- missing refresh returns 401;
- refresh success writes only the access cookie;
- rejected refresh clears both cookies.

- [ ] **Step 2: Run route tests and confirm RED**

~~~bash
rtk npx tsx --test src/tests/AuthSessionRoutes.test.ts
~~~

Expected: both Route Handler files are missing.

- [ ] **Step 3: Implement login Route Handler**

The login handler parses JSON, validates LoginRequestSchema, calls loginUser,
writes tokens with writeSessionCookies(await cookies(), tokens), and returns:

~~~ts
{ success: true, message: "Berhasil masuk." }
~~~

Errors are normalized to 400, 422, 401, or 502.

- [ ] **Step 4: Implement refresh Route Handler**

The refresh handler reads REFRESH_TOKEN_COOKIE from await cookies(). Missing
cookies return 401. Successful refresh calls refreshAccessToken and
writeAccessTokenCookie. Rejected refresh calls clearSessionCookies and returns
401. JSON responses never contain tokens.

- [ ] **Step 5: Run tests and commit**

Run focused and full tests, then commit:

~~~bash
rtk git commit -m "feat(auth): add login and refresh routes"
~~~

### Task 4: Browser Services, Hook, and Login Form

**Tests:**
- Create src/tests/AuthSessionClient.test.ts.
- Create src/tests/LoginIntegration.test.mjs.
- Modify src/tests/AuthPages.test.mjs.

- [ ] **Step 1: Write failing client and UI tests**

Client tests assert loginAccount posts credentials to /api/v1/auth/login,
refreshSession posts an empty request to /api/v1/auth/refresh-token, normalized
responses never include token fields, and network/malformed responses return
safe Indonesian messages.

Source contracts require useLogin, zodResolver(LoginRequestSchema),
toast.success, toast.error, "Mencoba masuk...",
router.replace("/hubungkan-perangkat"), and
disabled={!isValid || isPending}.

- [ ] **Step 2: Run client/UI tests and confirm RED**

~~~bash
rtk npx tsx --test src/tests/AuthSessionClient.test.ts src/tests/LoginIntegration.test.mjs src/tests/AuthPages.test.mjs
~~~

Expected: client session files and updated login behavior are missing.

- [ ] **Step 3: Implement browser services and useLogin**

LoginClient validates BFF JSON with AuthResponseSchema. RefreshSessionClient
posts no body. UseLogin mirrors UseRegister with an in-flight ref, pending
state, normalized error state, and a login function returning AuthResponse or
null.

- [ ] **Step 4: Integrate LoginForm**

Replace local useState submission with React Hook Form Controllers and
zodResolver. Pass AuthInput error, ref, blur, and change props. On failure show
a form alert and toast.error. On success show "Berhasil masuk." and replace
navigation to /hubungkan-perangkat. Never persist tokens in the component.

- [ ] **Step 5: Run tests, lint, and commit**

~~~bash
rtk npm test
rtk npm run lint
rtk git commit -m "feat(auth): connect login form"
~~~

### Task 5: Runtime and Production Verification

- [ ] **Step 1: Run quality gates**

~~~bash
rtk npm test
rtk npm run lint
rtk npm run build
~~~

Expected: all commands exit zero and the build lists both auth endpoints as
dynamic routes.

- [ ] **Step 2: Verify safe local runtime behavior**

Use invalid credentials only:

~~~bash
rtk curl --include --request POST http://localhost:3000/api/v1/auth/login --header "Content-Type: application/json" --data '{"email":"invalid","password":""}'
rtk curl --include --request POST http://localhost:3000/api/v1/auth/refresh-token
~~~

Expected: login returns 422 and refresh without a cookie returns 401. No valid
credentials or supplied tokens are transmitted during verification.

- [ ] **Step 3: Review and integrate**

Review the diff for token leakage, console logging, localStorage usage, raw
backend errors, and client-visible Set-Cookie mistakes. Fast-forward merge into
main, populate no new secrets, rerun all quality gates, remove the worktree,
and delete the feature branch.
