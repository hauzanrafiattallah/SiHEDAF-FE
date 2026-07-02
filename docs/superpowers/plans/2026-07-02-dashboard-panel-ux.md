# Dashboard Panel UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove duplicated dashboard icons, make the notification rail hideable, and remove misleading motion from static cards.

**Architecture:** `DashboardShell` owns both left-sidebar and right-notification state. Lucide supplies semantic panel open/close icons; overview pages remain focused on content and global CSS no longer animates static cards.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Lucide React, Node source-contract tests.

---

### Task 1: Regression test

**Files:**
- Create: `src/tests/DashboardPanelUx.test.mjs`

- [ ] Assert `lucide-react` is a runtime dependency.
- [ ] Assert shell uses panel open/close icons and notification state.
- [ ] Assert topbar no longer renders its decorative line icon.
- [ ] Assert notification panel exposes a close control and overview no longer owns the rail.
- [ ] Assert global CSS has no `.dashboard-card:hover` selector.
- [ ] Run the focused test and confirm RED.

### Task 2: Semantic icons and panel state

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/components/dashboard/DashboardShell.tsx`
- Modify: `src/components/dashboard/DashboardTopbar.tsx`
- Modify: `src/components/dashboard/NotificationPanel.tsx`
- Modify: `src/components/dashboard/DashboardOverview.tsx`
- Modify: `src/components/dashboard/DashboardIcon.tsx`

- [ ] Install `lucide-react`.
- [ ] Replace menu icons with `PanelLeftClose` and `PanelLeftOpen`.
- [ ] Add `isNotificationsOpen`, bell toggle, close button, and responsive rail width/opacity transition.
- [ ] Remove the decorative topbar icon and the overview-owned rail.

### Task 3: Static-card motion cleanup

**Files:**
- Modify: `src/app/globals.css`

- [ ] Remove `.dashboard-card` transition and `.dashboard-card:hover` lift/shadow rules.
- [ ] Keep motion for buttons, links, inputs, drawers, page entry, and SVG signals.

### Task 4: Explicit restore and monitoring control

**Files:**
- Modify: `src/components/dashboard/DashboardTopbar.tsx`
- Modify: `src/components/dashboard/DashboardOverview.tsx`
- Modify: `src/components/dashboard/SignalChart.tsx`
- Test: `src/tests/DashboardInteractions.test.mjs`

- [ ] Add failing contracts for `PanelRightOpen/Close`, Play/Pause, `aria-pressed`, and monitoring state.
- [ ] Keep close inside the full-height rail and render restore as a floating right-edge `PanelRightOpen` action outside the topbar.
- [ ] Make overview monitoring stateful and update label, tone, icon, and signal presentation.
- [ ] Run the focused interaction test and confirm GREEN.

### Task 5: Verification

**Files:**
- Modify only files requiring verification fixes.

- [ ] Run `rtk npm test`.
- [ ] Run `rtk npm run lint`.
- [ ] Run `rtk npm run build`.
- [ ] Run `rtk git diff --check`.

## Self-review

- Notification rail can be closed and reopened.
- No static card communicates false clickability.
- All newly introduced controls have accessible labels and expanded state.
- No dashboard route beyond the requested shell/overview behavior is changed.
