# Auth Watch Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the shared auth watch image from overlapping title or description content at desktop viewport heights.

**Architecture:** Keep `AuthVisualPanel` as one shared component and replace its absolute children with a vertical flex flow. The image receives the remaining panel space and viewport-relative size constraints.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Node source-contract tests.

---

### Task 1: Regression contract

**Files:**
- Create: `src/tests/AuthVisualLayout.test.mjs`

- [ ] Assert the panel uses `flex h-full flex-col`.
- [ ] Assert the watch lives in an `mt-auto` area with `max-h` and `object-contain`.
- [ ] Assert the watch does not use `absolute bottom-*` positioning.
- [ ] Run the focused test and confirm RED.

### Task 2: Shared panel flow

**Files:**
- Modify: `src/components/auth/AuthVisualPanel.tsx`

- [ ] Place logo, copy, and watch into one full-height padded flex container.
- [ ] Keep copy width readable and use height-aware typography.
- [ ] Render the watch after copy in a flexible bottom region.
- [ ] Run the focused test and confirm GREEN.

### Task 3: Verification

**Files:**
- Modify only files requiring verification fixes.

- [ ] Run `rtk npm test`.
- [ ] Run `rtk npm run lint`.
- [ ] Run `rtk npm run build`.
- [ ] Run `rtk git diff --check`.

## Self-review

- All three auth routes consume the same corrected panel.
- No auth flow or form behavior changes.
- Watch dimensions remain responsive without overlapping text.
