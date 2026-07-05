"use client";

import { useEffect, useState } from "react";

import type { PasswordResetFailure } from "../../shared/PasswordResetTypes";
import { verifyPasswordResetToken } from "../services/PasswordResetClient";

export type ResetTokenStatus = "checking" | "valid" | "invalid";

type VerificationState = {
  token: string;
  status: ResetTokenStatus;
  error: PasswordResetFailure | null;
};

export function useVerifyResetToken(token: string) {
  const [state, setState] = useState<VerificationState>(() => ({
    token,
    status: token ? "checking" : "invalid",
    error: token
      ? null
      : {
          success: false,
          message: "Tautan reset kata sandi tidak valid.",
        },
  }));

  useEffect(() => {
    if (!token) return;

    let active = true;
    void verifyPasswordResetToken(token).then((result) => {
      if (!active) return;

      setState({
        token,
        status: result.success ? "valid" : "invalid",
        error: result.success ? null : result,
      });
    });

    return () => {
      active = false;
    };
  }, [token]);

  if (!token) {
    return {
      status: "invalid" as const,
      error: state.token === token ? state.error : null,
    };
  }

  if (state.token !== token) {
    return { status: "checking" as const, error: null };
  }

  return { status: state.status, error: state.error };
}
