"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { AuthInput } from "@/components/auth/AuthInput";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const isComplete =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    password !== "" &&
    confirmation !== "" &&
    password === confirmation;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete) return;
    router.push("/login");
  }

  return (
    <div>
      <p className="text-[13px] font-semibold text-primary-300">Buat Akun</p>
      <h1 className="mt-2.5 text-[36px] font-medium tracking-[-0.045em] text-primary-900">
        Daftar Akun
      </h1>

      <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
        <AuthInput
          autoComplete="name"
          label="Nama Lengkap"
          name="fullName"
          onChange={setFullName}
          placeholder="Masukkan nama lengkap"
          required
          value={fullName}
        />
        <AuthInput
          autoComplete="email"
          label="Email"
          name="email"
          onChange={setEmail}
          placeholder="Masukkan email"
          required
          type="email"
          value={email}
        />
        <AuthInput
          autoComplete="new-password"
          label="Kata sandi"
          name="password"
          onChange={setPassword}
          placeholder="Buat kata sandi"
          required
          type="password"
          value={password}
        />
        <AuthInput
          autoComplete="new-password"
          label="Konfirmasi Kata sandi"
          name="confirmation"
          onChange={setConfirmation}
          placeholder="Masukkan ulang kata sandi"
          required
          type="password"
          value={confirmation}
        />

        <button
          className={`mt-2 h-14 w-full rounded-full text-[14px] font-semibold transition-[background-color,transform,box-shadow] duration-200 ${
            isComplete
              ? "bg-primary-300 text-white shadow-[0_10px_24px_rgba(0,110,251,0.16)] hover:bg-primary-400"
              : "cursor-not-allowed bg-[#e4e7eb] text-primary-900/30"
          }`}
          disabled={!isComplete}
          type="submit"
        >
          Daftar
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
