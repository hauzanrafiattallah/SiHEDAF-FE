import { z } from "zod";

export function createPasswordSchema(
  label = "Kata sandi",
  maxLength = 64,
) {
  return z
    .string()
    .min(8, `${label} minimal 8 karakter.`)
    .max(maxLength, `${label} maksimal ${maxLength} karakter.`)
    .regex(/[A-Z]/, `${label} harus memiliki huruf besar.`)
    .regex(/[a-z]/, `${label} harus memiliki huruf kecil.`)
    .regex(/[0-9]/, `${label} harus memiliki angka.`)
    .regex(/[^A-Za-z0-9\s]/, `${label} harus memiliki simbol.`)
    .regex(/^\S+$/, `${label} tidak boleh mengandung spasi.`);
}
