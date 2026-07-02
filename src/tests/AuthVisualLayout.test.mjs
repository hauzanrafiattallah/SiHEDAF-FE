import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
const panelPath = path.resolve(
  testsDirectory,
  "../components/auth/AuthVisualPanel.tsx",
);

test("keeps auth copy and watch in a non-overlapping vertical flow", async () => {
  const source = await readFile(panelPath, "utf8");

  assert.match(source, /flex h-full flex-col/);
  assert.match(source, /mt-auto/);
  assert.match(source, /max-h-\[/);
  assert.match(source, /object-contain/);
  assert.doesNotMatch(source, /className="absolute bottom-/);

  const descriptionIndex = source.indexOf("{description}");
  const watchIndex = source.indexOf('src="/watch.png"');

  assert.ok(descriptionIndex > -1);
  assert.ok(watchIndex > descriptionIndex, "watch should render after the description");
});
