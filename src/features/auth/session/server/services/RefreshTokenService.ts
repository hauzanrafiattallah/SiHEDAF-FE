import { z } from "zod";

import {
  BackendConfigurationError,
  buildBackendApiUrl,
} from "@/features/auth/shared/server/BackendUrl";

import type { AccessTokenResult } from "../../shared/SessionTypes";
import {
  AUTH_SERVICE_UNAVAILABLE,
  SESSION_EXPIRED,
  SessionServiceError,
} from "../SessionServiceError";

const BackendRefreshResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  recordsTotal: z.number(),
  data: z.object({ access_token: z.string().min(1) }),
  errors: z.unknown().nullable(),
});

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type RefreshServiceOptions = {
  baseUrl?: string;
  fetcher?: Fetcher;
  signal?: AbortSignal;
};

export async function refreshAccessToken(
  refreshToken: string,
  options: RefreshServiceOptions = {},
): Promise<AccessTokenResult> {
  let url: string;
  try {
    url = buildBackendApiUrl("auth/refresh-token", options.baseUrl);
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
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
      signal: options.signal ?? AbortSignal.timeout(10_000),
    });
  } catch {
    throw new SessionServiceError(AUTH_SERVICE_UNAVAILABLE, 502);
  }

  if (!response.ok) {
    if ([400, 401, 403].includes(response.status)) {
      throw new SessionServiceError(SESSION_EXPIRED, 401);
    }
    throw new SessionServiceError(AUTH_SERVICE_UNAVAILABLE, 502);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new SessionServiceError(AUTH_SERVICE_UNAVAILABLE, 502);
  }

  const parsed = BackendRefreshResponseSchema.safeParse(body);
  if (!parsed.success || parsed.data.code !== 200) {
    throw new SessionServiceError(AUTH_SERVICE_UNAVAILABLE, 502);
  }

  return { accessToken: parsed.data.data.access_token };
}
