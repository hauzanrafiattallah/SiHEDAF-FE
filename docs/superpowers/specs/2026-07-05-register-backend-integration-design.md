# Register Backend Integration Design

**Date:** 2026-07-05

## Objective

Connect the existing SiHEDAF registration form to
`https://sihedaf.xianly.cloud/api/v1/auth/register` while keeping the backend
base URL and transport details out of the browser bundle. The completed flow
must provide reusable validation, accessible feedback, a global toast, and a
redirect to `/login` after successful registration.

## Scope

This change covers registration only. Login, sessions, route protection,
device connection, password recovery, and authenticated API calls remain out
of scope.

## Architecture

The browser will submit registration data to a same-origin Next.js Route
Handler at `/api/v1/auth/register`. The Route Handler will validate the
request, invoke a server-only registration service, and forward the valid
payload to the external SiHEDAF backend. This Backend-for-Frontend boundary
keeps `SIHEDAF_API_BASE_URL` server-only and gives the frontend one stable,
normalized response contract.

Registration code will be organized by feature and execution environment:

```text
src/features/auth/register/
├── client/
│   ├── hooks/
│   │   └── UseRegister.ts
│   └── services/
│       └── RegisterClient.ts
├── server/
│   └── services/
│       └── RegisterService.ts
└── shared/
    ├── RegisterSchema.ts
    └── RegisterTypes.ts
```

The existing `src/components/auth/RegisterForm.tsx` remains the UI boundary.
It consumes `UseRegister`, while external-backend access remains isolated in
`RegisterService.ts`. The Next.js framework endpoint lives at
`src/app/api/v1/auth/register/route.ts`.

## Environment Configuration

The ignored root `.env` will contain:

```dotenv
SIHEDAF_API_BASE_URL=https://sihedaf.xianly.cloud
```

A committed `.env.example` will document the same variable. The variable will
not use the `NEXT_PUBLIC_` prefix and must also be configured in the production
deployment environment.

## Form and Validation

React Hook Form will manage form state and submission. Zod 4 will define the
shared registration schemas so client and server rules do not drift.

Frontend validation rules are:

- `fullname` is trimmed and must contain 3–100 characters.
- `email` is trimmed, normalized to lowercase, limited to 254 characters, and
  must be a valid email address.
- `password` must contain 8–64 characters, at least one uppercase letter, one
  lowercase letter, one number, and one symbol, with no whitespace.
- `confirmation` must exactly match `password`.

The request schema sent to the backend contains only `fullname`, `email`, and
`password`. Password confirmation is a frontend concern and is never sent to
the API.

Validation messages appear beneath their fields after the field is touched or
the form is submitted. `AuthInput.tsx` will accept an error message, expose
`aria-invalid`, and connect the input to its message with `aria-describedby`.

## Request and Response Flow

1. `RegisterForm` validates the entered values.
2. `UseRegister` exposes submission state and calls `RegisterClient`.
3. `RegisterClient` posts JSON to the same-origin `/api/v1/auth/register`.
4. The Route Handler parses and validates the untrusted request body.
5. `RegisterService` posts the normalized payload to
   `${SIHEDAF_API_BASE_URL}/api/v1/auth/register` with JSON headers and
   `cache: "no-store"`.
6. The service normalizes the backend result into the shared response type.
7. On success, the form displays `Akun berhasil dibuat. Silakan masuk.` through
   Sonner and calls `router.replace("/login")`.

The submit button is disabled while the request is pending, displays
`Mendaftarkan...`, and prevents duplicate registration requests.

## Error Handling

Malformed JSON and invalid request data return a sanitized `400` or `422`
response without contacting the external backend. External validation and
conflict statuses are preserved where useful, but their response bodies are
normalized so the browser does not depend on an undocumented backend error
shape.

Expected failures are presented in Indonesian:

- Duplicate or rejected account: use the safe backend message when available,
  otherwise `Akun tidak dapat didaftarkan.`
- Network or unavailable backend: `Layanan pendaftaran sedang bermasalah. Coba
  lagi beberapa saat.`
- Unexpected client failure: `Terjadi kesalahan. Silakan coba lagi.`

Errors are shown both as a form-level accessible alert and as an error toast.
Raw exceptions, response headers, stack traces, base URLs, and passwords are
never returned to the client or logged.

## Toast Integration

Sonner will provide the toast implementation. A PascalCase wrapper component
at `src/components/ui/AppToaster.tsx` will apply SiHEDAF colors and be mounted
once in the root layout. Because the toaster is mounted above route pages, the
success toast remains visible when registration navigates to `/login`.

## Testing and Quality Gates

Tests will be added under `src/tests` and will cover:

- valid registration data and every frontend validation rule;
- confirmation mismatch and omission of `confirmation` from the API payload;
- normalized success, validation, duplicate-account, network, and malformed
  response behavior;
- the Route Handler's server-only environment boundary;
- loading, disabled-submit, accessible inline errors, toast calls, and redirect
  behavior in the form source contract.

Implementation will follow test-driven development. Completion requires fresh
successful runs of `npm test`, `npm run lint`, and `npm run build`.

## Accepted Decisions

- Successful registration redirects to `/login`.
- Success and failure feedback use a toast.
- Frontend validation is custom-defined because the backend validation error
  schema was not provided.
- The feature uses explicit `client`, `server`, and `shared` directories, with
  the custom hook under `client/hooks`.
- No login or session behavior is added in this change.
