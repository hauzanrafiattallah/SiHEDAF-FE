import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi | SiHEDAF",
  description: "Minta tautan reset kata sandi akun SiHEDAF",
};

export default function ForgotPasswordPage() {
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
