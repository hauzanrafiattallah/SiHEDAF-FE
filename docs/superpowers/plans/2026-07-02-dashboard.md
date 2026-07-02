# SiHEDAF Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the four supplied dashboard screens with a reusable animated, collapsible dashboard shell and connect the device flow to the dashboard.

**Architecture:** A Next.js route group at `src/app/(dashboard)` supplies one persistent layout around `/dashboard`, `/riwayat`, `/profil`, and `/profil/ubah`. `DashboardShell` is the stateful Client Component; focused PascalCase view and primitive components render static reference data, SVG charts, and accessible controls without adding dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node source-contract tests.

---

## File map

- `src/app/(dashboard)/layout.tsx`: shared framework layout.
- `src/app/(dashboard)/*/page.tsx`: thin route composition files.
- `src/components/dashboard/DashboardShell.tsx`: collapse/drawer state and responsive frame.
- `src/components/dashboard/DashboardSidebar.tsx`: pathname-aware navigation.
- `src/components/dashboard/DashboardTopbar.tsx`: page title, notification, and user controls.
- `src/components/dashboard/DashboardIcon.tsx`: reusable inline icon set.
- `src/components/dashboard/SignalChart.tsx`: main animated PPG chart.
- `src/components/dashboard/Sparkline.tsx`: compact history signal trace.
- `src/components/dashboard/StatusMark.tsx`: AF/normal circular status marker.
- `src/components/dashboard/NotificationPanel.tsx`: notification rail.
- `src/components/dashboard/DashboardOverview.tsx`: dashboard overview cards.
- `src/components/dashboard/HistoryView.tsx`: history summaries and table.
- `src/components/dashboard/ProfileView.tsx`: profile summary and actions.
- `src/components/dashboard/EditProfileView.tsx`: edit form.
- `src/components/auth/ConnectDeviceForm.tsx`: successful navigation to `/dashboard`.
- `src/app/globals.css`: dashboard entry/chart/reduced-motion styles.
- `src/tests/DashboardPages.test.mjs`: dashboard source contracts.

### Task 1: Dashboard source contracts

**Files:**
- Create: `src/tests/DashboardPages.test.mjs`

- [ ] **Step 1: Write failing route and component contracts**

```js
test("dashboard routes share an animated shell", () => {
  for (const route of ["dashboard", "riwayat", "profil", "profil/ubah"]) {
    assert.equal(existsSync(join(appRoot, "(dashboard)", route, "page.tsx")), true);
  }
  assert.match(read("src/components/dashboard/DashboardShell.tsx"), /isCollapsed/);
});
```

- [ ] **Step 2: Run the new test and verify RED**

Run: `rtk npm test -- src/tests/DashboardPages.test.mjs`

Expected: FAIL because the dashboard route group and components do not yet exist.

### Task 2: Shared dashboard shell

**Files:**
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/components/dashboard/DashboardShell.tsx`
- Create: `src/components/dashboard/DashboardSidebar.tsx`
- Create: `src/components/dashboard/DashboardTopbar.tsx`
- Create: `src/components/dashboard/DashboardIcon.tsx`

- [ ] **Step 1: Add the persistent route-group layout**

```tsx
export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
```

- [ ] **Step 2: Implement responsive collapse state**

`DashboardShell` must use `useState`, `usePathname`, an `aria-expanded` toggle, animated desktop widths `210px`/`72px`, and mobile `translate-x` drawer/backdrop behavior.

- [ ] **Step 3: Implement pathname-aware sidebar and topbar**

Use `next/link` for Dashboard, Riwayat Analisis, and Profil. Active links receive a blue background and bar; the topbar title maps from the current pathname.

- [ ] **Step 4: Run the source contract**

Run: `rtk npm test -- src/tests/DashboardPages.test.mjs`

Expected: route/view assertions remain RED while shell assertions pass.

### Task 3: Dashboard overview and visual primitives

**Files:**
- Create: `src/components/dashboard/StatusMark.tsx`
- Create: `src/components/dashboard/SignalChart.tsx`
- Create: `src/components/dashboard/Sparkline.tsx`
- Create: `src/components/dashboard/NotificationPanel.tsx`
- Create: `src/components/dashboard/DashboardOverview.tsx`
- Create: `src/app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Add SVG signal and status primitives**

The main signal path uses `vectorEffect="non-scaling-stroke"` and class `signal-draw`; compact history paths accept blue/pink variants.

- [ ] **Step 2: Compose overview cards**

Render the reference labels “Selamat Datang, Armand!”, “Hasil Analisis Terakhir”, “Sinyal PPG Terbaru”, “Monitoring Terakhir”, and “Status Perangkat”, plus the right-side “Notifikasi” rail.

- [ ] **Step 3: Add the dashboard route**

```tsx
export default function DashboardPage() {
  return <DashboardOverview />;
}
```

- [ ] **Step 4: Re-run the focused contract**

Run: `rtk npm test -- src/tests/DashboardPages.test.mjs`

Expected: dashboard overview assertions pass.

### Task 4: Analysis history

**Files:**
- Create: `src/components/dashboard/HistoryView.tsx`
- Create: `src/app/(dashboard)/riwayat/page.tsx`

- [ ] **Step 1: Build the summary and history list**

Render totals 20/5/15, date-range control, six rows with time, classification, detail, sparklines, and responsive horizontal overflow.

- [ ] **Step 2: Add pagination and route composition**

The active page is visually blue; previous/next controls remain accessible buttons.

- [ ] **Step 3: Run focused tests**

Run: `rtk npm test -- src/tests/DashboardPages.test.mjs`

Expected: history contracts pass.

### Task 5: Profile and edit profile

**Files:**
- Create: `src/components/dashboard/ProfileView.tsx`
- Create: `src/components/dashboard/EditProfileView.tsx`
- Create: `src/app/(dashboard)/profil/page.tsx`
- Create: `src/app/(dashboard)/profil/ubah/page.tsx`

- [ ] **Step 1: Build the profile summary**

Render a placeholder avatar, name/email/device ID, edit link to `/profil/ubah`, password action, and logout action.

- [ ] **Step 2: Build the accessible edit form**

Inputs use associated labels, device ID is disabled, and buttons read “Batal” and “Simpan Perubahan”.

- [ ] **Step 3: Add thin route files and run focused tests**

Run: `rtk npm test -- src/tests/DashboardPages.test.mjs`

Expected: profile contracts pass.

### Task 6: Motion and device-flow integration

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/auth/ConnectDeviceForm.tsx`

- [ ] **Step 1: Add global motion utilities**

Add `dashboard-enter`, `signal-draw`, stagger helpers, card transitions, and a `prefers-reduced-motion` override.

- [ ] **Step 2: Navigate on successful device submit**

```tsx
const router = useRouter();
// after validation
router.push("/dashboard");
```

- [ ] **Step 3: Run dashboard and auth contracts**

Run: `rtk npm test -- src/tests/DashboardPages.test.mjs src/tests/AuthPages.test.mjs`

Expected: PASS.

### Task 7: Full verification and visual audit

**Files:**
- Modify only files requiring fixes found during verification.

- [ ] **Step 1: Run the full test suite**

Run: `rtk npm test`

Expected: all tests PASS.

- [ ] **Step 2: Run lint**

Run: `rtk npm run lint`

Expected: exit code 0.

- [ ] **Step 3: Run the production build**

Run: `rtk npm run build`

Expected: exit code 0 and all four dashboard routes listed.

- [ ] **Step 4: Inspect the final diff**

Run: `rtk git diff --check`

Expected: no whitespace errors.

## Self-review

- Spec coverage: all four routes, shared/collapsible/mobile navigation, notification rail, charts, profile form, animations, reduced-motion, and device routing each map to a task.
- Placeholder scan: the implementation intentionally uses a designed initials avatar because no user photograph asset was supplied; there are no deferred code placeholders.
- Type consistency: all route files compose PascalCase views; shell/sidebar/topbar state and callbacks use matching boolean/function props.
