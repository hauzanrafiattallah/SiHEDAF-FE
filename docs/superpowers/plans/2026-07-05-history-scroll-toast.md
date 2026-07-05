# Responsive History Scroll and Toast Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a themed horizontal scrollbar only when history content overflows, make history pagination responsive, and align Sonner toast styling with SiHEDAF.

**Architecture:** A reusable Radix Scroll Area wrapper owns overflow behavior and scrollbar styling. `HistoryView` owns table and pagination breakpoints, while `AppToaster` remains the single theme boundary for all existing toast calls.

**Tech Stack:** Next.js 16.2, React 19.2, Tailwind CSS 4, Radix Scroll Area, Sonner 2, Lucide React, Node test runner.

---

## Task 1: Reusable Auto Scroll Area

**Files:**

- Modify `package.json` and `package-lock.json`.
- Create `src/components/ui/ScrollArea.tsx`.
- Create `src/tests/ScrollArea.test.mjs`.

- [ ] Write a source-contract test requiring `@radix-ui/react-scroll-area`,
  `type="auto"`, a horizontal `Scrollbar`, a `Viewport`, and a themed `Thumb`.
- [ ] Run `rtk npx tsx --test src/tests/ScrollArea.test.mjs` and confirm RED
  because the dependency and component do not exist.
- [ ] Install `@radix-ui/react-scroll-area` and implement a client component
  accepting `children`, `className`, and `viewportClassName`.
- [ ] Run the focused test and commit.

## Task 2: Responsive History Table and Pagination

**Files:**

- Modify `src/components/dashboard/HistoryView.tsx`.
- Modify `src/tests/DashboardActionFlows.test.mjs`.
- Modify `src/tests/ResponsiveScaleMotion.test.mjs`.

- [ ] Add failing source contracts requiring `<ScrollArea>`,
  `min-w-[680px]`, mobile `currentPage / totalPages`, desktop numbered-page
  controls, and responsive footer stacking.
- [ ] Run the focused tests and confirm RED against the current native
  `overflow-x-auto`, `min-w-[900px]`, and overflowing pagination.
- [ ] Replace the native overflow wrapper with `ScrollArea`; tune table and
  cell spacing; add compact mobile pagination and a responsive page-size row.
- [ ] Run focused and full tests, then commit.

## Task 3: SiHEDAF Sonner Theme

**Files:**

- Modify `src/components/ui/AppToaster.tsx`.
- Modify `src/tests/RegisterIntegration.test.mjs`.
- Create `src/tests/ToastTheme.test.mjs`.

- [ ] Write failing contracts for branded Lucide icons, light theme, responsive
  offsets, primary/info, semantic success, AF/error, warning, close button,
  title, description, and action-button classes.
- [ ] Run the focused test and confirm RED against the current generic toast.
- [ ] Configure the centralized Sonner `Toaster` with themed icons and static
  Tailwind class names matching the SiHEDAF palette.
- [ ] Run focused and full tests, lint, then commit.

## Task 4: Verification and Integration

- [ ] Run `rtk npm test`, `rtk npm run lint`, and `rtk npm run build`.
- [ ] Verify desktop and mobile `/riwayat` behavior in the in-app browser,
  including scroll range, scrollbar visibility state, and page-level overflow.
- [ ] Inspect the final diff for unrelated changes and accessibility regressions.
- [ ] Merge the feature branch to `main`, rerun tests and lint, then clean the
  worktree and feature branch.
