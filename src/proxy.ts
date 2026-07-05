import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/features/auth/session/shared/SessionCookies";

export function proxy(request: NextRequest) {
  const hasAccessToken = Boolean(
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value,
  );
  const hasRefreshToken = Boolean(
    request.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
  );

  if (hasAccessToken || hasRefreshToken) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/riwayat/:path*", "/profil/:path*"],
};
