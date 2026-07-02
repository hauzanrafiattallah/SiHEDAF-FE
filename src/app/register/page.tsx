import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Daftar | SiHEDAF",
  description: "Buat akun SiHEDAF",
};

export default function RegisterPage() {
  return (
    <AuthShell
      accent="Stroke"
      description="Buat akun untuk mulai memantau risiko stroke melalui Atrial Fibrillation secara cerdas."
      titleLabel="Langkah Awal Pencegahan Stroke"
      titleLines={["Langkah Awal", "Pencegahan"]}
    >
      <RegisterForm />
    </AuthShell>
  );
}
