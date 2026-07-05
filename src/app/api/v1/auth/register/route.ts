import {
  registerUser,
  RegisterServiceError,
} from "@/features/auth/register/server/services/RegisterService";
import { RegisterRequestSchema } from "@/features/auth/register/shared/RegisterSchema";
import type {
  RegisterFailure,
  RegisterSuccess,
} from "@/features/auth/register/shared/RegisterTypes";

function json(body: RegisterFailure | RegisterSuccess, status: number) {
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

  const parsed = RegisterRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        success: false,
        message: "Periksa kembali data pendaftaran.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const result = await registerUser(parsed.data);
    return json({ success: true, message: result.message }, 200);
  } catch (error) {
    if (error instanceof RegisterServiceError) {
      return json({ success: false, message: error.message }, error.status);
    }

    return json(
      {
        success: false,
        message:
          "Layanan pendaftaran sedang bermasalah. Coba lagi beberapa saat.",
      },
      502,
    );
  }
}
