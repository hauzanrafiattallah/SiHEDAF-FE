# SiHEDAF Dashboard Design

## Goal

Build the supplied SiHEDAF dashboard, analysis history, profile, and edit-profile interfaces with a reusable animated navigation shell.

## Routes

- `/dashboard` — overview, latest analysis, live PPG chart, recent monitoring, device status, and notification rail.
- `/riwayat` — analysis totals, date range, paginated history list, classification status, and compact signal traces.
- `/profil` — account summary, profile information, password action, and logout action.
- `/profil/ubah` — editable name/email form, immutable device ID, photo placeholder, and save/cancel actions.

All routes live under a private `(dashboard)` route group so they share one nested layout without changing public URLs.

## Shared shell

`DashboardShell` is the only Client Component at the layout level. It owns sidebar state and reads the current pathname. Desktop navigation animates between a full 210px sidebar and a 72px icon rail. Mobile navigation animates as an off-canvas drawer with a backdrop. The top bar contains the current section title, notification icon, and user pill.

The shared shell preserves its collapse state while navigating between child pages, following the installed Next.js nested-layout model.

## Dashboard overview

The main dashboard uses a wide content column plus a right notification rail. It contains:

- a welcome heading;
- a pale-blue latest-analysis card with Normal Rhythm status;
- a white PPG chart card with monitoring state and range controls;
- recent monitoring and device-status cards;
- a notification list matching the supplied AF events.

Charts use lightweight inline SVG paths, not a chart dependency.

## History and profile views

History uses three summary cards and a responsive history table with six visible rows, status badges, sparklines, and pagination. Profile uses a narrow content column, gradient identity card, information table, and action rows. Edit profile uses the same column width and an accessible form card.

No real health data or account mutation is implemented in this UI iteration.

## Motion and responsiveness

- Sidebar width/transform and label opacity animate over roughly 300ms.
- Page content fades and translates in on route entry.
- Cards lift subtly on hover.
- Main chart line uses a short SVG draw animation.
- `prefers-reduced-motion` disables nonessential animation.
- On smaller screens, grids stack, the notification rail moves below the main dashboard, and wide history content becomes horizontally scrollable.

## Flow integration

Successful placeholder device submission navigates to `/dashboard`. Dashboard navigation uses `next/link`; profile edit links to `/profil/ubah`.

## Verification

Source-contract tests verify route files, PascalCase dashboard components, route-group layout composition, sidebar collapse state, pathname-aware active navigation, animation classes, required reference copy, and device-flow routing. Existing tests, ESLint, and the production build must pass with all four dashboard routes emitted.
