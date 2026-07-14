import { z } from "zod";

import {
  BackendConfigurationError,
  buildBackendApiUrl,
} from "@/features/auth/shared/server/BackendUrl";

import type { BindDeviceRequest } from "../../shared/DeviceSchema";
import {
  DEVICE_ALREADY_BOUND,
  DEVICE_NOT_FOUND,
  DEVICE_SERVICE_UNAVAILABLE,
  DeviceServiceError,
} from "../DeviceServiceError";

const BackendBindResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  data: z.object({
    message: z.string().min(1),
  }),
});

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

type DeviceServiceOptions = {
  baseUrl?: string;
  fetcher?: Fetcher;
  signal?: AbortSignal;
};

export async function bindDevice(
  accessToken: string,
  input: BindDeviceRequest,
  options: DeviceServiceOptions = {},
): Promise<{ message: string }> {
  let url: string;
  try {
    url = buildBackendApiUrl("measurement/bind", options.baseUrl);
  } catch (error) {
    if (error instanceof BackendConfigurationError) {
      throw new DeviceServiceError(DEVICE_SERVICE_UNAVAILABLE, 500);
    }
    throw error;
  }

  let response: Response;
  try {
    response = await (options.fetcher ?? fetch)(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: options.signal ?? AbortSignal.timeout(10_000),
    });
  } catch {
    throw new DeviceServiceError(DEVICE_SERVICE_UNAVAILABLE, 502);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    // If we can't parse JSON, it will be handled by the fallback below
  }

  if (!response.ok) {
    let errorMessage = DEVICE_SERVICE_UNAVAILABLE;

    if (body && typeof body === "object" && body !== null) {
      const errObj = (body as any).errors;
      if (errObj && typeof errObj.message === "string") {
        errorMessage = errObj.message;
      }
    }

    if (response.status === 404 || response.status === 400) {
      throw new DeviceServiceError(errorMessage !== DEVICE_SERVICE_UNAVAILABLE ? errorMessage : DEVICE_NOT_FOUND, 400);
    }
    if (response.status === 409) {
      throw new DeviceServiceError(errorMessage !== DEVICE_SERVICE_UNAVAILABLE ? errorMessage : DEVICE_ALREADY_BOUND, 409);
    }
    throw new DeviceServiceError(DEVICE_SERVICE_UNAVAILABLE, 502);
  }

  const parsed = BackendBindResponseSchema.safeParse(body);
  if (!parsed.success || parsed.data.code !== 200) {
    throw new DeviceServiceError(DEVICE_SERVICE_UNAVAILABLE, 502);
  }

  return { message: parsed.data.data.message };
}

const BackendMyDeviceResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  data: z.object({
    id: z.string(),
    deviceNumber: z.string(),
  }).passthrough().nullable(),
});

export async function checkDeviceBound(
  accessToken: string,
  options: DeviceServiceOptions = {},
): Promise<boolean> {
  let url: string;
  try {
    url = buildBackendApiUrl("measurement/my-device", options.baseUrl);
  } catch {
    return false;
  }

  try {
    const response = await (options.fetcher ?? fetch)(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: options.signal ?? AbortSignal.timeout(10_000),
    });

    if (!response.ok) return false;

    const body = await response.json();
    const parsed = BackendMyDeviceResponseSchema.safeParse(body);
    
    if (!parsed.success || parsed.data.code !== 200) return false;

    return parsed.data.data !== null;
  } catch {
    return false;
  }
}
