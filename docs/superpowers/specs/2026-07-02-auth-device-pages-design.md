# SiHEDAF Authentication and Device Pages Design

## Goal

Add `/login`, `/register`, and `/hubungkan-perangkat` pages matching the supplied inactive and active form references.

## Scope

This iteration implements the full UI flow and client-side state only. It does not store credentials, call an authentication API, or connect to physical hardware. Login submission navigates to the device page, registration submission navigates to login, and device submission remains on its page.

## Shared visual shell

All three routes use a full-viewport split layout:

- The left panel has a pale blue gradient, SiHEDAF brand, route-specific editorial heading and supporting text, and the supplied watch image near the bottom.
- The right panel contains the focused form in a narrow centered column.
- A compact footer spans the page with the brand at left and copyright at right.

On smaller screens the decorative left panel is hidden so the form remains comfortable and legible.

## Form behavior

- Empty required fields produce the inactive gray button state shown in the reference.
- Complete valid fields produce the primary-blue active state.
- Email inputs use native email validation and every input is required.
- Password inputs include accessible visibility toggles.
- Registration requires matching password and confirmation values before activation.
- Submit handlers use the App Router `useRouter` API only with fixed internal destinations.

## Architecture

- `src/components/auth/AuthShell.tsx` composes the shared split layout and footer.
- `src/components/auth/AuthVisualPanel.tsx` owns the route-specific left panel.
- `src/components/auth/AuthInput.tsx` owns labels, inputs, focus styles, and password visibility.
- `LoginForm.tsx`, `RegisterForm.tsx`, and `ConnectDeviceForm.tsx` are isolated Client Components.
- Required App Router files live at `src/app/login/page.tsx`, `src/app/register/page.tsx`, and `src/app/hubungkan-perangkat/page.tsx`.

All non-framework files use PascalCase. The required `page.tsx` names remain lowercase.

## Navigation integration

Header “Daftar” links to `/register` and “Masuk” links to `/login`. The landing CTA registration button also links to `/register`. Cross-links between login and registration use `next/link`.

## Verification

Node source-contract tests verify route composition, PascalCase files, exact field labels, disabled-state logic, password toggles, fixed router destinations, shared shell reuse, and navigation integration. ESLint and the production build must pass and emit all three new routes.
