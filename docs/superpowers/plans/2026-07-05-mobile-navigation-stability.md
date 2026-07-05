# Mobile Navigation Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the public mobile menu float over page content and keep the sticky navbar visually stable during mobile scrolling.

**Architecture:** Keep `HeaderSection` server-rendered and move only hamburger state into a small `MobileNavigation` Client Component. Share static navigation data through a framework-agnostic module, position the expanded menu absolutely below the fixed-height sticky header, and remove the retained page-wrapper transform when entry motion finishes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node.js native test runner.

---

### Task 1: Add failing navigation stability contracts

**Files:**
- Modify: `src/tests/ResponsiveScaleMotion.test.mjs`
- Test: `src/tests/ResponsiveScaleMotion.test.mjs`

- [ ] **Step 1: Write the failing tests**

Add these tests:

```js
test("floats the mobile menu without turning the public header into a client boundary", async () => {
  const [header, mobileNavigation] = await Promise.all([
    readSource("components/sections/HeaderSection.tsx"),
    readSource("components/sections/MobileNavigation.tsx").catch(() => ""),
  ]);
  const navigationSource = `${header}\n${mobileNavigation}`;

  assert.match(navigationSource, /data-mobile-menu-overlay/);
  assert.match(navigationSource, /absolute inset-x-0 top-\[96px\]/);
  assert.doesNotMatch(header, /["']use client["']/);
  assert.match(mobileNavigation, /["']use client["']/);
});

test("releases the page transform after entry motion for stable sticky navigation", async () => {
  const globalStyles = await readSource("app/globals.css");
  const pageEnterStart = globalStyles.indexOf("@keyframes page-enter");
  const pageEnterEnd = globalStyles.indexOf(
    "@keyframes section-reveal",
    pageEnterStart,
  );
  const pageEnterKeyframes = globalStyles.slice(pageEnterStart, pageEnterEnd);

  assert.match(pageEnterKeyframes, /to\s*{[^}]*transform:\s*none/s);
});
```

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test src/tests/ResponsiveScaleMotion.test.mjs`

Expected: both new tests fail because the menu is still in normal flow, `HeaderSection` is still a Client Component, and the animation ends with `translateY(0)`.

### Task 2: Restore the Server/Client boundary and overlay the mobile menu

**Files:**
- Create: `src/components/sections/PublicNavigation.ts`
- Create: `src/components/sections/MobileNavigation.tsx`
- Modify: `src/components/sections/HeaderSection.tsx`
- Test: `src/tests/ResponsiveScaleMotion.test.mjs`

- [ ] **Step 1: Create shared navigation data**

Create:

```ts
export type PublicPage = "home" | "team";

export const publicNavigation = [
  { label: "Tentang", href: "/#tentang", page: "home" },
  { label: "Fitur", href: "/#fitur", page: "home" },
  { label: "Cara Kerja", href: "/#cara-kerja", page: "home" },
  { label: "Tim Kami", href: "/tim-kami", page: "team" },
] as const;
```

- [ ] **Step 2: Create the focused Client Component**

Create `MobileNavigation.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import {
  publicNavigation,
  type PublicPage,
} from "@/components/sections/PublicNavigation";

type MobileNavigationProps = {
  activePage: PublicPage;
};

export function MobileNavigation({ activePage }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        aria-controls="mobile-navigation-menu"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
        className="grid h-10 w-10 place-items-center rounded-full text-primary-900/60 transition-colors duration-300 hover:bg-primary-50 hover:text-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 md:hidden"
        onClick={() => setIsMenuOpen((open) => !open)}
        type="button"
      >
        {isMenuOpen ? (
          <X aria-hidden="true" size={20} strokeWidth={2} />
        ) : (
          <Menu aria-hidden="true" size={20} strokeWidth={2} />
        )}
      </button>

      {isMenuOpen ? (
        <div
          className="absolute inset-x-0 top-[96px] z-10 md:hidden"
          data-mobile-menu-overlay
        >
          <div
            className="modal-enter mx-auto w-[calc(100%-32px)] max-w-[1440px] overflow-hidden rounded-[20px] border border-primary-900/[0.06] bg-white shadow-[0_14px_42px_rgba(0,39,88,0.08)] sm:w-[calc(100%-64px)]"
            id="mobile-navigation-menu"
          >
            <nav aria-label="Menu mobile" className="flex flex-col py-3">
              {publicNavigation.map((item) => {
                const isActive =
                  item.page === "team" && activePage === "team";

                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`px-6 py-3.5 text-[14px] font-medium transition-colors duration-200 hover:bg-primary-50 hover:text-primary-500 ${
                      isActive ? "text-primary-300" : "text-primary-900/55"
                    }`}
                    href={item.href}
                    key={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-3 border-t border-primary-900/[0.06] px-6 py-5">
              <Link
                className="flex h-12 items-center justify-center rounded-full border border-primary-300/30 text-[13px] font-semibold text-primary-400 transition-colors duration-300 hover:bg-primary-50"
                href="/register"
                onClick={() => setIsMenuOpen(false)}
              >
                Daftar
              </Link>
              <Link
                className="flex h-12 items-center justify-center rounded-full bg-primary-300 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(0,110,251,0.22)] transition-[background-color] duration-300 hover:bg-primary-400"
                href="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
```

- [ ] **Step 3: Make HeaderSection static again**

Remove `"use client"`, `useState`, and mobile icon imports from `HeaderSection.tsx`. Import the shared navigation and `MobileNavigation`, use `PublicPage` for the prop, add `relative` to the sticky header, render `<MobileNavigation activePage={activePage} />` in the action row, delete the old inline mobile menu, and replace the navbar-card surface classes with:

```tsx
className="mx-auto flex h-[72px] w-[calc(100%-32px)] max-w-[1440px] items-center justify-between rounded-[24px] border border-primary-900/[0.06] bg-white px-5 shadow-[0_14px_42px_rgba(0,39,88,0.08)] sm:w-[calc(100%-64px)] md:bg-white/90 md:px-7 md:backdrop-blur-xl"
```

- [ ] **Step 4: Run the focused test**

Run: `node --test src/tests/ResponsiveScaleMotion.test.mjs`

Expected: the overlay and Server/Client boundary contract passes; the animation contract remains red until Task 3.

### Task 3: Remove the sticky ancestor's retained transform

**Files:**
- Modify: `src/app/globals.css`
- Test: `src/tests/ResponsiveScaleMotion.test.mjs`

- [ ] **Step 1: Apply the minimal animation fix**

Change only the final page-entry keyframe:

```css
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Run the focused test to verify GREEN**

Run: `node --test src/tests/ResponsiveScaleMotion.test.mjs`

Expected: all focused tests pass.

### Task 4: Verify the complete application

**Files:**
- Verify: `src/components/sections/HeaderSection.tsx`
- Verify: `src/components/sections/MobileNavigation.tsx`
- Verify: `src/app/globals.css`
- Verify: `src/tests/ResponsiveScaleMotion.test.mjs`

- [ ] **Step 1: Run all source-contract tests**

Run: `npm test`

Expected: all tests pass, including the two previously failing Server Component contracts.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: exit code 0 with all routes generated.

- [ ] **Step 4: Verify mobile behavior**

At a 360–390px viewport, record the hero's top position before and after opening the hamburger menu; the values must be identical. Scroll with the menu closed and open and confirm the navbar remains at the same viewport position without visible shaking. Confirm the menu still closes from the X control and every navigation link.
