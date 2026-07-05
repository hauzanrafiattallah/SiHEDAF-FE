import { z } from "zod";

import type { AuthResponse } from "./SessionTypes";

export const LoginRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, "Email maksimal 254 karakter.")
    .pipe(z.email("Format email tidak valid."))
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(1, "Kata sandi wajib diisi.")
    .max(128, "Kata sandi maksimal 128 karakter."),
});

export const AuthResponseSchema: z.ZodType<AuthResponse> =
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string().min(1),
    }),
    z.object({
      success: z.literal(false),
      message: z.string().min(1),
      fieldErrors: z
        .object({
          email: z.array(z.string()).optional(),
          password: z.array(z.string()).optional(),
        })
        .optional(),
    }),
  ]);

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginFormInput = z.input<typeof LoginRequestSchema>;
export type LoginFormData = z.output<typeof LoginRequestSchema>;
