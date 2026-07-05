import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { registerAccount } from "../features/auth/register/client/services/RegisterClient";

const input = {
  fullname: "User Satu",
  email: "user@example.com",
  password: "User!123",
};

test("client posts only the registration request", async () => {
  let requestBody = "";
  const result = await registerAccount(input, async (url, init) => {
    assert.equal(url, "/api/v1/auth/register");
    assert.equal(init?.method, "POST");
    requestBody = String(init?.body);
    return Response.json({ success: true, message: "Registered" });
  });

  assert.deepEqual(JSON.parse(requestBody), input);
  assert.deepEqual(result, { success: true, message: "Registered" });
});

test("client normalizes malformed and network failures", async () => {
  const malformed = await registerAccount(input, async () =>
    Response.json({ unexpected: true }),
  );
  assert.deepEqual(malformed, {
    success: false,
    message: "Terjadi kesalahan. Silakan coba lagi.",
  });

  const network = await registerAccount(input, async () => {
    throw new TypeError("offline");
  });
  assert.deepEqual(network, {
    success: false,
    message:
      "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.",
  });
});

test("client preserves a normalized BFF rejection", async () => {
  const result = await registerAccount(input, async () =>
    Response.json(
      { success: false, message: "Email sudah terdaftar." },
      { status: 409 },
    ),
  );

  assert.deepEqual(result, {
    success: false,
    message: "Email sudah terdaftar.",
  });
});

test("registration hook exposes pending state and guards duplicate requests", async () => {
  const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
  const hook = await readFile(
    path.resolve(
      testsDirectory,
      "../features/auth/register/client/hooks/UseRegister.ts",
    ),
    "utf8",
  );

  assert.match(hook, /^"use client";/);
  assert.match(hook, /useRef\(false\)/);
  assert.match(hook, /if \(inFlight\.current\) return null/);
  assert.match(hook, /setIsPending\(true\)/);
  assert.match(hook, /setIsPending\(false\)/);
  assert.match(hook, /registerAccount\(input\)/);
});
