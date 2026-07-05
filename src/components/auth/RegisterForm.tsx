"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthInput } from "@/components/auth/AuthInput";
import { useRegister } from "@/features/auth/register/client/hooks/UseRegister";
import {
  RegisterFormSchema,
  RegisterRequestSchema,
  type RegisterFormData,
  type RegisterFormInput,
  type RegisterRequest,
} from "@/features/auth/register/shared/RegisterSchema";

const defaultValues: RegisterFormInput = {
  fullname: "",
  email: "",
  password: "",
  confirmation: "",
};

export function RegisterForm() {
  const router = useRouter();
  const { register, isPending, error } = useRegister();
  const {
    control,
    formState: { isValid },
    handleSubmit,
    setError,
  } = useForm<RegisterFormInput, unknown, RegisterFormData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(RegisterFormSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    const input = RegisterRequestSchema.parse(data);
    const result = await register(input);
    if (!result) return;

    if (!result.success) {
      const fieldErrors = Object.entries(result.fieldErrors ?? {}) as [
        keyof RegisterRequest,
        string[],
      ][];

      for (const [field, messages] of fieldErrors) {
        setError(field, { type: "server", message: messages[0] });
      }

      toast.error(result.message);
      return;
    }

    toast.success("Akun berhasil dibuat. Silakan masuk.");
    router.replace("/login");
  }

  return (
    <div>
      <p className="text-[13px] font-semibold text-primary-300">Buat Akun</p>
      <h1 className="mt-2.5 text-[36px] font-medium tracking-[-0.045em] text-primary-900">
        Daftar Akun
      </h1>

      <form
        aria-busy={isPending}
        className="mt-9 space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="fullname"
          render={({ field, fieldState }) => (
            <AuthInput
              autoComplete="name"
              error={fieldState.error?.message}
              inputRef={field.ref}
              label="Nama Lengkap"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Masukkan nama lengkap"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <AuthInput
              autoComplete="email"
              error={fieldState.error?.message}
              inputRef={field.ref}
              label="Email"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Masukkan email"
              type="email"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <AuthInput
              autoComplete="new-password"
              error={fieldState.error?.message}
              inputRef={field.ref}
              label="Kata sandi"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Buat kata sandi"
              type="password"
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmation"
          render={({ field, fieldState }) => (
            <AuthInput
              autoComplete="new-password"
              error={fieldState.error?.message}
              inputRef={field.ref}
              label="Konfirmasi Kata sandi"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="Masukkan ulang kata sandi"
              type="password"
              value={field.value}
            />
          )}
        />

        <button
          className={`h-14 w-full rounded-full text-[14px] font-semibold transition-[background-color,transform,box-shadow] duration-200 ${
            isValid && !isPending
              ? "bg-primary-300 text-white shadow-[0_10px_24px_rgba(0,110,251,0.16)] hover:bg-primary-400"
              : "cursor-not-allowed bg-[#e4e7eb] text-primary-900/30"
          }`}
          disabled={!isValid || isPending}
          type="submit"
        >
          {isPending ? "Mendaftarkan..." : "Daftar"}
        </button>
      </form>

      <p className="mt-7 text-center text-[12px] font-medium text-primary-900/35">
        Sudah punya akun?{" "}
        <Link className="font-semibold text-primary-300" href="/login">
          Masuk sekarang
        </Link>
      </p>
    </div>
  );
}
