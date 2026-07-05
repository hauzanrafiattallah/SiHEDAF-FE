import type { SessionTokens } from "../shared/SessionTypes";

export const ACCESS_TOKEN_COOKIE = "sihedaf_access_token";
export const REFRESH_TOKEN_COOKIE = "sihedaf_refresh_token";

export type SessionCookie = {
  name: string;
  value: string;
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  priority: "high";
  maxAge: number;
};

export type SessionCookieStore = {
  set(cookie: SessionCookie): void;
};

const ACCESS_TOKEN_MAX_AGE = 86_400;
const REFRESH_TOKEN_MAX_AGE = 31_536_000;

function sessionCookie(
  name: string,
  value: string,
  maxAge: number,
  secure: boolean,
): SessionCookie {
  return {
    name,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    priority: "high",
    maxAge,
  };
}

export function writeSessionCookies(
  store: SessionCookieStore,
  tokens: SessionTokens,
  secure = process.env.NODE_ENV === "production",
) {
  store.set(
    sessionCookie(
      ACCESS_TOKEN_COOKIE,
      tokens.accessToken,
      ACCESS_TOKEN_MAX_AGE,
      secure,
    ),
  );
  store.set(
    sessionCookie(
      REFRESH_TOKEN_COOKIE,
      tokens.refreshToken,
      REFRESH_TOKEN_MAX_AGE,
      secure,
    ),
  );
}

export function writeAccessTokenCookie(
  store: SessionCookieStore,
  accessToken: string,
  secure = process.env.NODE_ENV === "production",
) {
  store.set(
    sessionCookie(
      ACCESS_TOKEN_COOKIE,
      accessToken,
      ACCESS_TOKEN_MAX_AGE,
      secure,
    ),
  );
}

export function clearSessionCookies(
  store: SessionCookieStore,
  secure = process.env.NODE_ENV === "production",
) {
  store.set(sessionCookie(ACCESS_TOKEN_COOKIE, "", 0, secure));
  store.set(sessionCookie(REFRESH_TOKEN_COOKIE, "", 0, secure));
}
