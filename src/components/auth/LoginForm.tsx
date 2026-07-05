"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthInput } from "@/components/auth/AuthInput";
import { useLogin } from "@/features/auth/session/client/hooks/UseLogin";
import {
  type LoginFormData,
  type LoginFormInput,
  type LoginRequest,
  LoginRequestSchema,
} from "@/features/auth/session/shared/SessionSchema";

const defaultValues: LoginFormInput = {
  email: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();
  const { login, isPending, error } = useLogin();
  const {
    control,
    formState: { isValid },
    handleSubmit,
    setError,
  } = useForm<LoginFormInput, unknown, LoginFormData>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(LoginRequestSchema),
  });

  async function onSubmit(data: LoginFormData) {
    const result = await login(data);
    if (!result) return;

    if (!result.success) {
      const fieldErrors = Object.entries(result.fieldErrors ?? {}) as [
        keyof LoginRequest,
        string[],
      ][];

      for (const [field, messages] of fieldErrors) {
        setError(field, { type: "server", message: messages[0] });
      }

      toast.error(result.message);
      return;
    }

    toast.success("Berhasil masuk.");
    router.replace("/dashboard");
  }

  return (
    <div>
      <p className="text-[13px] font-semibold text-primary-300">
        Selamat Datang Kembali
      </p>
      <h1 className="mt-2.5 text-[36px] font-medium tracking-[-0.045em] text-primary-900">
        Masuk ke Akun
      </h1>

      <form
        aria-busy={isPending}
        className="mt-10 space-y-7"
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
        <div>
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <AuthInput
                autoComplete="current-password"
                error={fieldState.error?.message}
                inputRef={field.ref}
                label="Kata sandi"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                placeholder="Masukkan kata sandi"
                type="password"
                value={field.value}
              />
            )}
          />
          <div className="mt-3 text-right">
            <Link
              className="text-[12px] font-semibold text-primary-300 transition-colors hover:text-primary-600"
              href="#"
            >
              Lupa kata sandi?
            </Link>
          </div>
        </div>

        <button
          className={`h-14 w-full rounded-full text-[14px] font-semibold transition-[background-color,transform,box-shadow,opacity] duration-200 ${
            isValid && !isPending
              ? "bg-primary-300 text-white shadow-[0_10px_24px_rgba(0,110,251,0.16)] hover:bg-primary-400"
              : "cursor-not-allowed bg-primary-300 text-white opacity-50"
          }`}
          disabled={!isValid || isPending}
          type="submit"
        >
          {isPending ? "Mencoba masuk..." : "Masuk"}
        </button>
      </form>

      <p className="mt-7 text-center text-[12px] font-medium text-primary-900/35">
        Belum punya akun?{" "}
        <Link className="font-semibold text-primary-300" href="/register">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
