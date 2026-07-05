import { z } from "zod";

import { createPasswordSchema } from "@/features/auth/shared/PasswordSchema";

import type { PasswordResetResponse } from "./PasswordResetTypes";

export const ResetPasswordTokenSchema = z
  .string()
  .trim()
  .min(1, "Token reset kata sandi wajib tersedia.")
  .max(2048, "Token reset kata sandi tidak valid.");

export const ResetPasswordEmailSchema = z
  .object({
    email: z
      .string()
      .trim()
      .max(254, "Email maksimal 254 karakter.")
      .pipe(z.email("Format email tidak valid."))
      .transform((email) => email.toLowerCase()),
  })
  .strict();

const resetPasswordFields = {
  new_password: createPasswordSchema("Kata sandi baru", 128),
  confirm_password: z.string().min(1, "Konfirmasi kata sandi wajib diisi."),
};

function passwordsMatch(
  values: { new_password: string; confirm_password: string },
  context: z.RefinementCtx,
) {
  if (values.new_password !== values.confirm_password) {
    context.addIssue({
      code: "custom",
      message: "Konfirmasi kata sandi baru belum sama.",
      path: ["confirm_password"],
    });
  }
}

export const ResetPasswordFormSchema = z
  .object(resetPasswordFields)
  .strict()
  .superRefine(passwordsMatch);

export const ResetPasswordRequestSchema = z
  .object({
    ...resetPasswordFields,
    token: ResetPasswordTokenSchema,
  })
  .strict()
  .superRefine(passwordsMatch);

const PasswordResetFieldErrorsSchema = z
  .object({
    email: z.array(z.string()).optional(),
    new_password: z.array(z.string()).optional(),
    confirm_password: z.array(z.string()).optional(),
    token: z.array(z.string()).optional(),
  })
  .optional();

export const PasswordResetResponseSchema: z.ZodType<PasswordResetResponse> =
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string().min(1),
    }),
    z.object({
      success: z.literal(false),
      message: z.string().min(1),
      fieldErrors: PasswordResetFieldErrorsSchema,
      status: z.number().int().optional(),
    }),
  ]);

export type ResetPasswordEmailRequest = z.infer<
  typeof ResetPasswordEmailSchema
>;
export type ResetPasswordEmailInput = z.input<
  typeof ResetPasswordEmailSchema
>;
export type ResetPasswordFormInput = z.input<typeof ResetPasswordFormSchema>;
export type ResetPasswordFormData = z.output<typeof ResetPasswordFormSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
