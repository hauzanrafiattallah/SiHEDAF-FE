import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const cssUrl = new URL("../app/globals.css", import.meta.url);
const layoutUrl = new URL("../app/layout.tsx", import.meta.url);
const fontUrl = new URL("../app/fonts/switzer-variable.woff2", import.meta.url);

test("exposes the approved primary palette and global typography", async () => {
  const css = await readFile(cssUrl, "utf8");
  const palette = {
    50: "#E8F1FF",
    100: "#D9E9FB",
    200: "#B0D2FE",
    300: "#006EFB",
    400: "#0063E2",
    500: "#0058C9",
    600: "#0053BC",
    700: "#004297",
    800: "#003171",
    900: "#002758",
  };

  for (const [shade, value] of Object.entries(palette)) {
    assert.match(
      css,
      new RegExp(`--color-primary-${shade}: ${value};`, "i"),
      `missing primary-${shade}`,
    );
  }

  assert.match(css, /@theme static\s*\{/);
  assert.match(css, /--foreground: #002758;/i);
  assert.match(css, /--primary: #0058C9;/i);
  assert.match(css, /--font-sans: var\(--font-switzer\)/);
  assert.match(css, /font-family: var\(--font-switzer\)/);
  assert.match(css, /letter-spacing: -0\.02em;/);
  assert.doesNotMatch(css, /prefers-color-scheme: dark/);
});

test("loads the self-hosted Switzer variable font from the root layout", async () => {
  const [layout, fontStats] = await Promise.all([
    readFile(layoutUrl, "utf8"),
    stat(fontUrl),
  ]);

  assert.match(layout, /import localFont from "next\/font\/local";/);
  assert.match(layout, /src: "\.\/fonts\/switzer-variable\.woff2"/);
  assert.match(layout, /variable: "--font-switzer"/);
  assert.match(layout, /weight: "100 900"/);
  assert.match(layout, /display: "swap"/);
  assert.match(layout, /<html lang="id"/);
  assert.match(layout, /switzer\.variable/);
  assert.match(layout, /title: "SiHEDAF"/);
  assert.doesNotMatch(layout, /Sistem Informasi Hemodialisis/);
  assert.ok(fontStats.size > 10_000, "Switzer WOFF2 asset is unexpectedly small");
});
