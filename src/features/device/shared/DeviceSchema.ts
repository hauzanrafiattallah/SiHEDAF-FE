import { z } from "zod";

import type { BindDeviceResponse } from "./DeviceTypes";

export const BindDeviceRequestSchema = z
  .object({
    deviceNumber: z
      .string()
      .trim()
      .min(1, "Device Number wajib diisi.")
      .max(64, "Device Number maksimal 64 karakter.")
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Device Number hanya boleh berisi huruf, angka, strip, atau underscore.",
      )
      .transform((deviceNumber) => deviceNumber.toUpperCase()),
  })
  .strict();

export const BindDeviceResponseSchema: z.ZodType<BindDeviceResponse> =
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
          deviceNumber: z.array(z.string()).optional(),
        })
        .optional(),
      status: z.number().int().optional(),
    }),
  ]);

export type BindDeviceRequest = z.infer<typeof BindDeviceRequestSchema>;
export type BindDeviceInput = z.input<typeof BindDeviceRequestSchema>;
