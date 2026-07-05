"use client";

import { useCallback, useRef, useState } from "react";

import type { ResetPasswordEmailRequest } from "../../shared/PasswordResetSchema";
import type {
  PasswordResetFailure,
  PasswordResetResponse,
} from "../../shared/PasswordResetTypes";
import { requestPasswordResetEmail } from "../services/PasswordResetClient";

export function usePasswordResetEmail() {
  const inFlight = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<PasswordResetFailure | null>(null);

  const sendEmail = useCallback(
    async (
      input: ResetPasswordEmailRequest,
    ): Promise<PasswordResetResponse | null> => {
      if (inFlight.current) return null;

      inFlight.current = true;
      setIsPending(true);
      setError(null);

      try {
        const result = await requestPasswordResetEmail(input);
        if (!result.success) setError(result);
        return result;
      } finally {
        inFlight.current = false;
        setIsPending(false);
      }
    },
    [],
  );

  return { sendEmail, isPending, error };
}
