import { AuthResponseSchema } from "@/features/auth/session/shared/SessionSchema";
import type { AuthResponse } from "@/features/auth/session/shared/SessionTypes";
import {
  ProfileMutationResponseSchema,
  ProfileResponseSchema,
  type UpdatePasswordRequest,
  type UpdateProfileRequest,
} from "@/features/profile/shared/ProfileSchema";
import type {
  ProfileMutationResponse,
  ProfileResponse,
} from "@/features/profile/shared/ProfileTypes";

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

async function readProfileResponse(
  response: Response,
  fallbackMessage: string,
): Promise<ProfileResponse> {
  try {
    const parsed = ProfileResponseSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.success !== response.ok) {
      return { success: false, message: fallbackMessage };
    }
    if (!parsed.data.success) {
      return { ...parsed.data, status: response.status };
    }
    return parsed.data;
  } catch {
    return { success: false, message: fallbackMessage };
  }
}

async function readMutationResponse(
  response: Response,
  fallbackMessage: string,
): Promise<ProfileMutationResponse> {
  try {
    const parsed = ProfileMutationResponseSchema.safeParse(
      await response.json(),
    );
    if (!parsed.success || parsed.data.success !== response.ok) {
      return { success: false, message: fallbackMessage };
    }
    if (!parsed.data.success) {
      return { ...parsed.data, status: response.status };
    }
    return parsed.data;
  } catch {
    return { success: false, message: fallbackMessage };
  }
}

export async function fetchCurrentProfile(
  fetcher: Fetcher = fetch,
): Promise<ProfileResponse> {
  try {
    const response = await fetcher("/api/v1/auth/me", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });
    return readProfileResponse(response, "Data profil tidak dapat dimuat.");
  } catch {
    return { success: false, message: "Data profil tidak dapat dimuat." };
  }
}

export async function updateProfile(
  input: UpdateProfileRequest,
  fetcher: Fetcher = fetch,
): Promise<ProfileMutationResponse> {
  try {
    const response = await fetcher("/api/v1/auth/me/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "same-origin",
    });
    return readMutationResponse(response, "Profil tidak dapat diperbarui.");
  } catch {
    return { success: false, message: "Profil tidak dapat diperbarui." };
  }
}

export async function updatePassword(
  input: UpdatePasswordRequest,
  fetcher: Fetcher = fetch,
): Promise<ProfileMutationResponse> {
  try {
    const response = await fetcher("/api/v1/auth/me/update-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "same-origin",
    });
    return readMutationResponse(
      response,
      "Kata sandi tidak dapat diperbarui.",
    );
  } catch {
    return {
      success: false,
      message: "Kata sandi tidak dapat diperbarui.",
    };
  }
}

export async function logoutAccount(
  fetcher: Fetcher = fetch,
): Promise<AuthResponse> {
  try {
    const response = await fetcher("/api/v1/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    const parsed = AuthResponseSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.success !== response.ok) {
      return { success: false, message: "Akun tidak dapat dikeluarkan." };
    }
    return parsed.data;
  } catch {
    return { success: false, message: "Akun tidak dapat dikeluarkan." };
  }
}
