# Profile and Session Protection Design

**Date:** 2026-07-05

## Objective

Complete the authenticated SiHEDAF flow by redirecting successful login directly
to the dashboard, protecting dashboard routes, loading the signed-in user from
the backend, and connecting profile and password updates to the supplied API.

## Scope

This change covers:

- redirecting successful login to `/dashboard`;
- optimistic route protection for `/dashboard`, `/riwayat`, `/profil`, and
  `/profil/ubah`;
- authenticated GET `/api/v1/auth/me` requests;
- authenticated PUT `/api/v1/auth/me/update` requests containing only
  `fullname`;
- authenticated PATCH `/api/v1/auth/me/update-password` requests;
- one automatic access-token refresh and request retry after an unauthorized
  backend response;
- profile state shared by the dashboard shell, topbar, profile page, and edit
  page;
- local logout that clears both HttpOnly cookies.

Device connection rules, profile-image uploads, health data, and backend logout
remain outside this change because no corresponding backend contracts were
provided.

## Architecture

The browser continues to call same-origin Next.js Route Handlers. Route
Handlers read the HttpOnly access token, call isolated server services, and
return normalized responses. When an authenticated backend request returns
`401`, a shared server helper uses the refresh-token cookie, writes the renewed
access-token cookie, and retries the original operation exactly once.

```text
Browser UI
  -> same-origin /api/v1/auth/* Route Handler
     -> session refresh wrapper
        -> SiHEDAF backend with Authorization: Bearer <access token>
```

Browser JavaScript never receives either token.

Feature code uses this structure:

```text
src/features/profile/
├── client/
│   ├── ProfileProvider.tsx
│   ├── hooks/
│   │   ├── UseUpdatePassword.ts
│   │   └── UseUpdateProfile.ts
│   └── services/ProfileClient.ts
├── server/services/ProfileService.ts
└── shared/
    ├── ProfileSchema.ts
    └── ProfileTypes.ts
```

Session retry behavior remains under `src/features/auth/session/server`.

## Route Protection

Next.js `src/proxy.ts` performs an optimistic cookie-presence check for the
private-style routes. Requests without both usable session paths (neither an
access nor refresh cookie) are redirected to `/login`. Requests with a cookie
are allowed through so a stale access token can still be renewed.

The proxy is not treated as the authorization boundary. Every authenticated
Route Handler independently requires a valid backend session through the
session refresh wrapper. If refresh fails, both cookies are cleared and the
handler returns `401`.

## Profile Flow

`ProfileProvider` lives inside the shared dashboard shell and fetches the
current user once for all dashboard child routes. It exposes loading, error,
user, reload, and user-update state to the topbar and profile views.

The edit form sends only `{ fullname }`, matching the supplied backend contract.
Email is displayed as read-only because the backend explicitly rejects it.
`profileImage` is displayed when supplied, but the existing mock upload control
is removed because no upload endpoint exists.

## Password Flow

The password form validates all three fields in the frontend and Route Handler:

- current password is required;
- new password has at least eight characters and at most 128;
- confirmation must match the new password;
- the new password must differ from the current password.

The external payload uses the exact documented keys:
`old_password`, `new_password`, and `confirm_password`.

## Error Handling

- Browser input validation returns `422` with field errors.
- Missing or expired sessions return `401` and trigger a client redirect to
  `/login` from the shared profile provider.
- Backend validation messages are normalized to safe Indonesian copy.
- Network and malformed backend responses return `502`.
- An unauthorized authenticated request is retried once only; no retry loop is
  possible.

Success and failure actions use the existing Sonner toast integration while the
current confirmation modals remain the deliberate interaction boundary.

## Logout

`POST /api/v1/auth/logout` is a local BFF endpoint. It clears both session
cookies and returns a normalized success response. This avoids a false logout
where navigation changes but the proxy still sees an active session.

## Testing and Quality Gates

Tests cover schemas, exact external requests, bearer headers, automatic refresh
and one-time retry, cookie clearing, Route Handler validation, proxy matching,
client behavior, shared profile state source contracts, form behavior, and the
new dashboard redirect.

Completion requires fresh successful runs of:

```bash
rtk npm test
rtk npm run lint
rtk npm run build
```

## Accepted Decisions

- The user requested direct execution without another confirmation checkpoint.
- The dashboard becomes the first authenticated destination.
- Route protection combines a fast proxy check with backend-verified BFF calls.
- Email and profile image are not editable until their backend contracts exist.
- Logout is implemented locally because no backend logout endpoint was supplied.
