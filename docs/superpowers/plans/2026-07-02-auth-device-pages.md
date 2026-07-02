# SiHEDAF Authentication and Device Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build responsive login, registration, and device-connection pages matching the supplied active/inactive UI references.

**Architecture:** Three App Router pages compose a shared Server Component shell around focused Client Form components. The forms own only input state, password visibility, button activation, and fixed internal navigation; no credentials are persisted or transmitted.

**Tech Stack:** Next.js 16.2 App Router, React 19, Tailwind CSS 4, TypeScript, Node test runner

---

### Task 1: Authentication-page source contract

**Files:**
- Create: `src/app/AuthPages.test.mjs`

- [x] **Step 1: Describe required routes and PascalCase components**

Require `login/page.tsx`, `register/page.tsx`, `hubungkan-perangkat/page.tsx`, `AuthShell.tsx`, `AuthVisualPanel.tsx`, `AuthInput.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`, and `ConnectDeviceForm.tsx`.

- [x] **Step 2: Describe interaction and navigation contracts**

Verify exact form labels, required inputs, disabled buttons, `useState`, password toggles, fixed `router.push` destinations, shared shell composition, and `/login` plus `/register` links in the landing navigation.

- [x] **Step 3: Verify RED**

Run: `rtk npm test`

Expected: existing tests pass while the auth-page contract fails because the routes and components do not exist and landing links still target the CTA anchor.

### Task 2: Shared authentication shell

**Files:**
- Create: `src/components/auth/AuthShell.tsx`
- Create: `src/components/auth/AuthVisualPanel.tsx`
- Create: `src/components/auth/AuthInput.tsx`

- [x] **Step 1: Build the visual panel**

Render the SiHEDAF brand, route-specific heading/copy, pale blue gradient, and optimized `/watch.png` image. Hide the decorative panel below the large breakpoint.

- [x] **Step 2: Build the shared shell and footer**

Compose the left panel, centered right-side content, and a compact full-width footer. Accept typed props for the headline, italic accent, description, and form children.

- [x] **Step 3: Build the reusable input**

Render an accessible label/input pair with a rounded border, blue focus state, and optional password visibility button.

### Task 3: Interactive forms

**Files:**
- Create: `src/components/auth/LoginForm.tsx`
- Create: `src/components/auth/RegisterForm.tsx`
- Create: `src/components/auth/ConnectDeviceForm.tsx`

- [x] **Step 1: Build login states**

Track email and password, disable the submit button until both are complete, and navigate to `/hubungkan-perangkat` on valid submit.

- [x] **Step 2: Build registration states**

Track full name, email, password, and confirmation; activate only when all fields are complete and passwords match; navigate to `/login` on submit.

- [x] **Step 3: Build device states**

Track Device ID and activate “Hubungkan perangkat” only when the value is non-empty. Prevent the placeholder form from transmitting data.

### Task 4: Routes and landing integration

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/register/page.tsx`
- Create: `src/app/hubungkan-perangkat/page.tsx`
- Modify: `src/components/sections/HeaderSection.tsx`
- Modify: `src/components/sections/CtaSection.tsx`

- [x] **Step 1: Compose all three routes**

Add route-specific metadata, visual copy, eyebrow labels, and the corresponding form component inside `AuthShell`.

- [x] **Step 2: Connect landing actions**

Point header “Daftar” to `/register`, header “Masuk” to `/login`, and the CTA registration button to `/register` using `next/link`.

- [x] **Step 3: Verify GREEN**

Run: `rtk npm test`

Expected: all design, landing, team, authentication, and device source-contract tests pass.

### Task 5: Framework and production verification

**Files:**
- Modify only authentication files when verification exposes a discrepancy

- [x] **Step 1: Run lint and build**

Run: `rtk npm run lint` and `rtk npm run build`.

Expected: both succeed and emit `/login`, `/register`, and `/hubungkan-perangkat` routes.

- [x] **Step 2: Inspect production HTML and CSS**

Confirm all three routes return HTTP 200, share the split shell/watch asset, emit inactive and active button classes, and include mobile/desktop responsive rules.

- [x] **Step 3: Audit the final diff**

Confirm all new non-framework files are PascalCase, only the three form components are Client Components, and user-provided image assets remain untouched.
