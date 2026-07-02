# SiHEDAF Design Foundation

## Scope

Set up only the shared typography and color foundation. No application feature or page redesign is included.

## Typography

- Use the official Switzer variable font in normal style, weights 100 through 900.
- Self-host the WOFF2 asset and load it once from the root layout with `next/font/local`.
- Expose the font through `--font-switzer` and Tailwind's `font-sans` utility.
- Apply Switzer and `letter-spacing: -0.02em` globally. The relative `em` value preserves the specified -2% tracking at every font size.
- Keep system sans-serif fonts as the fallback stack.

## Color system

Expose the supplied palette as Tailwind theme tokens:

| Token | Value |
| --- | --- |
| `primary-50` | `#E8F1FF` |
| `primary-100` | `#D9E9FB` |
| `primary-200` | `#B0D2FE` |
| `primary-300` | `#006EFB` |
| `primary-400` | `#0063E2` |
| `primary-500` | `#0058C9` |
| `primary-600` | `#0053BC` |
| `primary-700` | `#004297` |
| `primary-800` | `#003171` |
| `primary-900` | `#002758` |

The default foreground is `primary-900`, the primary action color is `primary-500`, and the page background and primary foreground are white. The reference contains no dark palette, so the generated starter dark-mode overrides are removed.

## Integration

- `src/app/layout.tsx` owns font loading, Indonesian document language, and SiHEDAF metadata.
- `src/app/globals.css` owns the palette, semantic colors, Tailwind mappings, and global typography.
- The existing home page and user-provided image assets remain untouched.

## Verification

A small Node test reads the design foundation sources and checks every supplied color, the Switzer configuration, and global tracking. ESLint and a production build provide framework-level verification, followed by inspection of the emitted production CSS bundle.
