# Responsive Scale and Motion Design

## Problem

The interface contains no CSS `zoom` or root transform. The zoomed-out appearance comes from translating measurements from downscaled reference screenshots directly into CSS: dozens of labels use 8–13px text, desktop containers stop at 1050–1200px, and the landing hero stops at a fixed 680px height. At 1440–1920px, content therefore occupies too little of the available viewport.

Native `scroll-behavior: smooth` already exists, but only anchor movement benefits from it. Landing/auth/team pages have no shared entry/reveal treatment, the header is not sticky, and the CTA ends directly against the footer.

## Approved direction

- Replace miniature fixed values with fluid, accessible values using `clamp()` or larger responsive Tailwind values.
- Expand marketing containers to 1440px and dashboard content to fill its available column.
- Make the landing hero fill the first viewport beneath the sticky header.
- Increase the public navbar height, logo, navigation, and actions while keeping it centered and sticky with blur/shadow.
- Scale auth, team, dashboard, history, profile, and edit-profile typography and controls without CSS `zoom`.
- Add route/page entry, section reveal, smoother hover/focus motion, scroll padding, overscroll behavior, and reduced-motion safeguards.
- Add visible whitespace between the CTA and footer while retaining the rounded CTA card.

## Responsive behavior

Mobile retains compact layouts and stacked content. Fluid scaling becomes most noticeable from tablet through large desktop; wide screens use more horizontal space without stretching paragraphs beyond comfortable reading lengths. Dashboard tables remain horizontally scrollable when necessary.

## Verification

A new source-contract test protects against reintroducing fixed 680px hero height, miniature navbar dimensions, non-sticky public navigation, missing CTA/footer separation, and missing global motion/scroll primitives. Existing tests, lint, and production build must remain green.
