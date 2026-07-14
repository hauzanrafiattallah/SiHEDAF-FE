import {
  BindDeviceResponseSchema,
  type BindDeviceRequest,
} from "../../shared/DeviceSchema";
import type { BindDeviceResponse } from "../../shared/DeviceTypes";

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

const DEVICE_UNAVAILABLE =
  "Layanan perangkat sedang bermasalah. Coba lagi beberapa saat.";
const UNEXPECTED = "Perangkat tidak dapat dihubungkan.";

export async function bindDevice(
  input: BindDeviceRequest,
  fetcher: Fetcher = fetch,
): Promise<BindDeviceResponse> {
  let response: Response;

  try {
    response = await fetcher("/api/v1/measurement/bind", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "same-origin",
    });
  } catch {
    return { success: false, message: DEVICE_UNAVAILABLE };
  }

  try {
    const parsed = BindDeviceResponseSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.success !== response.ok) {
      return { success: false, message: UNEXPECTED };
    }

    if (!parsed.data.success) {
      return {
        ...parsed.data,
        status: parsed.data.status ?? response.status,
      };
    }

    return parsed.data;
  } catch {
    return { success: false, message: UNEXPECTED };
  }
}
