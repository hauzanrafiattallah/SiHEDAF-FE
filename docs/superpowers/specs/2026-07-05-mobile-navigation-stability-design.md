# Mobile Navigation Stability Design

## Problem

The public mobile menu is rendered as a normal-flow child of the sticky header. Opening it increases the header height and pushes the hero or team-page content downward. The page-entry animation also retains an identity `transform` because it uses animation fill mode `both`; this leaves the sticky header inside a transformed ancestor and can produce unstable compositing while scrolling on mobile browsers. Mobile backdrop blur adds avoidable rendering cost to the same sticky surface.

The current header also became a Client Component solely for the hamburger state. That conflicts with the project's Server Component boundary tests and sends more client JavaScript than the interaction requires.

## Approved Direction

- Keep the public header sticky and preserve its existing 104px layout footprint.
- Render the expanded mobile menu in an absolutely positioned overlay below the navbar card, so opening it cannot change document flow or move page content.
- Move hamburger state and handlers into a focused `MobileNavigation` Client Component, while returning `HeaderSection` to a Server Component.
- Finish the page-entry animation with `transform: none` so the sticky header is no longer inside a transformed containing block after entry motion completes.
- Use an opaque white navbar surface on mobile and retain translucent backdrop blur from the desktop breakpoint upward.
- Preserve the current navigation links, active state, dimensions, styling, accessibility labels, focus states, close-on-navigation behavior, and reduced-motion support.

## Component Boundaries

`HeaderSection` owns the static logo, desktop navigation, account actions, and sticky layout. `MobileNavigation` owns only the hamburger button, expanded overlay, and open/close state. It receives the active page as a serializable prop.

## Testing and Verification

A source-contract regression test will require the mobile menu wrapper to be absolutely positioned, require the page-entry keyframe to end with `transform: none`, and protect the Server/Client Component split. The test must fail before the production change and pass afterward. Final verification includes the complete test suite, ESLint, production build, and mobile viewport checks for unchanged content position and stable scroll behavior.
