import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("themes every Sonner state with the SiHEDAF palette", async () => {
  const toaster = await readFile(
    path.join(source, "components/ui/AppToaster.tsx"),
    "utf8",
  );

  assert.match(toaster, /CheckCircle2/);
  assert.match(toaster, /CircleAlert/);
  assert.match(toaster, /Info/);
  assert.match(toaster, /TriangleAlert/);
  assert.match(toaster, /LoaderCircle/);
  assert.match(toaster, /X/);
  assert.match(toaster, /icons={{/);
  assert.match(toaster, /success: "border-\[#BDE9C5\] bg-\[#F2FBF4\]"/);
  assert.match(toaster, /error: "border-\[#FFC2D1\] bg-\[#FFF5F7\]"/);
  assert.match(toaster, /info: "border-primary-200 bg-primary-50"/);
  assert.match(toaster, /warning: "border-\[#F7D58B\] bg-\[#FFF9EB\]"/);
  assert.match(toaster, /actionButton:/);
  assert.match(toaster, /closeButton:/);
  assert.match(toaster, /rounded-\[18px\]/);
});

test("keeps toast inside desktop and mobile viewports", async () => {
  const toaster = await readFile(
    path.join(source, "components/ui/AppToaster.tsx"),
    "utf8",
  );

  assert.match(toaster, /w-\[min\(380px,calc\(100vw-24px\)\)\]/);
  assert.match(toaster, /offset={{ top: 20 }}/);
  assert.match(toaster, /mobileOffset={{ top: 12, left: 12, right: 12 }}/);
  assert.match(toaster, /closeButtonAriaLabel: "Tutup notifikasi"/);
  assert.match(toaster, /containerAriaLabel="Notifikasi SiHEDAF"/);
});
