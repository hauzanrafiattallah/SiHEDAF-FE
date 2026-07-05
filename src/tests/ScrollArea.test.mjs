import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const project = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

test("installs the Radix scroll-area primitive", async () => {
  const packageSource = await readFile(path.join(project, "package.json"), "utf8");

  assert.match(packageSource, /@radix-ui\/react-scroll-area/);
});

test("exposes an automatic horizontal ScrollArea component", async () => {
  const component = await readFile(
    path.join(project, "src/components/ui/ScrollArea.tsx"),
    "utf8",
  ).catch(() => "");

  assert.match(component, /^"use client";/);
  assert.match(component, /ScrollAreaPrimitive\.Root/);
  assert.match(component, /type="auto"/);
  assert.match(component, /ScrollAreaPrimitive\.Viewport/);
  assert.match(component, /orientation="horizontal"/);
  assert.match(component, /ScrollAreaPrimitive\.Thumb/);
  assert.match(component, /bg-primary-200/);
  assert.doesNotMatch(component, /forceMount/);
});
