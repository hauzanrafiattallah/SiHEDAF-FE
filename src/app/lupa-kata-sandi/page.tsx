import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi | SiHEDAF",
  description: "Minta tautan reset kata sandi akun SiHEDAF",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const rawToken = (await searchParams).token;
  const token = typeof rawToken === "string" ? rawToken.trim() : "";

  if (token) {
    return (
      <AuthShell
        accent="Aman"
        description="Buat kata sandi baru untuk menjaga akses dan data pemantauan kesehatanmu tetap terlindungi."
        titleLabel="Keamanan Akun SiHEDAF"
        titleLines={["Lindungi", "Akun"]}
      >
        <ResetPasswordForm token={token} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      accent="Akun"
      description="Pulihkan akses dengan tautan aman yang dikirim langsung ke email akun SiHEDAF kamu."
      titleLabel="Pemulihan Akun SiHEDAF"
      titleLines={["Pulihkan", "Akses"]}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
