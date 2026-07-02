# SiHEDAF Team Page Design

## Goal

Add a dedicated `/tim-kami` page matching the supplied reference and make every “Tim Kami” navigation item open that route.

## Visual composition

The page keeps the existing light SiHEDAF canvas and floating navigation. “Tim Kami” is highlighted in primary blue. Below it, a centered outlined label and two-line heading introduce the team, with `SiHEDAF` styled in the existing serif italic accent.

The team grid contains four equal portrait cards. Each card uses a subtle light-to-dark gray vertical gradient, a white role pill near the top-left, and white name/LinkedIn text near the bottom-left. Photo areas remain intentionally blank until real portraits are supplied.

## Architecture

- `src/app/tim-kami/page.tsx` is the required Next.js route file.
- `src/components/sections/TeamSection.tsx` owns the heading and team data.
- `src/components/ui/TeamCard.tsx` owns one reusable card.
- `HeaderSection.tsx` and `FooterSection.tsx` use `next/link` for route-aware navigation and remain Server Components.
- `BrandLogo.tsx` links back to the home route.

All new non-framework files use PascalCase. The required App Router filename `page.tsx` remains lowercase.

## Responsive behavior

The reference's four-column grid appears from the `md` breakpoint. Smaller screens use two columns and then one column, preserving the portrait aspect ratio. The page maintains enough minimum height to keep the footer near the viewport bottom on desktop.

## Verification

A Node source-contract test verifies the route, PascalCase components, four role labels, four blank photo cards, active team navigation, `next/link`, and the route composition. Existing tests, ESLint, and the Next.js production build must pass, and the build must emit both `/` and `/tim-kami` as static routes.
