# Dashboard Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengaktifkan kontrol dashboard, history, dan profil sebagai simulasi frontend yang siap dihubungkan ke backend.

**Architecture:** Komponen view interaktif menjadi Client Components dengan state terkontrol. Calendar dan modal diisolasi menjadi komponen PascalCase reusable; data history mock dipaginasi di view tanpa mengubah route atau dashboard shell.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide React, `@daypicker/react`, Node test runner.

---

### Task 1: Interaction contracts and dependency

**Files:**
- Create: `src/tests/DashboardActionFlows.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

- [x] **Step 1: Write the failing source-contract test**

```js
assert.match(historySource, /currentPage/);
assert.match(profileSource, /DashboardModal/);
assert.match(editSource, /accept="image\/*"/);
```

- [x] **Step 2: Run test to verify it fails**

Run: `rtk node --test src/tests/DashboardActionFlows.test.mjs`
Expected: FAIL because the interaction components and state do not exist.

- [x] **Step 3: Install the calendar dependency**

Run: `rtk npm install @daypicker/react`
Expected: `package.json` and lockfile contain `@daypicker/react`.

### Task 2: Shared calendar and modal primitives

**Files:**
- Create: `src/components/dashboard/DashboardModal.tsx`
- Create: `src/components/dashboard/DateRangePicker.tsx`
- Modify: `src/app/globals.css`

- [x] **Step 1: Add an accessible modal primitive**

```tsx
<section aria-modal="true" role="dialog" aria-labelledby={titleId}>
  {children}
</section>
```

- [x] **Step 2: Add controlled range selection**

```tsx
<DayPicker mode="range" selected={draftRange} onSelect={setDraftRange} />
```

- [x] **Step 3: Theme the calendar**

```css
.rdp-root { --rdp-accent-color: #006efb; }
```

### Task 3: Dashboard and history controls

**Files:**
- Modify: `src/components/dashboard/DashboardTopbar.tsx`
- Modify: `src/components/dashboard/DashboardOverview.tsx`
- Modify: `src/components/dashboard/HistoryView.tsx`

- [x] **Step 1: Link the user pill to profile**

```tsx
<Link href="/profil">Armand Setya</Link>
```

- [x] **Step 2: Make monitoring range controlled**

```tsx
<select value={monitoringRange} onChange={(event) => setMonitoringRange(event.target.value)} />
```

- [x] **Step 3: Paginate mock history data**

```ts
const visibleRows = historyRows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
```

- [x] **Step 4: Connect the date-range picker and reset pagination on change**

```tsx
<DateRangePicker value={dateRange} onChange={(range) => { setDateRange(range); setCurrentPage(1); }} />
```

### Task 4: Profile actions and avatar upload

**Files:**
- Modify: `src/components/dashboard/ProfileView.tsx`
- Modify: `src/components/dashboard/EditProfileView.tsx`

- [x] **Step 1: Add password and logout modals**

```tsx
<DashboardModal open={activeModal === "password"} title="Ubah kata sandi">...</DashboardModal>
```

- [x] **Step 2: Make edit fields controlled and route cancel to profile**

```tsx
<form onSubmit={handleSubmit}>...</form>
```

- [x] **Step 3: Add image upload preview**

```ts
const reader = new FileReader();
reader.onload = () => setAvatarPreview(String(reader.result));
reader.readAsDataURL(file);
```

- [x] **Step 4: Simulate success and logout navigation**

```ts
router.push("/login");
```

### Task 5: Documentation and verification

**Files:**
- Modify: `AGENTS.md`

- [x] **Step 1: Document active interactions and backend boundaries**

```md
- Calendar, pagination, profile actions, and upload preview currently use local UI state.
```

- [x] **Step 2: Run the focused and full quality gates**

Run: `rtk npm test && rtk npm run lint && rtk npm run build`
Expected: all tests pass, ESLint exits 0, and production build completes.
