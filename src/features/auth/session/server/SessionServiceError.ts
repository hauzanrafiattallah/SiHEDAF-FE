export const AUTH_SERVICE_UNAVAILABLE =
  "Layanan autentikasi sedang bermasalah. Coba lagi beberapa saat.";
export const INVALID_CREDENTIALS = "Email atau kata sandi salah.";
export const SESSION_EXPIRED =
  "Sesi Anda telah berakhir. Silakan masuk kembali.";

export class SessionServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "SessionServiceError";
  }
}
