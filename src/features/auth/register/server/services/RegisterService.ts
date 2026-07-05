import { z } from "zod";

import type { RegisterRequest } from "../../shared/RegisterSchema";

const BACKEND_UNAVAILABLE =
  "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.";
const REGISTRATION_REJECTED = "Akun tidak dapat didaftarkan.";

const BackendSuccessSchema = z.object({
  code: z.number(),
  status: z.string(),
  recordsTotal: z.number(),
  data: z.object({ message: z.string().min(1) }),
  errors: z.unknown().nullable(),
});

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type RegisterServiceOptions = {
  baseUrl?: string;
  fetcher?: Fetcher;
  signal?: AbortSignal;
};

export class RegisterServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "RegisterServiceError";
  }
}

function safeMessage(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const message = value.trim();
  return message.length > 0 && message.length <= 200 ? message : null;
}

function findBackendMessage(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;

  const body = value as Record<string, unknown>;
  const direct = safeMessage(body.message);
  if (direct) return direct;

  for (const key of ["data", "errors"]) {
    const nested = body[key];
    if (typeof nested === "string") return safeMessage(nested);

    if (nested && typeof nested === "object") {
      const message = safeMessage((nested as Record<string, unknown>).message);
      if (message) return message;
    }
  }

  return null;
}

export async function registerUser(
  input: RegisterRequest,
  options: RegisterServiceOptions = {},
): Promise<{ message: string }> {
  const baseUrl = options.baseUrl ?? process.env.SIHEDAF_API_BASE_URL;
  if (!baseUrl) {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 500);
  }

  const fetcher = options.fetcher ?? fetch;
  let response: Response;

  try {
    response = await fetcher(
      baseUrl.replace(/\/+$/, "") + "/api/v1/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        cache: "no-store",
        signal: options.signal ?? AbortSignal.timeout(10_000),
      },
    );
  } catch {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 502);
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 502);
  }

  if (!response.ok) {
    const status =
      response.status >= 400 && response.status < 500 ? response.status : 502;
    throw new RegisterServiceError(
      findBackendMessage(body) ?? REGISTRATION_REJECTED,
      status,
    );
  }

  const parsed = BackendSuccessSchema.safeParse(body);
  if (!parsed.success || parsed.data.code !== 200) {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 502);
  }

  return { message: parsed.data.data.message };
}
