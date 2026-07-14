import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE } from "@/features/auth/session/server/AuthCookies";
import {
  DEVICE_SERVICE_UNAVAILABLE,
  DeviceServiceError,
} from "@/features/device/server/DeviceServiceError";
import { bindDevice } from "@/features/device/server/services/DeviceService";
import { BindDeviceRequestSchema } from "@/features/device/shared/DeviceSchema";
import type { BindDeviceResponse } from "@/features/device/shared/DeviceTypes";

function json(body: BindDeviceResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json(
      { success: false, message: "Format permintaan tidak valid." },
      400,
    );
  }

  const parsed = BindDeviceRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        success: false,
        message: "Periksa kembali ID perangkat.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return json(
      {
        success: false,
        message: "Sesi telah berakhir. Silakan masuk kembali.",
      },
      401,
    );
  }

  try {
    const result = await bindDevice(token, parsed.data);
    return json({ success: true, message: result.message }, 200);
  } catch (error) {
    if (error instanceof DeviceServiceError) {
      return json({ success: false, message: error.message }, error.status);
    }

    return json({ success: false, message: DEVICE_SERVICE_UNAVAILABLE }, 502);
  }
}
