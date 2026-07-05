import { cookies } from "next/headers";

import { clearSessionCookies } from "@/features/auth/session/server/AuthCookies";
import type { AuthResponse } from "@/features/auth/session/shared/SessionTypes";

function json(body: AuthResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST() {
  const cookieStore = await cookies();
  clearSessionCookies(cookieStore);

  return json({ success: true, message: "Berhasil keluar." }, 200);
}
