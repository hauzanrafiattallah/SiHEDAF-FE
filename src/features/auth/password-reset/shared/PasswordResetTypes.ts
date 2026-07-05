export type PasswordResetFieldErrors = Partial<
  Record<"email" | "new_password" | "confirm_password" | "token", string[]>
>;

export type PasswordResetSuccess = {
  success: true;
  message: string;
};

export type PasswordResetFailure = {
  success: false;
  message: string;
  fieldErrors?: PasswordResetFieldErrors;
  status?: number;
};

export type PasswordResetResponse =
  | PasswordResetSuccess
  | PasswordResetFailure;
