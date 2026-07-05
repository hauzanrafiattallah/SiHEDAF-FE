# Password Reset Flow Design

**Date:** 2026-07-05

## Objective

Add a complete public password-reset flow to SiHEDAF using the supplied backend
email, token verification, and reset endpoints while preserving the existing
auth-shell, validation, hook, toast, BFF, and security conventions.

## User Flow

1. The login page links to `/lupa-kata-sandi`.
2. The user submits an email address.
3. The same-origin BFF calls `POST /api/v1/auth/email-reset-password` and the UI
   shows a neutral success state regardless of whether the address is known.
4. The email link opens `/reset-password?token=<token>`.
5. The reset page calls the same-origin verification endpoint before rendering
   password fields.
6. A valid token unlocks the new-password form. Missing, invalid, or expired
   tokens show a safe invalid-link state with navigation back to login.
7. Successful reset clears the form, shows the themed success toast/state, and
   offers a direct return to `/login`.

## Architecture

```text
src/features/auth/password-reset/
├── client/
│   ├── hooks/
│   │   ├── UsePasswordResetEmail.ts
│   │   ├── UseResetPassword.ts
│   │   └── UseVerifyResetToken.ts
│   └── services/PasswordResetClient.ts
├── server/services/PasswordResetService.ts
└── shared/
    ├── PasswordResetSchema.ts
    └── PasswordResetTypes.ts
```

Framework endpoints remain under `src/app/api/v1/auth`:

- `POST /api/v1/auth/email-reset-password`
- `GET /api/v1/auth/verify-reset-password/[token]`
- `POST /api/v1/auth/reset-password`

UI routes remain separate from API routes:

- `/lupa-kata-sandi`
- `/reset-password?token=<token>`

## Backend Contract Decisions

The email request is treated as public because a user who has forgotten a
password cannot possess an account access token. The Authorization marker in
the supplied collection is therefore treated as inherited collection metadata.

The final reset request sends the reset token in both documented locations:
the JSON `token` field and `Authorization: Bearer <token>`. Token verification
uses the documented path parameter. Verification accepts a valid `code: 200`
envelope even though the exact success `data` shape was not supplied.

## Validation and Security

- Email is trimmed, lowercased, capped at 254 characters, and validated with
  Zod in both browser and Route Handler.
- New password uses the shared SiHEDAF policy: 8–128 characters, uppercase,
  lowercase, number, symbol, and no whitespace.
- Confirmation must match the new password.
- Reset tokens must be non-empty and length-bounded before backend use.
- Tokens are URL-encoded for the external verification path.
- Tokens are never written to cookies, localStorage, logs, toast copy, or
  normalized JSON responses.
- Network, malformed response, unknown email, invalid token, and expired token
  errors use safe Indonesian messages.

## UI

Both pages reuse `AuthShell`, `AuthInput`, Sonner, React Hook Form, and existing
SiHEDAF visual tokens. The email page has request, pending, error, and email-sent
states. The reset page has verification loading, invalid-link, form, pending,
error, and success states. Password fields retain visibility toggles and inline
accessible errors.

## Testing

Tests cover shared schemas, exact backend methods/paths/headers/bodies, safe
error normalization, Route Handler malformed and invalid inputs, browser client
requests, hook duplicate-submit guards, page/form source contracts, login link,
token non-persistence, and the full production test/lint/build gates.

## Accepted Decisions

- The user's explicit endpoint and UI request is treated as design approval
  under the standing direct-execution preference.
- The reset link contract is `/reset-password?token=...`; no dynamic public UI
  alias is added without a backend-generated email-link contract.
- Account enumeration is avoided by using the same email-sent UI copy for a
  normalized accepted response.
