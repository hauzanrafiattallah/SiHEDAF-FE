import assert from "node:assert/strict";
import test from "node:test";

import {
  BackendConfigurationError,
  buildBackendApiUrl,
} from "../features/auth/shared/server/BackendUrl";

test("builds backend URLs from a domain base", () => {
  assert.equal(
    buildBackendApiUrl("/auth/login", "https://sihedaf.xianly.cloud"),
    "https://sihedaf.xianly.cloud/api/v1/auth/login",
  );
});

test("does not duplicate a configured api segment", () => {
  assert.equal(
    buildBackendApiUrl("auth/login", "http://127.0.0.1:3001/api/"),
    "http://127.0.0.1:3001/api/v1/auth/login",
  );
});

test("rejects a missing backend URL", () => {
  assert.throws(
    () => buildBackendApiUrl("auth/login", ""),
    BackendConfigurationError,
  );
});
