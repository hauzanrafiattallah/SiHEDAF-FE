# SiHEDAF Landing Page Design

## Goal

Reproduce the supplied desktop landing-page references as closely as possible while preserving a clean responsive layout on phones and tablets.

## Visual composition

The page is a single light canvas with seven ordered blocks:

1. A compact floating navigation bar with the SiHEDAF logo, centered navigation, and register/login actions.
2. A centered hero with a two-line risk-detection headline, concise supporting copy, two calls to action, a blue ECG line, and the supplied watch image over a soft blue glow.
3. An about section with a pill label, an editorial serif-italic accent, and a three-card stroke-risk facts panel.
4. A feature section with an offset heading and copy followed by three white technology cards.
5. A four-step process section with numbered pills and subtle vertical separators.
6. A wide blue call-to-action panel.
7. A small footer repeating the brand, navigation, and copyright.

The supplied primary palette and Switzer font remain the design-token source. Editorial accent words use a system serif italic to match the reference without adding another font payload.

## Architecture

`src/app/page.tsx` remains the route composition file. Landing-specific Server Components live in `src/components/sections`, while reusable presentational elements live in `src/components/ui`. There are no Client Components because the current interactions are ordinary anchor links.

All new component and test filenames use PascalCase. Next.js framework files such as `page.tsx` and `layout.tsx` retain their required lowercase names.

## Responsive behavior

- Desktop follows the reference proportions using a centered maximum-width canvas.
- Tablet keeps two-column fact content where space allows and wraps navigation conservatively.
- Mobile hides the dense center navigation, stacks card grids, turns the process into a vertical list, and preserves generous spacing around the hero watch.

## Assets and accessibility

The existing `public/logo.png` and `public/watch.png` assets are rendered with `next/image`, explicit intrinsic sizes, descriptive alternative text, and priority only for above-the-fold images. Sections expose stable anchor IDs matching header links. The page contains one `h1`, descriptive section headings, and visible keyboard focus styles.

## Verification

A Node source-contract test verifies component boundaries, required content, PascalCase filenames, anchor targets, asset usage, and absence of unnecessary Client Components. ESLint and a production build verify the Next.js integration. Final visual tuning uses a local render when the in-app browser is available, with production HTML/CSS inspection as the deterministic fallback.
