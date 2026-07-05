import { cookies } from "next/headers";

import { writeSessionCookies } from "@/features/auth/session/server/AuthCookies";
import {
  AUTH_SERVICE_UNAVAILABLE,
  SessionServiceError,
} from "@/features/auth/session/server/SessionServiceError";
import { loginUser } from "@/features/auth/session/server/services/LoginService";
import { LoginRequestSchema } from "@/features/auth/session/shared/SessionSchema";
import type { AuthResponse } from "@/features/auth/session/shared/SessionTypes";

function json(body: AuthResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json(
      { success: false, message: "Format permintaan tidak valid." },
      400,
    );
  }

  const parsed = LoginRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        success: false,
        message: "Periksa kembali data login.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const tokens = await loginUser(parsed.data);
    const cookieStore = await cookies();
    writeSessionCookies(cookieStore, tokens);

    return json({ success: true, message: "Berhasil masuk." }, 200);
  } catch (error) {
    if (error instanceof SessionServiceError) {
      return json({ success: false, message: error.message }, error.status);
    }

    return json({ success: false, message: AUTH_SERVICE_UNAVAILABLE }, 502);
  }
}
