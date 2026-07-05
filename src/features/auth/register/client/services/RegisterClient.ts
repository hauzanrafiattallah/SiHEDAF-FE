import {
  type RegisterRequest,
  RegisterResponseSchema,
} from "../../shared/RegisterSchema";
import type { RegisterResponse } from "../../shared/RegisterTypes";

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

const UNAVAILABLE =
  "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.";
const UNEXPECTED = "Terjadi kesalahan. Silakan coba lagi.";

export async function registerAccount(
  input: RegisterRequest,
  fetcher: Fetcher = fetch,
): Promise<RegisterResponse> {
  let response: Response;

  try {
    response = await fetcher("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return { success: false, message: UNAVAILABLE };
  }

  try {
    const parsed = RegisterResponseSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.success !== response.ok) {
      return { success: false, message: UNEXPECTED };
    }

    return parsed.data;
  } catch {
    return { success: false, message: UNEXPECTED };
  }
}
