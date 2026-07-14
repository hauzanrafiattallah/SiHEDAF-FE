"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthInput } from "@/components/auth/AuthInput";
import type { BindDeviceResponse } from "@/features/device/shared/DeviceTypes";

export function ConnectDeviceForm() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isComplete = deviceId.trim() !== "" && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v1/measurement/bind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceNumber: deviceId }),
      });
      const data = (await res.json()) as BindDeviceResponse;

      if (!data.success) {
        setError(data.message);
        if (data.fieldErrors?.deviceNumber) {
          setError(data.fieldErrors.deviceNumber[0]);
        }
        return;
      }

      toast.success(data.message);
      router.push("/dashboard");
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-9" onSubmit={handleSubmit}>
      <AuthInput
        autoComplete="off"
        label="Masukkan Device ID"
        name="deviceId"
        onChange={(val) => {
          setDeviceId(val);
          setError("");
        }}
        placeholder="Contoh: 308398DC47BC"
        required
        value={deviceId}
        error={error}
      />
      <button
        className={`h-14 w-full rounded-full text-[14px] font-semibold transition-[background-color,transform,box-shadow,opacity] duration-200 ${
          isComplete
            ? "bg-primary-300 text-white shadow-[0_10px_24px_rgba(0,110,251,0.16)] hover:bg-primary-400"
            : "cursor-not-allowed bg-primary-300 text-white opacity-50 disabled:hover:bg-primary-300"
        }`}
        disabled={!isComplete}
        type="submit"
      >
        {isSubmitting ? "Menghubungkan..." : "Hubungkan perangkat"}
      </button>
    </form>
  );
}
