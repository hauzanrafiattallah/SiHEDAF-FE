"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthInput } from "@/components/auth/AuthInput";

export function ConnectDeviceForm() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("");
  const isComplete = deviceId.trim() !== "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete) return;

    router.push("/dashboard");
  }

  return (
    <form className="space-y-9" onSubmit={handleSubmit}>
      <AuthInput
        autoComplete="off"
        label="Masukkan Device ID"
        name="deviceId"
        onChange={setDeviceId}
        placeholder="Contoh: PPG001"
        required
        value={deviceId}
      />
      <button
        className={`h-14 w-full rounded-full text-[14px] font-semibold transition-[background-color,transform,box-shadow,opacity] duration-200 ${isComplete
            ? "bg-primary-300 text-white shadow-[0_10px_24px_rgba(0,110,251,0.16)] hover:bg-primary-400"
            : "cursor-not-allowed bg-primary-300 text-white opacity-50 disabled:hover:bg-primary-300"
          }`}
        disabled={!isComplete}
        type="submit"
      >
        Hubungkan perangkat
      </button>
    </form>
  );
}
