export type RegisterFieldErrors = Partial<
  Record<"fullname" | "email" | "password", string[]>
>;

export type RegisterSuccess = {
  success: true;
  message: string;
};

export type RegisterFailure = {
  success: false;
  message: string;
  fieldErrors?: RegisterFieldErrors;
};

export type RegisterResponse = RegisterSuccess | RegisterFailure;
