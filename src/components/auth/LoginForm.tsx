"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { AuthInput } from "@/components/auth/AuthInput";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isComplete = email.trim() !== "" && password !== "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete) return;
    router.push("/hubungkan-perangkat");
  }

  return (
    <div>
      <p className="text-[13px] font-semibold text-primary-300">
        Selamat Datang Kembali
      </p>
      <h1 className="mt-2.5 text-[36px] font-medium tracking-[-0.045em] text-primary-900">
        Masuk ke Akun
      </h1>

      <form className="mt-10 space-y-7" onSubmit={handleSubmit}>
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
        <div>
          <AuthInput
            autoComplete="current-password"
            label="Kata sandi"
            name="password"
            onChange={setPassword}
            placeholder="Masukkan kata sandi"
            required
            type="password"
            value={password}
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
          className={`h-14 w-full rounded-full text-[14px] font-semibold transition-[background-color,transform,box-shadow] duration-200 ${
            isComplete
              ? "bg-primary-300 text-white shadow-[0_10px_24px_rgba(0,110,251,0.16)] hover:bg-primary-400"
              : "cursor-not-allowed bg-[#e4e7eb] text-primary-900/30"
          }`}
          disabled={!isComplete}
          type="submit"
        >
          Masuk
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
