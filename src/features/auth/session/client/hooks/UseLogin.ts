"use client";

import { useCallback, useRef, useState } from "react";

import type { LoginRequest } from "../../shared/SessionSchema";
import type { AuthFailure, AuthResponse } from "../../shared/SessionTypes";
import { loginAccount } from "../services/LoginClient";

export function useLogin() {
  const inFlight = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<AuthFailure | null>(null);

  const login = useCallback(
    async (input: LoginRequest): Promise<AuthResponse | null> => {
      if (inFlight.current) return null;

      inFlight.current = true;
      setIsPending(true);
      setError(null);

      try {
        const result = await loginAccount(input);
        if (!result.success) setError(result);
        return result;
      } finally {
        inFlight.current = false;
        setIsPending(false);
      }
    },
    [],
  );

  return { login, isPending, error };
}
