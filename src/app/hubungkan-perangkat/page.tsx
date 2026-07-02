import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { ConnectDeviceForm } from "@/components/auth/ConnectDeviceForm";

export const metadata: Metadata = {
  title: "Hubungkan Perangkat | SiHEDAF",
  description: "Hubungkan perangkat SiHEDAF",
};

export default function ConnectDevicePage() {
  return (
    <AuthShell
      accent="SiHEDAF"
      description="Masukkan Device ID yang tertera pada perangkatmu."
      titleLabel="Hubungkan Perangkat SiHEDAF"
      titleLines={["Hubungkan", "Perangkat"]}
    >
      <ConnectDeviceForm />
    </AuthShell>
  );
}
