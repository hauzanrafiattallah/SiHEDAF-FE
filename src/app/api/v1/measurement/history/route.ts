import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { buildBackendApiUrl } from "@/features/auth/shared/server/BackendUrl";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sihedaf_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    
    // Construct query parameters for the backend request
    const backendUrl = new URL(buildBackendApiUrl("measurement/history"));
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Gagal mengambil riwayat" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("History proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Kesalahan internal server" },
      { status: 500 }
    );
  }
}
