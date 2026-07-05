import assert from "node:assert/strict";
import test from "node:test";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  type SessionCookie,
} from "../features/auth/session/server/AuthCookies";
import {
  SESSION_EXPIRED,
  SessionServiceError,
} from "../features/auth/session/server/SessionServiceError";
import { withSessionRefresh } from "../features/auth/session/server/WithSessionRefresh";

function createCookieStore(values: Record<string, string> = {}) {
  const cookies = new Map(Object.entries(values));
  const writes: SessionCookie[] = [];

  return {
    cookies,
    writes,
    store: {
      get(name: string) {
        const value = cookies.get(name);
        return value === undefined ? undefined : { value };
      },
      set(cookie: SessionCookie) {
        writes.push(cookie);
        cookies.set(cookie.name, cookie.value);
      },
    },
  };
}

test("uses a valid access token without refreshing", async () => {
  const { store } = createCookieStore({
    [ACCESS_TOKEN_COOKIE]: "access-token-test",
    [REFRESH_TOKEN_COOKIE]: "refresh-token-test",
  });
  let refreshCount = 0;

  const result = await withSessionRefresh(
    async (accessToken) => {
      assert.equal(accessToken, "access-token-test");
      return "profile";
    },
    {
      cookieStore: store,
      refresher: async () => {
        refreshCount += 1;
        return { accessToken: "new-access-token-test" };
      },
    },
  );

  assert.equal(result, "profile");
  assert.equal(refreshCount, 0);
});

test("refreshes once and retries an unauthorized request", async () => {
  const { store, writes } = createCookieStore({
    [ACCESS_TOKEN_COOKIE]: "expired-access-token",
    [REFRESH_TOKEN_COOKIE]: "refresh-token-test",
  });
  const usedTokens: string[] = [];

  const result = await withSessionRefresh(
    async (accessToken) => {
      usedTokens.push(accessToken);
      if (accessToken === "expired-access-token") {
        throw new SessionServiceError(SESSION_EXPIRED, 401);
      }
      return "profile";
    },
    {
      cookieStore: store,
      refresher: async (refreshToken) => {
        assert.equal(refreshToken, "refresh-token-test");
        return { accessToken: "new-access-token-test" };
      },
    },
  );

  assert.equal(result, "profile");
  assert.deepEqual(usedTokens, [
    "expired-access-token",
    "new-access-token-test",
  ]);
  assert.equal(writes.length, 1);
  assert.equal(writes[0]?.name, ACCESS_TOKEN_COOKIE);
});

test("refreshes before a request when only refresh token exists", async () => {
  const { store } = createCookieStore({
    [REFRESH_TOKEN_COOKIE]: "refresh-token-test",
  });

  const result = await withSessionRefresh(
    async (accessToken) => accessToken,
    {
      cookieStore: store,
      refresher: async () => ({ accessToken: "new-access-token-test" }),
    },
  );

  assert.equal(result, "new-access-token-test");
});

test("does not refresh non-authentication failures", async () => {
  const { store } = createCookieStore({
    [ACCESS_TOKEN_COOKIE]: "access-token-test",
    [REFRESH_TOKEN_COOKIE]: "refresh-token-test",
  });
  let refreshCount = 0;

  await assert.rejects(
    withSessionRefresh(
      async () => {
        throw new SessionServiceError("Layanan gagal.", 502);
      },
      {
        cookieStore: store,
        refresher: async () => {
          refreshCount += 1;
          return { accessToken: "new-access-token-test" };
        },
      },
    ),
    (error) => error instanceof SessionServiceError && error.status === 502,
  );

  assert.equal(refreshCount, 0);
});

test("clears the session when refresh is unavailable or rejected", async () => {
  const missingRefresh = createCookieStore({
    [ACCESS_TOKEN_COOKIE]: "expired-access-token",
  });

  await assert.rejects(
    withSessionRefresh(
      async () => {
        throw new SessionServiceError(SESSION_EXPIRED, 401);
      },
      { cookieStore: missingRefresh.store },
    ),
    (error) => error instanceof SessionServiceError && error.status === 401,
  );
  assert.deepEqual(
    missingRefresh.writes.map(({ name, maxAge }) => ({ name, maxAge })),
    [
      { name: ACCESS_TOKEN_COOKIE, maxAge: 0 },
      { name: REFRESH_TOKEN_COOKIE, maxAge: 0 },
    ],
  );

  const rejectedRefresh = createCookieStore({
    [ACCESS_TOKEN_COOKIE]: "expired-access-token",
    [REFRESH_TOKEN_COOKIE]: "invalid-refresh-token",
  });
  await assert.rejects(
    withSessionRefresh(
      async () => {
        throw new SessionServiceError(SESSION_EXPIRED, 401);
      },
      {
        cookieStore: rejectedRefresh.store,
        refresher: async () => {
          throw new SessionServiceError(SESSION_EXPIRED, 401);
        },
      },
    ),
    (error) => error instanceof SessionServiceError && error.status === 401,
  );
  assert.equal(rejectedRefresh.writes.length, 2);
});
