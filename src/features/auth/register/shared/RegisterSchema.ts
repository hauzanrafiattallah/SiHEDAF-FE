import { z } from "zod";

import { createPasswordSchema } from "@/features/auth/shared/PasswordSchema";

import type { RegisterResponse } from "./RegisterTypes";

const passwordSchema = createPasswordSchema();

export const RegisterRequestSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, "Nama lengkap minimal 3 karakter.")
    .max(100, "Nama lengkap maksimal 100 karakter."),
  email: z
    .string()
    .trim()
    .max(254, "Email maksimal 254 karakter.")
    .pipe(z.email("Format email tidak valid."))
    .transform((email) => email.toLowerCase()),
  password: passwordSchema,
});

export const RegisterFormSchema = RegisterRequestSchema.extend({
  confirmation: z.string().min(1, "Konfirmasi kata sandi wajib diisi."),
}).refine((data) => data.password === data.confirmation, {
  message: "Konfirmasi kata sandi tidak cocok.",
  path: ["confirmation"],
});

export const RegisterResponseSchema: z.ZodType<RegisterResponse> =
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
          fullname: z.array(z.string()).optional(),
          email: z.array(z.string()).optional(),
          password: z.array(z.string()).optional(),
        })
        .optional(),
    }),
  ]);

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterFormInput = z.input<typeof RegisterFormSchema>;
export type RegisterFormData = z.output<typeof RegisterFormSchema>;
