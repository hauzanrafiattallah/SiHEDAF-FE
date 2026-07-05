import {
  PROFILE_SERVICE_UNAVAILABLE,
  getCurrentProfile,
} from "@/features/profile/server/services/ProfileService";
import { withSessionRefresh } from "@/features/auth/session/server/WithSessionRefresh";
import { SessionServiceError } from "@/features/auth/session/server/SessionServiceError";
import type { ProfileResponse } from "@/features/profile/shared/ProfileTypes";

function json(body: ProfileResponse, status: number) {
  return Response.json(body, { status });
}

export async function GET() {
  try {
    const user = await withSessionRefresh((accessToken) =>
      getCurrentProfile(accessToken),
    );
    return json({ success: true, user }, 200);
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
