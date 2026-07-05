# Responsive History Scroll and Toast Theme Design

**Date:** 2026-07-05

## Objective

Remove the misleading horizontal scrollbar from the history table when its
content already fits, preserve native horizontal swipe when the table truly
overflows, make the mobile history footer usable, and restyle Sonner toast to
match the SiHEDAF design system.

## Scroll Architecture

Add a reusable `ScrollArea` primitive under `src/components/ui` backed by
`@radix-ui/react-scroll-area`. Radix keeps native browser scrolling and exposes
an accessible custom scrollbar. The wrapper uses `type="auto"` and renders only
the horizontal scrollbar, so desktop surfaces without overflow do not show a
track while smaller viewports can swipe and see the scroll affordance.

The history table will use `min-width: 680px` instead of the current fixed
900px minimum. At medium and larger widths it expands to the available card
width without overflow. On narrow screens, the three columns retain readable
dimensions and the Radix viewport becomes horizontally scrollable.

## Responsive History Layout

- Summary cards remain stacked on mobile and become three columns from `sm`.
- The table title uses tighter mobile padding.
- Pagination does not horizontally overflow: mobile shows Previous, `page / total`,
  and Next; numbered page buttons remain visible from `sm` upward.
- The page-size selector occupies its own responsive row on narrow screens.
- All controls preserve labels, focus states, disabled states, and touch-sized
  targets.

## Toast Theme

Continue using the installed Sonner library and central `AppToaster`. Add
Lucide icons and SiHEDAF-specific class names:

- default/info: primary blue border and pale-blue surface;
- success: green semantic border, icon, and pale-green surface;
- error: AF pink border, icon, and pale-pink surface;
- warning: warm amber accent;
- rounded 18px surface, Switzer typography, compact shadow, branded close and
  action buttons;
- responsive offset and width that remain inside a 320px viewport.

## Testing

Source-contract tests will require the Radix dependency, auto-mode horizontal
scrollbar, reduced table minimum width, responsive pagination, and semantic
Sonner theme classes/icons. Browser verification will inspect `/riwayat` at
desktop and mobile viewport sizes, confirm the desktop scrollbar is absent,
confirm mobile overflow can scroll horizontally, and confirm no page-level
horizontal overflow remains.

## Accepted Decisions

- The user's detailed behavior request is treated as design approval under the
  existing direct-execution preference.
- Radix Scroll Area is selected over a custom observer implementation because
  it preserves native scrolling, keyboard behavior, and automatic visibility.
- Sonner remains the toast engine; only its centralized visual system changes.
