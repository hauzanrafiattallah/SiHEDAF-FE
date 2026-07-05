import assert from "node:assert/strict";
import test from "node:test";

import {
  ACCESS_TOKEN_COOKIE,
  clearSessionCookies,
  REFRESH_TOKEN_COOKIE,
  writeAccessTokenCookie,
  writeSessionCookies,
  type SessionCookie,
} from "../features/auth/session/server/AuthCookies";
import { SessionServiceError } from "../features/auth/session/server/SessionServiceError";
import { loginUser } from "../features/auth/session/server/services/LoginService";
import { refreshAccessToken } from "../features/auth/session/server/services/RefreshTokenService";

const credentials = {
  email: "user@example.com",
  password: "User!123",
};

test("login service sends credentials and validates session tokens", async () => {
  let requestBody = "";
  const result = await loginUser(credentials, {
    baseUrl: "https://sihedaf.xianly.cloud/api",
    fetcher: async (url, init) => {
      assert.equal(
        String(url),
        "https://sihedaf.xianly.cloud/api/v1/auth/login",
      );
      assert.equal(init?.method, "POST");
      assert.equal(init?.cache, "no-store");
      requestBody = String(init?.body);
      return Response.json({
        code: 200,
        status: "OK",
        recordsTotal: 1,
        data: {
          access_token: "access-token-test",
          refresh_token: "refresh-token-test",
        },
        errors: null,
      });
    },
  });

  assert.deepEqual(JSON.parse(requestBody), credentials);
  assert.deepEqual(result, {
    accessToken: "access-token-test",
    refreshToken: "refresh-token-test",
  });
});

test("login service normalizes invalid credentials", async () => {
  await assert.rejects(
    loginUser(credentials, {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () => Response.json({}, { status: 401 }),
    }),
    (error) =>
      error instanceof SessionServiceError &&
      error.status === 401 &&
      error.message === "Email atau kata sandi salah.",
  );
});

test("login service normalizes malformed and network failures", async () => {
  await assert.rejects(
    loginUser(credentials, {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () => Response.json({ code: 200 }),
    }),
    (error) =>
      error instanceof SessionServiceError && error.status === 502,
  );

  await assert.rejects(
    loginUser(credentials, {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () => {
        throw new TypeError("offline");
      },
    }),
    (error) =>
      error instanceof SessionServiceError && error.status === 502,
  );
});

test("refresh service sends only the refresh token", async () => {
  let requestBody = "";
  const result = await refreshAccessToken("refresh-token-test", {
    baseUrl: "https://sihedaf.xianly.cloud",
    fetcher: async (url, init) => {
      assert.equal(
        String(url),
        "https://sihedaf.xianly.cloud/api/v1/auth/refresh-token",
      );
      requestBody = String(init?.body);
      return Response.json({
        code: 200,
        status: "OK",
        recordsTotal: 1,
        data: { access_token: "new-access-token-test" },
        errors: null,
      });
    },
  });

  assert.deepEqual(JSON.parse(requestBody), {
    refresh_token: "refresh-token-test",
  });
  assert.deepEqual(result, { accessToken: "new-access-token-test" });
});

test("refresh service normalizes rejected sessions", async () => {
  await assert.rejects(
    refreshAccessToken("refresh-token-test", {
      baseUrl: "https://sihedaf.xianly.cloud",
      fetcher: async () => Response.json({}, { status: 401 }),
    }),
    (error) =>
      error instanceof SessionServiceError &&
      error.status === 401 &&
      error.message === "Sesi Anda telah berakhir. Silakan masuk kembali.",
  );
});

function createCookieStore() {
  const calls: SessionCookie[] = [];
  return {
    calls,
    store: {
      set(cookie: SessionCookie) {
        calls.push(cookie);
      },
    },
  };
}

test("writes secure session cookies with bounded lifetimes", () => {
  const { calls, store } = createCookieStore();
  writeSessionCookies(
    store,
    {
      accessToken: "access-token-test",
      refreshToken: "refresh-token-test",
    },
    true,
  );

  assert.deepEqual(calls, [
    {
      name: ACCESS_TOKEN_COOKIE,
      value: "access-token-test",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      priority: "high",
      maxAge: 86_400,
    },
    {
      name: REFRESH_TOKEN_COOKIE,
      value: "refresh-token-test",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      priority: "high",
      maxAge: 31_536_000,
    },
  ]);
});

test("refreshes access cookies without rotating refresh cookies", () => {
  const { calls, store } = createCookieStore();
  writeAccessTokenCookie(store, "new-access-token-test", false);

  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.name, ACCESS_TOKEN_COOKIE);
  assert.equal(calls[0]?.secure, false);
});

test("clears both session cookies", () => {
  const { calls, store } = createCookieStore();
  clearSessionCookies(store, true);

  assert.deepEqual(
    calls.map(({ name, value, maxAge }) => ({ name, value, maxAge })),
    [
      { name: ACCESS_TOKEN_COOKIE, value: "", maxAge: 0 },
      { name: REFRESH_TOKEN_COOKIE, value: "", maxAge: 0 },
    ],
  );
});
