import { z } from "zod";

import {
  BackendConfigurationError,
  buildBackendApiUrl,
} from "@/features/auth/shared/server/BackendUrl";

import type { LoginRequest } from "../../shared/SessionSchema";
import type { SessionTokens } from "../../shared/SessionTypes";
import {
  AUTH_SERVICE_UNAVAILABLE,
  INVALID_CREDENTIALS,
  SessionServiceError,
} from "../SessionServiceError";

const BackendLoginResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  recordsTotal: z.number(),
  data: z.object({
    access_token: z.string().min(1),
    refresh_token: z.string().min(1),
  }),
  errors: z.unknown().nullable(),
});

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type LoginServiceOptions = {
  baseUrl?: string;
  fetcher?: Fetcher;
  signal?: AbortSignal;
};

export async function loginUser(
  input: LoginRequest,
  options: LoginServiceOptions = {},
): Promise<SessionTokens> {
  let url: string;
  try {
    url = buildBackendApiUrl("auth/login", options.baseUrl);
  } catch (error) {
    if (error instanceof BackendConfigurationError) {
      throw new SessionServiceError(AUTH_SERVICE_UNAVAILABLE, 500);
    }
    throw error;
  }

  let response: Response;
  try {
    response = await (options.fetcher ?? fetch)(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: options.signal ?? AbortSignal.timeout(10_000),
    });
  } catch {
    throw new SessionServiceError(AUTH_SERVICE_UNAVAILABLE, 502);
  }

  if (!response.ok) {
    if ([400, 401, 403].includes(response.status)) {
      throw new SessionServiceError(INVALID_CREDENTIALS, 401);
    }
    throw new SessionServiceError(AUTH_SERVICE_UNAVAILABLE, 502);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new SessionServiceError(AUTH_SERVICE_UNAVAILABLE, 502);
  }

  const parsed = BackendLoginResponseSchema.safeParse(body);
  if (!parsed.success || parsed.data.code !== 200) {
    throw new SessionServiceError(AUTH_SERVICE_UNAVAILABLE, 502);
  }

  return {
    accessToken: parsed.data.data.access_token,
    refreshToken: parsed.data.data.refresh_token,
  };
}
