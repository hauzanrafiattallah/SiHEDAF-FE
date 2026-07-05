import { AuthResponseSchema } from "../../shared/SessionSchema";
import type { AuthResponse } from "../../shared/SessionTypes";

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

const AUTH_UNAVAILABLE =
  "Layanan autentikasi sedang bermasalah. Coba lagi beberapa saat.";
const UNEXPECTED = "Terjadi kesalahan. Silakan coba lagi.";

export async function refreshSession(
  fetcher: Fetcher = fetch,
): Promise<AuthResponse> {
  let response: Response;

  try {
    response = await fetcher("/api/v1/auth/refresh-token", {
      method: "POST",
    });
  } catch {
    return { success: false, message: AUTH_UNAVAILABLE };
  }

  try {
    const parsed = AuthResponseSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.success !== response.ok) {
      return { success: false, message: UNEXPECTED };
    }
    return parsed.data;
  } catch {
    return { success: false, message: UNEXPECTED };
  }
}
