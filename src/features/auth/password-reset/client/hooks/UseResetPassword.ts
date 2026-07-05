"use client";

import { useCallback, useRef, useState } from "react";

import type { ResetPasswordRequest } from "../../shared/PasswordResetSchema";
import type {
  PasswordResetFailure,
  PasswordResetResponse,
} from "../../shared/PasswordResetTypes";
import { submitResetPassword } from "../services/PasswordResetClient";

export function useResetPassword() {
  const inFlight = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<PasswordResetFailure | null>(null);

  const resetPassword = useCallback(
    async (
      input: ResetPasswordRequest,
    ): Promise<PasswordResetResponse | null> => {
      if (inFlight.current) return null;

      inFlight.current = true;
      setIsPending(true);
      setError(null);

      try {
        const result = await submitResetPassword(input);
        if (!result.success) setError(result);
        return result;
      } finally {
        inFlight.current = false;
        setIsPending(false);
      }
    },
    [],
  );

  return { resetPassword, isPending, error };
}
