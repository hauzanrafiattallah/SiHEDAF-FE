"use client";

import { useCallback, useRef, useState } from "react";

import type { RegisterRequest } from "../../shared/RegisterSchema";
import type {
  RegisterFailure,
  RegisterResponse,
} from "../../shared/RegisterTypes";
import { registerAccount } from "../services/RegisterClient";

export function useRegister() {
  const inFlight = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<RegisterFailure | null>(null);

  const register = useCallback(
    async (input: RegisterRequest): Promise<RegisterResponse | null> => {
      if (inFlight.current) return null;

      inFlight.current = true;
      setIsPending(true);
      setError(null);

      try {
        const result = await registerAccount(input);
        if (!result.success) setError(result);
        return result;
      } finally {
        inFlight.current = false;
        setIsPending(false);
      }
    },
    [],
  );

  return { register, isPending, error };
}
