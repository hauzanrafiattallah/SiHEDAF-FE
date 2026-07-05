import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { config, proxy } from "../proxy";

test("protects every dashboard-style route", () => {
  assert.deepEqual(config.matcher, [
    "/dashboard/:path*",
    "/riwayat/:path*",
    "/profil/:path*",
  ]);
});

test("redirects a private request without session cookies", () => {
  const response = proxy(new NextRequest("http://localhost/dashboard"));

  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost/login");
});

test("allows either access or refresh cookie through for backend validation", () => {
  for (const cookie of [
    "sihedaf_access_token=access-token-test",
    "sihedaf_refresh_token=refresh-token-test",
  ]) {
    const response = proxy(
      new NextRequest("http://localhost/profil", {
        headers: { cookie },
      }),
    );

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-middleware-next"), "1");
  }
});
