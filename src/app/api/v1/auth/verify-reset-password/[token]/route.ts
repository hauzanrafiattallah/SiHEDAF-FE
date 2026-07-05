import {
  INVALID_RESET_TOKEN,
  PASSWORD_RESET_UNAVAILABLE,
  PasswordResetServiceError,
} from "@/features/auth/password-reset/server/PasswordResetServiceError";
import { verifyResetPasswordToken } from "@/features/auth/password-reset/server/services/PasswordResetService";
import { ResetPasswordTokenSchema } from "@/features/auth/password-reset/shared/PasswordResetSchema";
import type { PasswordResetResponse } from "@/features/auth/password-reset/shared/PasswordResetTypes";

function json(body: PasswordResetResponse, status: number) {
  return Response.json(body, { status });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const parsed = ResetPasswordTokenSchema.safeParse(token);

  if (!parsed.success) {
    return json(
      {
        success: false,
        message: INVALID_RESET_TOKEN,
        fieldErrors: {
          token: parsed.error.issues.map((issue) => issue.message),
        },
      },
      422,
    );
  }

  try {
    const result = await verifyResetPasswordToken(parsed.data);
    return json({ success: true, message: result.message }, 200);
  } catch (error) {
    if (error instanceof PasswordResetServiceError) {
      return json({ success: false, message: error.message }, error.status);
    }

    return json({ success: false, message: PASSWORD_RESET_UNAVAILABLE }, 502);
  }
}
