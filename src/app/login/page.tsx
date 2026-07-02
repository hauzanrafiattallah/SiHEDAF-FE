import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Masuk | SiHEDAF",
  description: "Masuk ke akun SiHEDAF",
};

export default function LoginPage() {
  return (
    <AuthShell
      accent="Stroke"
      description="Pantau irama jantungmu dengan teknologi wearable dan dukungan AI untuk mencegah stroke."
      titleLabel="Deteksi Dini Risiko Stroke"
      titleLines={["Deteksi Dini", "Risiko"]}
    >
      <LoginForm />
    </AuthShell>
  );
}
