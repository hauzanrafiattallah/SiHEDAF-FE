# Login and Refresh Token Integration Design

**Date:** 2026-07-05

## Objective

Connect the existing SiHEDAF login form to the backend login and refresh-token
endpoints through the same Next.js Backend-for-Frontend pattern used by
registration. Tokens must remain inaccessible to browser JavaScript and the
implementation must preserve the project's client, server, hook, validation,
toast, and testing conventions.

## Scope

This change covers:

- login through `/api/v1/auth/login`;
- access-token renewal through `/api/v1/auth/refresh-token`;
- secure session-cookie storage;
- frontend login validation, loading, error, toast, and redirect behavior;
- a reusable browser refresh client for future authenticated requests.

Route protection, authenticated health-data requests, backend logout,
forgot-password behavior, and authorization rules remain outside this change.

## Architecture

The browser calls same-origin Next.js Route Handlers. Those handlers validate
untrusted input, call isolated server services, write cookies, and return only
normalized success or failure messages. Backend access tokens and refresh
tokens are never included in a browser-readable JSON response.

Feature code will use this structure:

```text
src/features/auth/
├── shared/server/
│   └── BackendUrl.ts
└── session/
    ├── client/
    │   ├── hooks/
    │   │   └── UseLogin.ts
    │   └── services/
    │       ├── LoginClient.ts
    │       └── RefreshSessionClient.ts
    ├── server/
    │   ├── AuthCookies.ts
    │   └── services/
    │       ├── LoginService.ts
    │       └── RefreshTokenService.ts
    └── shared/
        ├── SessionSchema.ts
        └── SessionTypes.ts
```

Framework endpoints remain at:

- `src/app/api/v1/auth/login/route.ts`
- `src/app/api/v1/auth/refresh-token/route.ts`

The existing `LoginForm.tsx` remains the UI boundary and consumes `UseLogin`.

## Login Identifier Decision

The frontend continues to accept `email` because the current UI, registration
flow, and first supplied login payload all use email. The server service sends
`email` and `password` to the backend. The separate `username` curl sample is
treated as a legacy or alternate backend example rather than changing the
existing product UI without an explicit username requirement.

## Backend URL Normalization

`BackendUrl.ts` constructs API URLs from `SIHEDAF_API_BASE_URL`. It accepts a
base configured as either a domain (`https://sihedaf.xianly.cloud`) or a URL
ending in `/api` (`http://host/api`) and produces exactly one `/api/v1/...`
segment. Registration will adopt the same helper so the latest `.env.example`
format does not create `/api/api/v1/...` URLs.

## Validation

Zod 4 schemas are shared by the client and Route Handler:

- email is trimmed, normalized to lowercase, limited to 254 characters, and
  must be a valid email address;
- password is required and limited to 128 characters;
- refresh input is never accepted from browser JSON because the server reads
  it from the HttpOnly cookie.

The login form uses React Hook Form with validation on change. Inline field
errors use the existing accessible `AuthInput` error contract.

## Login Flow

1. `LoginForm` validates email and password.
2. `UseLogin` prevents duplicate submissions and calls `LoginClient`.
3. `LoginClient` posts to the same-origin `/api/v1/auth/login` endpoint.
4. The Route Handler revalidates the payload and calls `LoginService`.
5. `LoginService` posts to the external `/api/v1/auth/login` endpoint and
   validates the documented token response.
6. The Route Handler writes both tokens as HttpOnly cookies and returns only
   `{ success: true, message: "Berhasil masuk." }`.
7. The form shows a success toast and calls
   `router.replace("/hubungkan-perangkat")`.

## Refresh Flow

1. A browser consumer calls `refreshSession()`, which posts an empty request to
   the same-origin `/api/v1/auth/refresh-token` endpoint.
2. The Route Handler reads the refresh token from its HttpOnly cookie.
3. Missing refresh cookies return `401` without calling the backend.
4. `RefreshTokenService` posts `{ refresh_token }` to the external endpoint.
5. A valid response replaces only the access-token cookie and returns a
   normalized success message without the new token.
6. A rejected refresh clears both session cookies and returns `401`.

No automatic refresh timer is added because the current application has no
authenticated data request layer yet. The reusable refresh client is the
boundary that future authenticated fetch logic will call after a `401`.

## Cookie Policy

Cookie names are namespaced:

- `sihedaf_access_token`
- `sihedaf_refresh_token`

Both cookies use `httpOnly: true`, `sameSite: "lax"`, `path: "/"`, and
`priority: "high"`. `secure` is enabled in production. Access tokens use a
one-day maximum age and refresh tokens use a one-year maximum age, matching
the supplied token lifetimes. Refreshing access does not expose or rotate the
refresh token because the documented refresh response only returns a new
access token.

## Error Handling

- Invalid login fields: `422` with field errors.
- Invalid credentials (`401` or `403`): `Email atau kata sandi salah.`
- Missing or rejected refresh token: `Sesi Anda telah berakhir. Silakan masuk
  kembali.`
- Backend/network/malformed response: `Layanan autentikasi sedang bermasalah.
  Coba lagi beberapa saat.`

Raw backend messages, token values, response headers, stack traces, and
credentials are never logged or returned to the browser.

## Testing and Quality Gates

Tests under `src/tests` will cover:

- login schema normalization and invalid input;
- backend URL normalization with and without `/api`;
- exact external login and refresh request payloads;
- successful, rejected, network, and malformed backend responses;
- cookie flags, lifetimes, token replacement, and cookie clearing;
- browser services returning normalized responses without tokens;
- hook duplicate-submission state;
- login form validation, toast, pending state, and redirect source contracts;
- invalid login and missing-refresh Route Handler runtime responses.

Completion requires fresh successful runs of `npm test`, `npm run lint`, and
`npm run build`, plus local HTTP checks that do not submit valid credentials.

## Accepted Decisions

- The user explicitly requested direct execution without another review gate.
- The architecture mirrors the already approved registration integration.
- Email remains the login identifier.
- Tokens are stored only in server-managed HttpOnly cookies.
- Refresh support is exposed as a reusable endpoint/client, not an idle timer.
