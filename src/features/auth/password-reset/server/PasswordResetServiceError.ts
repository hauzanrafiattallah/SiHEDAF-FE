export const PASSWORD_RESET_UNAVAILABLE =
  "Layanan reset kata sandi sedang bermasalah. Coba lagi beberapa saat.";
export const INVALID_RESET_TOKEN =
  "Tautan reset kata sandi tidak valid atau sudah kedaluwarsa.";
export const RESET_EMAIL_SENT =
  "Jika email terdaftar, tautan reset telah dikirim.";
export const PASSWORD_RESET_SUCCESS =
  "Kata sandi berhasil diatur ulang.";
export const RESET_EMAIL_RATE_LIMITED =
  "Terlalu banyak permintaan. Coba lagi beberapa saat.";

export class PasswordResetServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "PasswordResetServiceError";
  }
}
