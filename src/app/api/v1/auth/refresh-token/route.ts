import { cookies } from "next/headers";

import {
  clearSessionCookies,
  REFRESH_TOKEN_COOKIE,
  writeAccessTokenCookie,
} from "@/features/auth/session/server/AuthCookies";
import {
  AUTH_SERVICE_UNAVAILABLE,
  SESSION_EXPIRED,
  SessionServiceError,
} from "@/features/auth/session/server/SessionServiceError";
import { refreshAccessToken } from "@/features/auth/session/server/services/RefreshTokenService";
import type { AuthResponse } from "@/features/auth/session/shared/SessionTypes";

function json(body: AuthResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return json({ success: false, message: SESSION_EXPIRED }, 401);
  }

  try {
    const result = await refreshAccessToken(refreshToken);
    writeAccessTokenCookie(cookieStore, result.accessToken);

    return json(
      { success: true, message: "Sesi berhasil diperbarui." },
      200,
    );
  } catch (error) {
    if (error instanceof SessionServiceError) {
      if (error.status === 401) {
        clearSessionCookies(cookieStore);
      }
      return json({ success: false, message: error.message }, error.status);
    }

    return json({ success: false, message: AUTH_SERVICE_UNAVAILABLE }, 502);
  }
}
