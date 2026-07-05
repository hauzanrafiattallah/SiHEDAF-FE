# Profile and Session Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redirect authenticated users to a protected dashboard and connect current-user, profile update, password update, refresh retry, and logout flows to the SiHEDAF backend.

**Architecture:** Private routes use an optimistic Next.js proxy cookie check while authenticated same-origin Route Handlers enforce backend authorization. A server session wrapper retries one unauthorized request after refreshing the access token. A shared client profile provider supplies the dashboard shell and account views without exposing tokens.

**Tech Stack:** Next.js 16.2 Route Handlers and Proxy, React 19.2, React Hook Form 7, Zod 4, Sonner 2, TypeScript 5, Node test runner through tsx.

---

## Task 1: Shared Profile Contracts and Redirect Contract

**Files:**

- Create `src/features/profile/shared/ProfileSchema.ts`.
- Create `src/features/profile/shared/ProfileTypes.ts`.
- Create `src/tests/ProfileSchema.test.ts`.
- Modify `src/tests/LoginIntegration.test.mjs`.

- [ ] Write tests for documented user parsing, trimmed fullname validation,
  password matching, and the `/dashboard` login redirect.
- [ ] Run the focused tests and confirm RED because the profile contracts do not
  exist and login still redirects to the device page.
- [ ] Implement the shared Zod schemas and types.
- [ ] Change successful login navigation to `router.replace("/dashboard")`.
- [ ] Run the focused tests and commit.

## Task 2: Authenticated Backend Services and One-Time Refresh

**Files:**

- Create `src/features/profile/server/services/ProfileService.ts`.
- Create `src/features/auth/session/server/WithSessionRefresh.ts`.
- Modify `src/features/auth/session/server/AuthCookies.ts` if a readable cookie
  store type is required.
- Create `src/tests/ProfileServer.test.ts`.
- Create `src/tests/SessionRefresh.test.ts`.

- [ ] Write tests for exact GET, PUT, and PATCH external requests, bearer
  headers, body shapes, response parsing, validation failures, and unavailable
  services.
- [ ] Write tests proving a `401` refreshes and retries once, non-401 errors do
  not refresh, missing refresh tokens fail safely, and refresh failure clears
  both cookies.
- [ ] Run focused tests and confirm RED.
- [ ] Implement the profile service and session refresh wrapper.
- [ ] Run focused and full tests, then commit.

## Task 3: Profile Route Handlers, Logout, and Private-Route Proxy

**Files:**

- Create `src/app/api/v1/auth/me/route.ts`.
- Create `src/app/api/v1/auth/me/update/route.ts`.
- Create `src/app/api/v1/auth/me/update-password/route.ts`.
- Create `src/app/api/v1/auth/logout/route.ts`.
- Create `src/proxy.ts`.
- Create `src/tests/ProfileRoutes.test.ts`.
- Create `src/tests/PrivateRoutes.test.mjs`.

- [ ] Write route tests for malformed JSON, schema errors, normalized success,
  session failures, and logout cookie clearing.
- [ ] Write source/runtime contracts for the private matcher and login redirect.
- [ ] Run focused tests and confirm RED.
- [ ] Implement all Route Handlers and the optimistic proxy guard.
- [ ] Run focused and full tests, then commit.

## Task 4: Shared Profile Client State and Dashboard UI

**Files:**

- Create `src/features/profile/client/services/ProfileClient.ts`.
- Create `src/features/profile/client/ProfileProvider.tsx`.
- Create `src/features/profile/client/hooks/UseUpdateProfile.ts`.
- Create `src/features/profile/client/hooks/UseUpdatePassword.ts`.
- Modify `src/components/dashboard/DashboardShell.tsx`.
- Modify `src/components/dashboard/DashboardTopbar.tsx`.
- Modify `src/components/dashboard/ProfileView.tsx`.
- Modify `src/components/dashboard/EditProfileView.tsx`.
- Modify relevant tests under `src/tests`.

- [ ] Write client tests for get, update, password, and logout calls, including
  safe malformed/network responses.
- [ ] Update UI source contracts to require provider-backed profile data,
  read-only email, real mutations, pending states, toasts, and authenticated
  logout.
- [ ] Run focused tests and confirm RED.
- [ ] Implement the client services, shared provider, mutation hooks, and UI.
- [ ] Remove the profile pages' localStorage dependency and simulated success
  copy while preserving accessible modal behavior.
- [ ] Run focused and full tests, lint, then commit.

## Task 5: Production Verification and Integration

- [ ] Run `rtk npm test` and confirm zero failures.
- [ ] Run `rtk npm run lint` and confirm zero errors.
- [ ] Run `rtk npm run build` and confirm a successful production build with the
  new API routes and proxy.
- [ ] Inspect the final diff for leaked tokens, browser-accessible secrets,
  accidental email updates, or unrelated changes.
- [ ] Complete the feature branch and integrate it into `main` following the
  user's standing direct-execution preference.
