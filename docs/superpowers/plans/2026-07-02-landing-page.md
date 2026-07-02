# SiHEDAF Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the supplied SiHEDAF marketing landing page as a responsive, section-based Next.js page that closely matches the visual references.

**Architecture:** `src/app/page.tsx` only composes the route. Static Server Components are divided between `src/components/sections` and reusable primitives in `src/components/ui`; all new filenames use PascalCase and all visual styling uses the existing Tailwind 4 design tokens.

**Tech Stack:** Next.js 16.2, React 19 Server Components, Tailwind CSS 4, TypeScript, Node test runner

---

### Task 1: Landing-page source contract

**Files:**
- Create: `src/app/LandingPage.test.mjs`
- Modify: `package.json`

- [x] **Step 1: Add a test that describes the component architecture**

The test must require these files: `HeaderSection.tsx`, `HeroSection.tsx`, `AboutSection.tsx`, `FeaturesSection.tsx`, `ProcessSection.tsx`, `CtaSection.tsx`, `FooterSection.tsx`, `BrandLogo.tsx`, `SectionLabel.tsx`, `ArrowIcon.tsx`, and `LineIcon.tsx`. It must verify their PascalCase basenames, ordered composition in `page.tsx`, the reference copy, `/logo.png`, `/watch.png`, anchor targets, and the absence of `use client`.

- [x] **Step 2: Expand the npm test command**

Set the script to `node --test src/app/*.test.mjs` so both the design-system and landing-page tests execute.

- [x] **Step 3: Verify RED**

Run: `rtk npm test`

Expected: the existing design-system tests pass and landing-page tests fail because the PascalCase section files do not exist.

### Task 2: Shared visual primitives and above-the-fold sections

**Files:**
- Create: `src/components/ui/BrandLogo.tsx`
- Create: `src/components/ui/SectionLabel.tsx`
- Create: `src/components/ui/ArrowIcon.tsx`
- Create: `src/components/ui/LineIcon.tsx`
- Create: `src/components/sections/HeaderSection.tsx`
- Create: `src/components/sections/HeroSection.tsx`

- [x] **Step 1: Build reusable primitives**

`BrandLogo` renders `/logo.png` through `next/image` beside the SIHEDAF wordmark. `SectionLabel` renders the small outlined pill. `ArrowIcon` and `LineIcon` provide the reference's lightweight inline SVG shapes without a client-side icon dependency.

- [x] **Step 2: Build the floating header**

Render logo, `Tentang`, `Fitur`, `Cara Kerja`, `Tim Kami`, `Daftar`, and `Masuk`, with links targeting the corresponding page anchors and mobile-safe navigation visibility.

- [x] **Step 3: Build the hero**

Render the exact headline `Deteksi Dini Risiko Stroke dengan AI`, supporting copy, two calls to action, a responsive ECG SVG, the optimized `/watch.png` image, and the soft blue radial glow.

### Task 3: Informational sections

**Files:**
- Create: `src/components/sections/AboutSection.tsx`
- Create: `src/components/sections/FeaturesSection.tsx`
- Create: `src/components/sections/ProcessSection.tsx`

- [x] **Step 1: Build the about facts panel**

Create the centered about heading and the asymmetric three-card grid containing the `5x` statistic, PPG accuracy explanation, and AI classification explanation.

- [x] **Step 2: Build the technology cards**

Create the offset `Teknologi Pemantauan Cerdas yang Kamu Butuhkan` intro and three cards for `Pemantauan Berkala`, `AI Detection`, and `Analisis Mendalam`.

- [x] **Step 3: Build the four-step process**

Create the `Langkah Sederhana, Perlindungan Maksimal` heading and four responsive steps with numbered pills and subtle separators.

### Task 4: Closing sections and route composition

**Files:**
- Create: `src/components/sections/CtaSection.tsx`
- Create: `src/components/sections/FooterSection.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`

- [x] **Step 1: Build CTA and footer**

Create the large primary-blue CTA card, white registration button, repeated brand, navigation, and copyright line matching the reference.

- [x] **Step 2: Compose the route**

Import and render every section in screenshot order inside a single page wrapper. Keep `page.tsx` lowercase because it is a required Next.js route filename.

- [x] **Step 3: Add only global behaviors**

Add smooth in-page scrolling, section scroll offset, selection color, and an off-white canvas to `globals.css`; keep section-specific styling inside the components.

- [x] **Step 4: Verify GREEN**

Run: `rtk npm test`

Expected: all design-system and landing-page source-contract tests pass.

### Task 5: Framework and visual verification

**Files:**
- Modify only the section files when visual discrepancies are found

- [x] **Step 1: Run lint and build**

Run: `rtk npm run lint` and `rtk npm run build`.

Expected: both commands exit successfully with a statically rendered `/` route.

- [x] **Step 2: Inspect the local render**

Compare desktop and mobile renders with the supplied references, focusing on section height, heading scale, card geometry, ECG/watch overlap, and spacing rhythm. If the in-app browser integration is unavailable, inspect production HTML/CSS and verify responsive class emission.

- [x] **Step 3: Audit the final diff**

Confirm all new component files are PascalCase, no `use client` boundary was introduced, and pre-existing logo/favicon changes are untouched.
