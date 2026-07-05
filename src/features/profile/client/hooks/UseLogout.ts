"use client";

import { useCallback, useRef, useState } from "react";

import { logoutAccount } from "@/features/profile/client/services/ProfileClient";
import type {
  AuthFailure,
  AuthResponse,
} from "@/features/auth/session/shared/SessionTypes";

export function useLogout() {
  const inFlight = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<AuthFailure | null>(null);

  const logout = useCallback(async (): Promise<AuthResponse | null> => {
    if (inFlight.current) return null;

    inFlight.current = true;
    setIsPending(true);
    setError(null);

    try {
      const result = await logoutAccount();
      if (!result.success) setError(result);
      return result;
    } finally {
      inFlight.current = false;
      setIsPending(false);
    }
  }, []);

  return { logout, isPending, error };
}
