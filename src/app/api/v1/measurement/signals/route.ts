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
    const backendUrl = new URL(buildBackendApiUrl("measurement/signals"));
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Gagal mengambil data sinyal" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Signals proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Kesalahan internal server" },
      { status: 500 }
    );
  }
}
