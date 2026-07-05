export type AuthFieldErrors = Partial<
  Record<"email" | "password", string[]>
>;

export type AuthSuccess = {
  success: true;
  message: string;
};

export type AuthFailure = {
  success: false;
  message: string;
  fieldErrors?: AuthFieldErrors;
};

export type AuthResponse = AuthSuccess | AuthFailure;

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AccessTokenResult = {
  accessToken: string;
};
