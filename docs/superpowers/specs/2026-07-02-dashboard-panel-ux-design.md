# Dashboard Panel UX Design

## Problem

The dashboard topbar displays two adjacent symbols because `DashboardShell` renders a menu button while `DashboardTopbar` renders an additional decorative placeholder before the page title. The notification rail is embedded directly in `DashboardOverview`, so it cannot share open/closed state with the topbar. Static cards also receive a global hover lift from `.dashboard-card:hover`, incorrectly suggesting clickability.

## Approved design

- Replace the hamburger/placeholder combination with one Lucide panel icon. Use `PanelLeftClose` while the sidebar is expanded and `PanelLeftOpen` while collapsed.
- Remove the decorative icon from `DashboardTopbar`; the title sits directly after the sidebar control.
- Move notification rail composition into `DashboardShell` and store `isNotificationsOpen` beside sidebar state.
- The notification rail owns its `PanelRightClose` button. Once closed, `DashboardShell` shows a fixed floating `PanelRightOpen` action at the right edge of the content, vertically aligned with the former rail-header control; the restore action does not live in the topbar. On other dashboard pages, the notification link still points to `/dashboard`.
- The rail wrapper and panel use full-height white surfaces so the right sidebar extends through the entire dashboard content height.
- Animate only notification width/opacity and interactive controls. Static cards and read-only information surfaces have no `dashboard-card` hook, hover lift, border animation, shadow, or fake click affordance.
- Preserve reduced-motion behavior, responsive stacking, sidebar collapse, and existing route composition.

## Monitoring control

- `DashboardOverview` is a focused Client Component because monitoring needs local UI state.
- Active state uses a Pause icon, outlined blue control, “Hentikan Monitoring”, green dot, and live-update copy.
- Paused state uses a Play icon, filled blue control, “Mulai Monitoring”, muted status, and a visually subdued signal chart.
- The button exposes `aria-pressed`, and status copy uses an `aria-live` region.

## Verification

Source-contract tests verify Lucide usage, explicit notification restore state, one title-side icon, notification state/controls, monitoring play/pause state, rail ownership by the shell, and the absence of `.dashboard-card:hover`. Full tests, lint, and production build must pass.
