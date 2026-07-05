"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthInput } from "@/components/auth/AuthInput";
import { usePasswordResetEmail } from "@/features/auth/password-reset/client/hooks/UsePasswordResetEmail";
import {
  ResetPasswordEmailSchema,
  type ResetPasswordEmailInput,
  type ResetPasswordEmailRequest,
} from "@/features/auth/password-reset/shared/PasswordResetSchema";

const defaultValues: ResetPasswordEmailInput = { email: "" };

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { sendEmail, isPending } = usePasswordResetEmail();
  const {
    control,
    formState: { isValid },
    handleSubmit,
    setError,
  } = useForm<
    ResetPasswordEmailInput,
    unknown,
    ResetPasswordEmailRequest
  >({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(ResetPasswordEmailSchema),
  });

  async function onSubmit(data: ResetPasswordEmailRequest) {
    const result = await sendEmail(data);
    if (!result) return;

    if (!result.success) {
      const fieldErrors = Object.entries(result.fieldErrors ?? {}) as [
        keyof ResetPasswordEmailRequest,
        string[],
      ][];

      for (const [field, messages] of fieldErrors) {
        setError(field, { type: "server", message: messages[0] });
      }

      toast.error(result.message);
      return;
    }

    setIsSubmitted(true);
    toast.success(result.message);
  }

  if (isSubmitted) {
    return (
      <div className="text-center sm:text-left">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary-50 text-primary-300 sm:mx-0">
          <MailCheck aria-hidden="true" className="size-7" />
        </div>
        <p className="mt-6 text-[13px] font-semibold text-primary-300">
          Periksa Email
        </p>
        <h1 className="mt-2.5 text-[34px] font-medium tracking-[-0.045em] text-primary-900 sm:text-[36px]">
          Tautan Reset Dikirim
        </h1>
        <p className="mt-4 max-w-[500px] text-[14px] leading-6 font-medium text-primary-900/55">
          Jika email terdaftar, tautan reset kata sandi telah dikirim. Periksa
          kotak masuk dan folder spam kamu.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary-300 px-7 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(0,110,251,0.16)] transition-colors hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            href="/login"
          >
            Kembali ke Login
          </Link>
          <button
            className="h-14 rounded-full border border-primary-200 px-7 text-[14px] font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
            onClick={() => setIsSubmitted(false)}
            type="button"
          >
            Gunakan email lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[13px] font-semibold text-primary-300">
        Pemulihan Akun
      </p>
      <h1 className="mt-2.5 text-[34px] font-medium tracking-[-0.045em] text-primary-900 sm:text-[36px]">
        Lupa Kata Sandi
      </h1>
      <p className="mt-3 max-w-[500px] text-[14px] leading-6 font-medium text-primary-900/50">
        Masukkan email akunmu. Kami akan mengirimkan tautan untuk membuat kata
        sandi baru.
      </p>

      <form
        aria-busy={isPending}
        className="mt-9 space-y-7"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
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

        <button
          className={`h-14 w-full rounded-full text-[14px] font-semibold transition-[background-color,box-shadow,opacity] duration-200 ${
            isValid && !isPending
              ? "bg-primary-300 text-white shadow-[0_10px_24px_rgba(0,110,251,0.16)] hover:bg-primary-400"
              : "cursor-not-allowed bg-primary-300 text-white opacity-50"
          }`}
          disabled={!isValid || isPending}
          type="submit"
        >
          {isPending ? "Mengirim tautan..." : "Kirim Tautan Reset"}
        </button>
      </form>

      <p className="mt-7 text-center text-[12px] font-medium text-primary-900/40">
        Ingat kata sandimu?{" "}
        <Link className="font-semibold text-primary-300" href="/login">
          Kembali ke login
        </Link>
      </p>
    </div>
  );
}
