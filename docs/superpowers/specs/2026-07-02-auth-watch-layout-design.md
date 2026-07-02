# Auth Watch Layout Design

## Root cause

`AuthVisualPanel` positions the logo, copy, and watch with three independent absolute offsets. Larger fluid typography increases the copy height while the watch remains anchored to `bottom: 4%`, causing the watch to overlap the description on shorter desktop viewports.

## Approved design

- Keep one shared visual panel for login, register, and device connection.
- Replace independent absolute positioning with a full-height vertical flex layout.
- Place logo first, title/description in normal flow, and the watch inside a dedicated `mt-auto` flex region below the copy.
- Constrain the watch with fluid width and viewport-relative `max-height` while preserving its aspect ratio with `object-contain`.
- Keep the visual panel hidden below the existing `lg` breakpoint.
- Do not change authentication behavior or right-side forms.

## Verification

A source-contract test ensures the watch is no longer absolutely bottom-positioned, appears after the description, and uses a flexible non-overlapping image region. Existing tests, lint, and production build must pass.
