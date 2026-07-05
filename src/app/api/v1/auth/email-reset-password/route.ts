import {
  PASSWORD_RESET_UNAVAILABLE,
  PasswordResetServiceError,
} from "@/features/auth/password-reset/server/PasswordResetServiceError";
import { sendResetPasswordEmail } from "@/features/auth/password-reset/server/services/PasswordResetService";
import { ResetPasswordEmailSchema } from "@/features/auth/password-reset/shared/PasswordResetSchema";
import type { PasswordResetResponse } from "@/features/auth/password-reset/shared/PasswordResetTypes";

function json(body: PasswordResetResponse, status: number) {
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

  const parsed = ResetPasswordEmailSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        success: false,
        message: "Periksa kembali alamat email.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const result = await sendResetPasswordEmail(parsed.data);
    return json({ success: true, message: result.message }, 200);
  } catch (error) {
    if (error instanceof PasswordResetServiceError) {
      return json({ success: false, message: error.message }, error.status);
    }

    return json({ success: false, message: PASSWORD_RESET_UNAVAILABLE }, 502);
  }
}
