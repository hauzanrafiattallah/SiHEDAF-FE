# Password Reset Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let logged-out users request a reset email, verify its token, and set a validated new password through the SiHEDAF backend.

**Architecture:** Shared Zod contracts feed isolated external backend services, same-origin Next.js Route Handlers, browser services, and dedicated mutation hooks. Two public auth pages reuse the existing auth shell and never persist or expose reset tokens.

**Tech Stack:** Next.js 16.2 App Router and Route Handlers, React 19.2, React Hook Form 7, Zod 4, Sonner 2, TypeScript 5, Node test runner through tsx.

---

## Task 1: Shared Password Reset Contracts

**Files:**

- Create `src/features/auth/password-reset/shared/PasswordResetTypes.ts`.
- Create `src/features/auth/password-reset/shared/PasswordResetSchema.ts`.
- Create `src/tests/PasswordResetSchema.test.ts`.

- [ ] Write tests for normalized email, invalid email, valid shared password
  policy, mismatched confirmation, and bounded non-empty token.
- [ ] Run `rtk npx tsx --test src/tests/PasswordResetSchema.test.ts` and confirm
  RED because the feature contracts do not exist.
- [ ] Implement request, form, token, and normalized response schemas using
  `createPasswordSchema("Kata sandi baru", 128)`.
- [ ] Run the focused and full tests, then commit.

## Task 2: External Backend Services

**Files:**

- Create `src/features/auth/password-reset/server/services/PasswordResetService.ts`.
- Create `src/tests/PasswordResetServer.test.ts`.

- [ ] Write tests requiring POST email payload, URL-encoded GET token path,
  POST reset payload, `Authorization: Bearer <token>`, no-store, timeout,
  documented success envelopes, invalid-token normalization, and safe 502
  failures.
- [ ] Run the focused test and confirm RED because the service is missing.
- [ ] Implement `sendResetPasswordEmail`, `verifyResetPasswordToken`, and
  `resetPassword` with injected fetch/base URL options and sanitized errors.
- [ ] Run focused and full tests, then commit.

## Task 3: Same-Origin Route Handlers

**Files:**

- Create `src/app/api/v1/auth/email-reset-password/route.ts`.
- Create `src/app/api/v1/auth/verify-reset-password/[token]/route.ts`.
- Create `src/app/api/v1/auth/reset-password/route.ts`.
- Create `src/tests/PasswordResetRoutes.test.ts`.

- [ ] Write runtime tests for malformed and invalid POST bodies and source
  contracts for awaited dynamic params, service calls, safe normalized JSON,
  and absence of token values in responses.
- [ ] Run the focused test and confirm RED because the Route Handlers are
  missing.
- [ ] Implement all handlers with 400 malformed, 422 schema, backend status,
  and 502 fallback responses.
- [ ] Run focused and full tests, then commit.

## Task 4: Browser Services and Hooks

**Files:**

- Create `src/features/auth/password-reset/client/services/PasswordResetClient.ts`.
- Create `src/features/auth/password-reset/client/hooks/UsePasswordResetEmail.ts`.
- Create `src/features/auth/password-reset/client/hooks/UseVerifyResetToken.ts`.
- Create `src/features/auth/password-reset/client/hooks/UseResetPassword.ts`.
- Create `src/tests/PasswordResetClient.test.ts`.

- [ ] Write tests for exact same-origin requests, response parsing, safe
  network/malformed responses, verification URL encoding, and hook
  duplicate-request guards.
- [ ] Run the focused test and confirm RED because client modules are missing.
- [ ] Implement the browser services and three focused hooks.
- [ ] Run focused and full tests, then commit.

## Task 5: Public Reset UI

**Files:**

- Create `src/components/auth/ForgotPasswordForm.tsx`.
- Create `src/components/auth/ResetPasswordForm.tsx`.
- Create `src/app/lupa-kata-sandi/page.tsx`.
- Create `src/app/reset-password/page.tsx`.
- Modify `src/components/auth/LoginForm.tsx`.
- Modify `src/tests/AuthPages.test.mjs`.
- Create `src/tests/PasswordResetIntegration.test.mjs`.

- [ ] Write source contracts for both routes, metadata, shared AuthShell,
  React Hook Form/Zod, hooks, pending states, inline errors, themed toasts,
  verification states, success states, login links, and the corrected login
  `href="/lupa-kata-sandi"`.
- [ ] Run the focused tests and confirm RED against the current placeholder
  forgot-password link and missing pages/forms.
- [ ] Implement both responsive pages and forms. The reset page awaits the
  Next.js 16 `searchParams` promise and passes a normalized token prop into the
  client form.
- [ ] Run focused and full tests, lint, then commit.

## Task 6: Production Verification and Integration

- [ ] Run `rtk npm test`, `rtk npm run lint`, and `rtk npm run build`.
- [ ] Smoke-test malformed/invalid local BFF requests without requesting a real
  reset email or changing an account password.
- [ ] Inspect the final diff for token logging, storage, response leakage,
  unrelated edits, and inaccessible controls.
- [ ] Merge the feature branch into `main`, rerun tests and lint, clean the
  worktree, and delete the feature branch.
