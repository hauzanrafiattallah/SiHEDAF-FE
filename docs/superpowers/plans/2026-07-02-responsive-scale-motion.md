# Responsive Scale and Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the zoomed-out appearance across all routes and add sticky navigation, smooth motion, and CTA/footer separation.

**Architecture:** Keep the existing component boundaries and correct scale at the source instead of applying CSS zoom. Global CSS owns scroll/motion primitives; each route family receives appropriate fluid typography, spacing, and container widths.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node source-contract tests.

---

### Task 1: Regression contracts

**Files:**
- Create: `src/tests/ResponsiveScaleMotion.test.mjs`

- [ ] Assert that the public header is sticky, at least 64px tall, and uses a 1440px container.
- [ ] Assert that the hero uses viewport-relative minimum height rather than fixed 680px.
- [ ] Assert that CTA/footer separation and global smooth-scroll/motion classes exist.
- [ ] Assert that dashboard and auth shells expose full-height/fluid-scale markers.
- [ ] Run `rtk npm test -- src/tests/ResponsiveScaleMotion.test.mjs` and confirm RED for the missing contracts.

### Task 2: Global scroll and motion foundation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] Add scroll padding, overscroll behavior, horizontal clipping, scrollbar styling, and touch scrolling.
- [ ] Add reusable `page-enter`, `section-reveal`, and interactive transition styles.
- [ ] Keep all motion disabled by the existing reduced-motion media query.

### Task 3: Landing, navigation, and CTA/footer

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/tim-kami/page.tsx`
- Modify: `src/components/sections/HeaderSection.tsx`
- Modify: `src/components/sections/HeroSection.tsx`
- Modify: `src/components/sections/AboutSection.tsx`
- Modify: `src/components/sections/FeaturesSection.tsx`
- Modify: `src/components/sections/ProcessSection.tsx`
- Modify: `src/components/sections/CtaSection.tsx`
- Modify: `src/components/sections/FooterSection.tsx`
- Modify: `src/components/sections/TeamSection.tsx`
- Modify: `src/components/ui/BrandLogo.tsx`
- Modify: `src/components/ui/SectionLabel.tsx`
- Modify: `src/components/ui/TeamCard.tsx`

- [ ] Make the public header sticky with larger logo, navigation, and buttons.
- [ ] Make the hero fill the first viewport and scale title/body/watch fluidly.
- [ ] Expand section containers to 1440px and raise body copy to readable sizes.
- [ ] Add reveal classes and comfortable section rhythm.
- [ ] Add CTA bottom margin/padding before the footer and scale footer content.

### Task 4: Auth and team scale

**Files:**
- Modify: `src/components/auth/AuthShell.tsx`
- Modify: `src/components/auth/AuthVisualPanel.tsx`
- Modify: `src/components/auth/AuthInput.tsx`
- Modify: `src/components/auth/LoginForm.tsx`
- Modify: `src/components/auth/RegisterForm.tsx`
- Modify: `src/components/auth/ConnectDeviceForm.tsx`

- [ ] Increase form labels, inputs, actions, panel copy, footer, and content width.
- [ ] Preserve full-height split layout and mobile stacking.

### Task 5: Dashboard scale

**Files:**
- Modify: all PascalCase files under `src/components/dashboard` that contain visual scale values.

- [ ] Increase sidebar/topbar, content headings, cards, table copy, notifications, controls, and profile forms.
- [ ] Widen sidebar/notification rail/content caps proportionally and keep collapse/mobile behavior.
- [ ] Preserve charts, overflow behavior, and active navigation.

### Task 6: Verification

**Files:**
- Modify only files requiring fixes discovered by verification.

- [ ] Run `rtk npm test` and confirm all tests pass.
- [ ] Run `rtk npm run lint` and confirm no errors.
- [ ] Run `rtk npm run build` and confirm all routes compile.
- [ ] Run `rtk git diff --check` and confirm no whitespace errors.

## Self-review

- Coverage: all public, auth, team, and dashboard routes are included; sticky navigation and CTA/footer separation are explicit.
- No CSS zoom or transform scaling is introduced.
- Motion remains compatible with `prefers-reduced-motion`.
- No new runtime dependency is required.
