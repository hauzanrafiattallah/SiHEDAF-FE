import { z } from "zod";

import {
  BackendConfigurationError,
  buildBackendApiUrl,
} from "@/features/auth/shared/server/BackendUrl";

import type { RegisterRequest } from "../../shared/RegisterSchema";

const BACKEND_UNAVAILABLE =
  "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.";
const DUPLICATE_ACCOUNT = "Email sudah terdaftar.";
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

export async function registerUser(
  input: RegisterRequest,
  options: RegisterServiceOptions = {},
): Promise<{ message: string }> {
  const fetcher = options.fetcher ?? fetch;
  let response: Response;
  let url: string;

  try {
    url = buildBackendApiUrl("auth/register", options.baseUrl);
  } catch (error) {
    if (error instanceof BackendConfigurationError) {
      throw new RegisterServiceError(BACKEND_UNAVAILABLE, 500);
    }
    throw error;
  }

  try {
    response = await fetcher(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: options.signal ?? AbortSignal.timeout(10_000),
    });
  } catch {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 502);
  }

  if (!response.ok) {
    const status =
      response.status >= 400 && response.status < 500 ? response.status : 502;
    throw new RegisterServiceError(
      response.status === 409 ? DUPLICATE_ACCOUNT : REGISTRATION_REJECTED,
      status,
    );
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 502);
  }

  const parsed = BackendSuccessSchema.safeParse(body);
  if (!parsed.success || parsed.data.code !== 200) {
    throw new RegisterServiceError(BACKEND_UNAVAILABLE, 502);
  }

  return { message: parsed.data.data.message };
}
