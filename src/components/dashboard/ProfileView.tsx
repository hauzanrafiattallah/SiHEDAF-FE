"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, LogOut } from "lucide-react";

import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import {
  defaultProfileSnapshot,
  getProfileSnapshot,
  parseProfileSnapshot,
  subscribeProfile,
} from "@/components/dashboard/ProfileStorage";

type ActiveModal = "logout" | "password" | null;

function ProfileAvatar({
  avatarDataUrl = "",
}: {
  avatarDataUrl?: string;
}) {
  return (
    <span className="relative block h-20 w-20 shrink-0">
      <span
        className="grid h-20 w-20 place-items-center rounded-full border-4 border-white/80 bg-[radial-gradient(circle_at_32%_28%,#d9efff_0_16%,transparent_17%),linear-gradient(145deg,#8ab8dd,#315a85)] bg-cover bg-center text-[17px] font-semibold text-white shadow-sm"
        style={avatarDataUrl ? { backgroundImage: `url(${avatarDataUrl})` } : undefined}
      >
        {avatarDataUrl ? <span className="sr-only">Foto profil</span> : "AS"}
      </span>
    </span>
  );
}

export function ProfileView() {
  const router = useRouter();
  const profileSnapshot = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    () => defaultProfileSnapshot,
  );
  const profile = parseProfileSnapshot(profileSnapshot);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);

  function closeModal() {
    setActiveModal(null);
    setPasswordError("");
    setIsPasswordSaved(false);
  }

  function openPasswordModal() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setIsPasswordSaved(false);
    setActiveModal("password");
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || newPassword.length < 8) {
      setPasswordError("Isi kata sandi saat ini dan gunakan minimal 8 karakter untuk kata sandi baru.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi baru belum sama.");
      return;
    }

    setPasswordError("");
    setIsPasswordSaved(true);
  }

  return (
    <section className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="max-w-[720px]">
        <h1 className="text-[22px] font-semibold">Profil Akun</h1>
        <p className="mt-2 text-[13px] text-[#969ca5]">Kelola profil kamu di sini</p>

        <article className="mt-7 flex items-center gap-6 rounded-[24px] bg-[linear-gradient(105deg,#f5fbff,#dcecff)] px-7 py-7">
          <ProfileAvatar avatarDataUrl={profile.avatarDataUrl} />
          <div>
            <h2 className="text-[18px] font-semibold text-[#1b2026]">{profile.fullName}</h2>
            <p className="mt-1.5 text-[13px] text-[#7f8790]">{profile.email}</p>
          </div>
        </article>

        <article className="mt-6 overflow-hidden rounded-[24px] border border-[#e3e7eb] bg-white">
          <div className="flex items-center justify-between px-7 py-5">
            <h2 className="text-[16px] font-semibold">Informasi Profil</h2>
            <Link
              className="flex h-10 items-center gap-2 rounded-full border border-primary-300 px-5 text-[12px] font-medium text-primary-300 transition-colors hover:bg-primary-50"
              href="/profil/ubah"
            >
              <DashboardIcon className="h-3.5 w-3.5" name="edit" />
              Edit Profil
            </Link>
          </div>

          <dl className="divide-y divide-[#edf0f3]">
            <div className="grid grid-cols-[1fr_1.2fr] gap-5 px-7 py-5 text-[12px]">
              <dt className="text-[#9298a1]">Nama Lengkap</dt>
              <dd className="text-right font-medium text-[#252a30]">{profile.fullName}</dd>
            </div>
            <div className="grid grid-cols-[1fr_1.2fr] gap-5 px-7 py-5 text-[12px]">
              <dt className="text-[#9298a1]">Email</dt>
              <dd className="text-right font-medium text-[#252a30]">{profile.email}</dd>
            </div>
            <div className="grid grid-cols-[1fr_1.2fr] gap-5 px-7 py-5 text-[12px]">
              <dt className="text-[#9298a1]">Perangkat Terdaftar</dt>
              <dd className="text-right font-medium text-[#252a30]">PPG001</dd>
            </div>
          </dl>
        </article>

        <div className="mt-5 space-y-3">
          <button
            className="group flex h-14 w-full items-center rounded-full border border-[#e3e7eb] bg-white px-6 text-[13px] transition-colors hover:border-primary-200 hover:bg-primary-50/40"
            onClick={openPasswordModal}
            type="button"
          >
            <DashboardIcon className="mr-3 h-4 w-4 text-primary-300" name="key" />
            Ubah kata sandi
            <DashboardIcon className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" name="chevron" />
          </button>
          <button
            className="group flex h-14 w-full items-center rounded-full border border-[#e3e7eb] bg-white px-6 text-[13px] text-[#ff3768] transition-colors hover:border-[#ffb2c4] hover:bg-[#fff7f9]"
            onClick={() => setActiveModal("logout")}
            type="button"
          >
            <DashboardIcon className="mr-3 h-4 w-4" name="logout" />
            Keluar akun
            <DashboardIcon className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" name="chevron" />
          </button>
        </div>
      </div>

      <DashboardModal
        description={
          isPasswordSaved
            ? "Kata sandi akunmu sudah diperbarui pada simulasi ini."
            : "Gunakan minimal 8 karakter agar kata sandi baru lebih aman."
        }
        onClose={closeModal}
        open={activeModal === "password"}
        title={isPasswordSaved ? "Kata sandi berhasil diubah" : "Ubah kata sandi"}
      >
        {isPasswordSaved ? (
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e8f8ec] text-[#43b956]">
              <CheckCircle2 aria-hidden="true" size={32} strokeWidth={1.8} />
            </span>
            <button
              className="mt-7 h-12 w-full rounded-full bg-primary-300 text-[13px] font-medium text-white transition-colors hover:bg-primary-400"
              onClick={closeModal}
              type="button"
            >
              Selesai
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-primary-300">
              <KeyRound aria-hidden="true" size={26} strokeWidth={1.8} />
            </span>
            {[
              {
                label: "Kata sandi saat ini",
                onChange: setCurrentPassword,
                value: currentPassword,
              },
              { label: "Kata sandi baru", onChange: setNewPassword, value: newPassword },
              {
                label: "Konfirmasi kata sandi baru",
                onChange: setConfirmPassword,
                value: confirmPassword,
              },
            ].map((field) => (
              <label className="block text-[12px] text-[#737b85]" key={field.label}>
                {field.label}
                <input
                  autoComplete="new-password"
                  className="mt-2 h-12 w-full rounded-full border border-[#dce2e7] px-4 text-[13px] outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
                  onChange={(event) => field.onChange(event.target.value)}
                  type="password"
                  value={field.value}
                />
              </label>
            ))}
            {passwordError ? (
              <p aria-live="polite" className="text-[12px] leading-5 text-[#ff3768]">
                {passwordError}
              </p>
            ) : null}
            <button
              className="h-12 w-full rounded-full bg-primary-300 text-[13px] font-medium text-white transition-colors hover:bg-primary-400"
              type="submit"
            >
              Simpan kata sandi
            </button>
          </form>
        )}
      </DashboardModal>

      <DashboardModal
        description="Kamu akan keluar dari dashboard dan diarahkan kembali ke halaman masuk."
        onClose={closeModal}
        open={activeModal === "logout"}
        title="Keluar dari akun?"
      >
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff0f4] text-[#ff3768]">
            <LogOut aria-hidden="true" size={30} strokeWidth={1.8} />
          </span>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              className="h-12 rounded-full border border-[#dfe4e8] text-[13px] text-[#707781] transition-colors hover:bg-[#f6f8fa]"
              onClick={closeModal}
              type="button"
            >
              Batal
            </button>
            <button
              className="h-12 rounded-full bg-[#ff3768] text-[13px] font-medium text-white transition-colors hover:bg-[#e92a59]"
              onClick={() => router.push("/login")}
              type="button"
            >
              Ya, keluar
            </button>
          </div>
        </div>
      </DashboardModal>
    </section>
  );
}

export { ProfileAvatar };

