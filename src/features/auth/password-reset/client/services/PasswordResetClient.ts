import {
  PasswordResetResponseSchema,
  type ResetPasswordEmailRequest,
  type ResetPasswordRequest,
} from "../../shared/PasswordResetSchema";
import type { PasswordResetResponse } from "../../shared/PasswordResetTypes";

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

const EMAIL_FALLBACK = "Email reset tidak dapat dikirim.";
const VERIFY_FALLBACK = "Tautan reset tidak dapat diverifikasi.";
const RESET_FALLBACK = "Kata sandi tidak dapat diatur ulang.";

async function request(
  url: string,
  init: RequestInit,
  fallbackMessage: string,
  fetcher: Fetcher,
): Promise<PasswordResetResponse> {
  let response: Response;

  try {
    response = await fetcher(url, {
      ...init,
      credentials: "same-origin",
    });
  } catch {
    return { success: false, message: fallbackMessage };
  }

  try {
    const parsed = PasswordResetResponseSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.success !== response.ok) {
      return { success: false, message: fallbackMessage };
    }

    if (!parsed.data.success) {
      return {
        ...parsed.data,
        status: parsed.data.status ?? response.status,
      };
    }

    return parsed.data;
  } catch {
    return { success: false, message: fallbackMessage };
  }
}

export function requestPasswordResetEmail(
  input: ResetPasswordEmailRequest,
  fetcher: Fetcher = fetch,
) {
  return request(
    "/api/v1/auth/email-reset-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    EMAIL_FALLBACK,
    fetcher,
  );
}

export function verifyPasswordResetToken(
  token: string,
  fetcher: Fetcher = fetch,
) {
  return request(
    `/api/v1/auth/verify-reset-password/${encodeURIComponent(token)}`,
    { method: "GET" },
    VERIFY_FALLBACK,
    fetcher,
  );
}

export function submitResetPassword(
  input: ResetPasswordRequest,
  fetcher: Fetcher = fetch,
) {
  return request(
    "/api/v1/auth/reset-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    RESET_FALLBACK,
    fetcher,
  );
}
