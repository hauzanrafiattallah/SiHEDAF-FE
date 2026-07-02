import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(testsDirectory, "../app");

test("keeps application tests together in src/tests", async () => {
  const [appFiles, testFiles] = await Promise.all([
    readdir(appDirectory),
    readdir(testsDirectory),
  ]);

  assert.deepEqual(
    appFiles.filter((filename) => filename.endsWith(".test.mjs")),
    [],
    "test files must not live inside src/app",
  );

  for (const filename of [
    "AuthPages.test.mjs",
    "DesignSystem.test.mjs",
    "LandingPage.test.mjs",
    "TeamPage.test.mjs",
  ]) {
    assert.ok(testFiles.includes(filename), `missing ${filename} in src/tests`);
  }
});
