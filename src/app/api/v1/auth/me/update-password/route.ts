import { SessionServiceError } from "@/features/auth/session/server/SessionServiceError";
import { withSessionRefresh } from "@/features/auth/session/server/WithSessionRefresh";
import {
  PROFILE_SERVICE_UNAVAILABLE,
  updateCurrentPassword,
} from "@/features/profile/server/services/ProfileService";
import { UpdatePasswordRequestSchema } from "@/features/profile/shared/ProfileSchema";
import type { ProfileMutationResponse } from "@/features/profile/shared/ProfileTypes";

function json(body: ProfileMutationResponse, status: number) {
  return Response.json(body, { status });
}

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(
      { success: false, message: "Format permintaan tidak valid." },
      400,
    );
  }

  const parsed = UpdatePasswordRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        success: false,
        message: "Periksa kembali data kata sandi.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const result = await withSessionRefresh((accessToken) =>
      updateCurrentPassword(accessToken, parsed.data),
    );
    return json({ success: true, message: result.message }, 200);
  } catch (error) {
    if (error instanceof SessionServiceError) {
      return json({ success: false, message: error.message }, error.status);
    }

    return json(
      { success: false, message: PROFILE_SERVICE_UNAVAILABLE },
      502,
    );
  }
}
