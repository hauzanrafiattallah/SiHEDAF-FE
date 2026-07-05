import { z } from "zod";

import {
  BackendConfigurationError,
  buildBackendApiUrl,
} from "@/features/auth/shared/server/BackendUrl";

import type {
  ResetPasswordEmailRequest,
  ResetPasswordRequest,
} from "../../shared/PasswordResetSchema";
import {
  INVALID_RESET_TOKEN,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_UNAVAILABLE,
  PasswordResetServiceError,
  RESET_EMAIL_RATE_LIMITED,
  RESET_EMAIL_SENT,
} from "../PasswordResetServiceError";

const BackendEnvelopeSchema = z.object({
  code: z.number(),
  status: z.string(),
  recordsTotal: z.number(),
  errors: z.unknown().nullable(),
});

const BackendMessageResponseSchema = BackendEnvelopeSchema.extend({
  data: z.object({ message: z.string().min(1) }),
});

const BackendVerifyResponseSchema = BackendEnvelopeSchema.extend({
  data: z.unknown().nullable(),
});

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type PasswordResetServiceOptions = {
  baseUrl?: string;
  fetcher?: Fetcher;
  signal?: AbortSignal;
};

const invalidTokenStatuses = new Set([400, 401, 403, 404]);

function createUrl(path: string, baseUrl?: string) {
  try {
    return buildBackendApiUrl(path, baseUrl);
  } catch (error) {
    if (error instanceof BackendConfigurationError) {
      throw new PasswordResetServiceError(PASSWORD_RESET_UNAVAILABLE, 500);
    }
    throw error;
  }
}

async function performRequest(
  url: string,
  init: RequestInit,
  options: PasswordResetServiceOptions,
) {
  try {
    return await (options.fetcher ?? fetch)(url, {
      ...init,
      cache: "no-store",
      signal: options.signal ?? AbortSignal.timeout(10_000),
    });
  } catch {
    throw new PasswordResetServiceError(PASSWORD_RESET_UNAVAILABLE, 502);
  }
}

async function readBody(response: Response) {
  try {
    return await response.json();
  } catch {
    throw new PasswordResetServiceError(PASSWORD_RESET_UNAVAILABLE, 502);
  }
}

export async function sendResetPasswordEmail(
  input: ResetPasswordEmailRequest,
  options: PasswordResetServiceOptions = {},
): Promise<{ message: string }> {
  const url = createUrl("auth/email-reset-password", options.baseUrl);
  const response = await performRequest(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    options,
  );

  if ([400, 404].includes(response.status)) {
    return { message: RESET_EMAIL_SENT };
  }
  if (response.status === 429) {
    throw new PasswordResetServiceError(RESET_EMAIL_RATE_LIMITED, 429);
  }
  if (!response.ok) {
    throw new PasswordResetServiceError(PASSWORD_RESET_UNAVAILABLE, 502);
  }

  const parsed = BackendMessageResponseSchema.safeParse(
    await readBody(response),
  );
  if (!parsed.success || parsed.data.code !== 200) {
    throw new PasswordResetServiceError(PASSWORD_RESET_UNAVAILABLE, 502);
  }

  return { message: RESET_EMAIL_SENT };
}

export async function verifyResetPasswordToken(
  token: string,
  options: PasswordResetServiceOptions = {},
): Promise<{ message: string }> {
  const url = createUrl(
    `auth/verify-reset-password/${encodeURIComponent(token)}`,
    options.baseUrl,
  );
  const response = await performRequest(
    url,
    { method: "GET" },
    options,
  );

  if (invalidTokenStatuses.has(response.status)) {
    throw new PasswordResetServiceError(INVALID_RESET_TOKEN, 400);
  }
  if (!response.ok) {
    throw new PasswordResetServiceError(PASSWORD_RESET_UNAVAILABLE, 502);
  }

  const parsed = BackendVerifyResponseSchema.safeParse(await readBody(response));
  if (!parsed.success || parsed.data.code !== 200) {
    throw new PasswordResetServiceError(PASSWORD_RESET_UNAVAILABLE, 502);
  }

  return { message: "Tautan reset kata sandi valid." };
}

export async function resetPassword(
  input: ResetPasswordRequest,
  options: PasswordResetServiceOptions = {},
): Promise<{ message: string }> {
  const url = createUrl("auth/reset-password", options.baseUrl);
  const response = await performRequest(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
    options,
  );

  if (invalidTokenStatuses.has(response.status)) {
    throw new PasswordResetServiceError(INVALID_RESET_TOKEN, 400);
  }
  if (!response.ok) {
    throw new PasswordResetServiceError(PASSWORD_RESET_UNAVAILABLE, 502);
  }

  const parsed = BackendMessageResponseSchema.safeParse(
    await readBody(response),
  );
  if (!parsed.success || parsed.data.code !== 200) {
    throw new PasswordResetServiceError(PASSWORD_RESET_UNAVAILABLE, 502);
  }

  return { message: PASSWORD_RESET_SUCCESS };
}
