"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { ProfileAvatar } from "@/components/dashboard/ProfileAvatar";
import { useLogout } from "@/features/profile/client/hooks/UseLogout";
import { useUpdatePassword } from "@/features/profile/client/hooks/UseUpdatePassword";
import { useProfile } from "@/features/profile/client/ProfileProvider";
import {
  type UpdatePasswordRequest,
  UpdatePasswordRequestSchema,
} from "@/features/profile/shared/ProfileSchema";

type ActiveModal = "logout" | "password" | null;

const passwordDefaults: UpdatePasswordRequest = {
  old_password: "",
  new_password: "",
  confirm_password: "",
};

const passwordInputClassName =
  "mt-2 h-12 w-full rounded-full border border-[#dce2e7] px-4 text-[13px] outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100";

export function ProfileView() {
  const router = useRouter();
  const { user, isLoading, error: profileError, reload } = useProfile();
  const {
    submit: submitPassword,
    isPending: isPasswordPending,
    error: passwordMutationError,
  } = useUpdatePassword();
  const {
    logout,
    isPending: isLogoutPending,
    error: logoutError,
  } = useLogout();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<UpdatePasswordRequest>({
    defaultValues: passwordDefaults,
    mode: "onChange",
    resolver: zodResolver(UpdatePasswordRequestSchema),
  });

  function closeModal() {
    setActiveModal(null);
    setIsPasswordSaved(false);
    reset(passwordDefaults);
  }

  function openPasswordModal() {
    reset(passwordDefaults);
    setIsPasswordSaved(false);
    setActiveModal("password");
  }

  async function handlePasswordSubmit(input: UpdatePasswordRequest) {
    const result = await submitPassword(input);
    if (!result) return;

    if (!result.success) {
      for (const [field, messages] of Object.entries(
        result.fieldErrors ?? {},
      )) {
        setError(field as keyof UpdatePasswordRequest, {
          message: messages?.[0],
          type: "server",
        });
      }
      toast.error(result.message);
      if (result.status === 401) router.replace("/login");
      return;
    }

    toast.success(result.message);
    setIsPasswordSaved(true);
    reset(passwordDefaults);
  }

  async function handleLogout() {
    const result = await logout();
    if (!result) return;
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.replace("/login");
    router.refresh();
  }

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9"
      >
        <div className="h-56 max-w-[720px] animate-pulse rounded-[24px] bg-white" />
      </section>
    );
  }

  if (profileError || !user) {
    return (
      <section className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
        <div className="max-w-[720px] rounded-[24px] border border-[#ffd2dc] bg-white p-7">
          <h1 className="text-[22px] font-semibold">Profil Akun</h1>
          <p className="mt-3 text-[13px] text-[#d72d55]">
            {profileError ?? "Data profil tidak tersedia."}
          </p>
          <button
            className="mt-5 h-11 rounded-full bg-primary-300 px-6 text-[13px] font-medium text-white hover:bg-primary-400"
            onClick={() => void reload()}
            type="button"
          >
            Coba lagi
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="max-w-[720px]">
        <h1 className="text-[22px] font-semibold">Profil Akun</h1>
        <p className="mt-2 text-[13px] text-[#969ca5]">Kelola profil kamu di sini</p>

        <article className="mt-7 flex items-center gap-6 rounded-[24px] bg-[linear-gradient(105deg,#f5fbff,#dcecff)] px-7 py-7">
          <ProfileAvatar
            fullname={user.fullname}
            profileImage={user.profileImage}
          />
          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-semibold text-[#1b2026]">
              {user.fullname}
            </h2>
            <p className="mt-1.5 truncate text-[13px] text-[#7f8790]">
              {user.email}
            </p>
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
              <dd className="text-right font-medium text-[#252a30]">{user.fullname}</dd>
            </div>
            <div className="grid grid-cols-[1fr_1.2fr] gap-5 px-7 py-5 text-[12px]">
              <dt className="text-[#9298a1]">Email</dt>
              <dd className="break-all text-right font-medium text-[#252a30]">
                {user.email}
              </dd>
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
            ? "Kata sandi akunmu sudah berhasil diperbarui."
            : "Gunakan minimal 8 karakter dan jangan gunakan kata sandi lama."
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
          <form
            aria-busy={isPasswordPending}
            className="space-y-4"
            onSubmit={handleSubmit(handlePasswordSubmit)}
          >
            <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-primary-300">
              <KeyRound aria-hidden="true" size={26} strokeWidth={1.8} />
            </span>
            <label className="block text-[12px] text-[#737b85]">
              Kata sandi saat ini
              <input
                autoComplete="current-password"
                className={passwordInputClassName}
                type="password"
                {...register("old_password")}
              />
              {errors.old_password ? (
                <span className="mt-1 block text-[#ff3768]">{errors.old_password.message}</span>
              ) : null}
            </label>
            <label className="block text-[12px] text-[#737b85]">
              Kata sandi baru
              <input
                autoComplete="new-password"
                className={passwordInputClassName}
                type="password"
                {...register("new_password")}
              />
              {errors.new_password ? (
                <span className="mt-1 block text-[#ff3768]">{errors.new_password.message}</span>
              ) : null}
            </label>
            <label className="block text-[12px] text-[#737b85]">
              Konfirmasi kata sandi baru
              <input
                autoComplete="new-password"
                className={passwordInputClassName}
                type="password"
                {...register("confirm_password")}
              />
              {errors.confirm_password ? (
                <span className="mt-1 block text-[#ff3768]">
                  {errors.confirm_password.message}
                </span>
              ) : null}
            </label>
            {passwordMutationError ? (
              <p aria-live="polite" className="text-[12px] leading-5 text-[#ff3768]">
                {passwordMutationError.message}
              </p>
            ) : null}
            <button
              className="h-12 w-full rounded-full bg-primary-300 text-[13px] font-medium text-white transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary-300"
              disabled={!isValid || isPasswordPending}
              type="submit"
            >
              {isPasswordPending ? "Menyimpan..." : "Simpan kata sandi"}
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
          {logoutError ? (
            <p className="mt-5 text-[12px] text-[#ff3768]" role="alert">
              {logoutError.message}
            </p>
          ) : null}
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              className="h-12 rounded-full border border-[#dfe4e8] text-[13px] text-[#707781] transition-colors hover:bg-[#f6f8fa]"
              disabled={isLogoutPending}
              onClick={closeModal}
              type="button"
            >
              Batal
            </button>
            <button
              className="h-12 rounded-full bg-[#ff3768] text-[13px] font-medium text-white transition-colors hover:bg-[#e92a59] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLogoutPending}
              onClick={() => void handleLogout()}
              type="button"
            >
              {isLogoutPending ? "Mengeluarkan..." : "Ya, keluar"}
            </button>
          </div>
        </div>
      </DashboardModal>
    </section>
  );
}
