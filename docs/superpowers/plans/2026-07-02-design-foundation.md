# SiHEDAF Design Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install the supplied Switzer typography and ten-color primary palette as the global SiHEDAF design foundation.

**Architecture:** The root layout loads one official, self-hosted Switzer variable WOFF2 through `next/font/local`. Global CSS is the single source for Tailwind color tokens, semantic colors, font family, and tracking.

**Tech Stack:** Next.js 16.2, React 19, Tailwind CSS 4, TypeScript, Node test runner

---

### Task 1: Add executable design-token checks

**Files:**
- Create: `src/app/design-system.test.mjs`
- Modify: `package.json`

- [x] **Step 1: Add a Node test for the required source contract**

Create tests that read `globals.css` and `layout.tsx`, assert all ten palette entries, assert `letter-spacing: -0.02em`, and assert the local Switzer variable font configuration.

- [x] **Step 2: Add the test script**

Add `"test": "node --test src/app/design-system.test.mjs"` to `package.json`.

- [x] **Step 3: Run the test to verify RED**

Run: `rtk npm test`

Expected: FAIL because the existing Geist setup and starter color tokens do not meet the design contract.

### Task 2: Install Switzer globally

**Files:**
- Create: `src/app/fonts/switzer-variable.woff2`
- Modify: `src/app/layout.tsx`

- [x] **Step 1: Download the official Fontshare variable WOFF2**

Download the WOFF2 exposed by Fontshare's official Switzer variable CSS response into `src/app/fonts/switzer-variable.woff2`.

- [x] **Step 2: Replace the starter fonts in the root layout**

Use `next/font/local` with source `./fonts/switzer-variable.woff2`, weight `100 900`, normal style, swap display, and variable `--font-switzer`. Apply `switzer.variable` to `<html lang="id">` and update metadata to SiHEDAF.

### Task 3: Install color and typography tokens

**Files:**
- Modify: `src/app/globals.css`

- [x] **Step 1: Add the exact primary ramp**

Map the ten supplied hex values to Tailwind tokens `--color-primary-50` through `--color-primary-900`.

- [x] **Step 2: Add semantic tokens**

Expose white background, `primary-900` foreground, `primary-500` primary, and white primary foreground through Tailwind's inline theme mappings.

- [x] **Step 3: Apply global typography**

Set the body font to `var(--font-switzer)` with sans-serif fallbacks and set `letter-spacing: -0.02em`.

- [x] **Step 4: Run the focused test to verify GREEN**

Run: `rtk npm test`

Expected: all design foundation tests pass.

### Task 4: Framework and visual verification

**Files:**
- No source changes expected

- [x] **Step 1: Run lint**

Run: `rtk npm run lint`

Expected: exit code 0 with no ESLint errors.

- [x] **Step 2: Run a production build**

Run: `rtk npm run build`

Expected: exit code 0 and a successful Next.js production build.

- [x] **Step 3: Inspect the production CSS bundle**

Confirm the generated bundle includes the Switzer family, `letter-spacing: -0.02em`, all ten primary tokens, `#002758` foreground, and a white background. This is the deterministic fallback when the in-app browser integration is unavailable.
