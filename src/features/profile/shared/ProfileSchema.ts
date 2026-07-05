import { z } from "zod";

import type {
  ProfileMutationResponse,
  ProfileResponse,
  UserProfile,
} from "./ProfileTypes";

export const ProfileUserSchema: z.ZodType<UserProfile> = z.object({
  id: z.number().int().positive(),
  fullname: z.string().min(1),
  email: z.email(),
  profileImage: z.string().min(1).nullable(),
});

export const UpdateProfileRequestSchema = z
  .object({
    fullname: z
      .string()
      .trim()
      .min(4, "Nama lengkap minimal 4 karakter.")
      .max(100, "Nama lengkap maksimal 100 karakter."),
  })
  .strict();

export const UpdatePasswordRequestSchema = z
  .object({
    old_password: z
      .string()
      .min(1, "Kata sandi saat ini wajib diisi.")
      .max(128, "Kata sandi saat ini maksimal 128 karakter."),
    new_password: z
      .string()
      .min(8, "Kata sandi baru minimal 8 karakter.")
      .max(128, "Kata sandi baru maksimal 128 karakter."),
    confirm_password: z.string().min(1, "Konfirmasi kata sandi wajib diisi."),
  })
  .strict()
  .superRefine((values, context) => {
    if (values.new_password !== values.confirm_password) {
      context.addIssue({
        code: "custom",
        message: "Konfirmasi kata sandi baru belum sama.",
        path: ["confirm_password"],
      });
    }

    if (values.old_password === values.new_password) {
      context.addIssue({
        code: "custom",
        message: "Kata sandi baru harus berbeda dari kata sandi saat ini.",
        path: ["new_password"],
      });
    }
  });

const ProfileFieldErrorsSchema = z
  .object({
    fullname: z.array(z.string()).optional(),
    old_password: z.array(z.string()).optional(),
    new_password: z.array(z.string()).optional(),
    confirm_password: z.array(z.string()).optional(),
  })
  .optional();

export const ProfileResponseSchema: z.ZodType<ProfileResponse> =
  z.discriminatedUnion("success", [
    z.object({ success: z.literal(true), user: ProfileUserSchema }),
    z.object({
      success: z.literal(false),
      message: z.string().min(1),
      fieldErrors: ProfileFieldErrorsSchema,
      status: z.number().int().optional(),
    }),
  ]);

export const ProfileMutationResponseSchema: z.ZodType<ProfileMutationResponse> =
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      message: z.string().min(1),
      user: ProfileUserSchema.optional(),
    }),
    z.object({
      success: z.literal(false),
      message: z.string().min(1),
      fieldErrors: ProfileFieldErrorsSchema,
      status: z.number().int().optional(),
    }),
  ]);

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type UpdatePasswordRequest = z.infer<
  typeof UpdatePasswordRequestSchema
>;
