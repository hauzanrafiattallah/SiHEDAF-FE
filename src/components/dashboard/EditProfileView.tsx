"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { ProfileAvatar } from "@/components/dashboard/ProfileAvatar";
import { useUpdateProfile } from "@/features/profile/client/hooks/UseUpdateProfile";
import { useProfile } from "@/features/profile/client/ProfileProvider";
import {
  type UpdateProfileRequest,
  UpdateProfileRequestSchema,
} from "@/features/profile/shared/ProfileSchema";
import type { UserProfile } from "@/features/profile/shared/ProfileTypes";

const fieldClassName =
  "mt-2.5 h-14 w-full rounded-full border border-[#dce1e6] bg-white px-5 text-[14px] text-[#2c3239] outline-none transition-[border-color,box-shadow] placeholder:text-[#b1b6be] focus:border-primary-300 focus:shadow-[0_0_0_3px_rgba(0,110,251,0.1)] disabled:cursor-not-allowed disabled:bg-[#f4f6f9] disabled:text-[#9ba2ab]";

function EditProfileForm({ user }: { user: UserProfile }) {
  const router = useRouter();
  const { submit, isPending, error: mutationError } = useUpdateProfile();
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    formState: { errors, isDirty, isValid },
    getValues,
    handleSubmit,
    register,
    setError,
  } = useForm<UpdateProfileRequest>({
    defaultValues: { fullname: user.fullname },
    mode: "onChange",
    resolver: zodResolver(UpdateProfileRequestSchema),
  });

  async function confirmSave() {
    const parsed = UpdateProfileRequestSchema.safeParse(getValues());
    if (!parsed.success) return;

    const result = await submit(parsed.data);
    if (!result) return;

    if (!result.success) {
      for (const [field, messages] of Object.entries(
        result.fieldErrors ?? {},
      )) {
        if (field === "fullname") {
          setError("fullname", { message: messages?.[0], type: "server" });
        }
      }
      toast.error(result.message);
      if (result.status === 401) router.replace("/login");
      setShowConfirm(false);
      return;
    }

    toast.success(result.message);
    setShowConfirm(false);
    router.push("/profil");
  }

  return (
    <>
      <form
        aria-busy={isPending}
        className="mt-6 rounded-[24px] border border-[#e1e5e9] bg-white p-7"
        onSubmit={handleSubmit(() => setShowConfirm(true))}
      >
        <div className="flex items-center gap-4 border-b border-[#edf0f3] pb-5">
          <ProfileAvatar
            fullname={user.fullname}
            profileImage={user.profileImage}
          />
          <div>
            <p className="text-[13px] font-medium text-[#343a42]">Foto profil</p>
            <p className="mt-1 text-[12px] leading-5 text-[#9fa5ad]">
              Perubahan foto belum tersedia pada layanan akun.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block text-[12px] text-[#7f8690]">
            Nama Lengkap
            <input
              className={fieldClassName}
              {...register("fullname")}
            />
            {errors.fullname ? (
              <span className="mt-2 block text-[#ff3768]">
                {errors.fullname.message}
              </span>
            ) : null}
          </label>
          <label className="block text-[12px] text-[#7f8690]">
            Email
            <input
              className={fieldClassName}
              disabled
              name="email"
              type="email"
              value={user.email}
            />
            <span className="mt-2 block text-[12px] text-[#9fa5ad]">
              Email tidak dapat diubah
            </span>
          </label>
          <label className="block text-[12px] text-[#7f8690]">
            ID Perangkat
            <input className={fieldClassName} defaultValue="PPG001" disabled name="deviceId" />
            <span className="mt-2 block text-[12px] text-[#9fa5ad]">
              ID perangkat tidak dapat diubah
            </span>
          </label>
        </div>

        {mutationError ? (
          <p aria-live="polite" className="mt-4 text-[12px] text-[#ff3768]">
            {mutationError.message}
          </p>
        ) : null}

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            className="h-13 rounded-full border border-[#dfe3e7] text-[13px] text-[#737a84] transition-colors hover:bg-[#f6f7f9]"
            disabled={isPending}
            onClick={() => router.push("/profil")}
            type="button"
          >
            Batal
          </button>
          <button
            className="h-13 rounded-full bg-primary-300 text-[13px] font-medium text-white transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isDirty || !isValid || isPending}
            type="submit"
          >
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      <DashboardModal
        description="Nama lengkap baru akan disimpan ke akunmu."
        onClose={() => setShowConfirm(false)}
        open={showConfirm}
        title="Simpan perubahan profil?"
      >
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-50 text-primary-300">
            <Save aria-hidden="true" size={30} strokeWidth={1.8} />
          </span>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              className="h-12 rounded-full border border-[#dfe4e8] text-[13px] text-[#707781] transition-colors hover:bg-[#f6f8fa]"
              disabled={isPending}
              onClick={() => setShowConfirm(false)}
              type="button"
            >
              Batal
            </button>
            <button
              className="h-12 rounded-full bg-primary-300 text-[13px] font-medium text-white transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              onClick={() => void confirmSave()}
              type="button"
            >
              {isPending ? "Menyimpan..." : "Ya, simpan"}
            </button>
          </div>
        </div>
      </DashboardModal>

    </>
  );
}

export function EditProfileView() {
  const { user, isLoading, error, reload } = useProfile();

  return (
    <section className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="max-w-[720px]">
        <p className="text-[12px] text-[#9aa0a8]">Profil / Ubah Profil</p>
        <h1 className="mt-3 text-[22px] font-semibold">Ubah Profil</h1>
        {isLoading ? (
          <div
            aria-busy="true"
            className="mt-6 h-96 animate-pulse rounded-[24px] bg-white"
          />
        ) : error || !user ? (
          <div className="mt-6 rounded-[24px] border border-[#ffd2dc] bg-white p-7">
            <p className="text-[13px] text-[#d72d55]">
              {error ?? "Data profil tidak tersedia."}
            </p>
            <button
              className="mt-5 h-11 rounded-full bg-primary-300 px-6 text-[13px] font-medium text-white hover:bg-primary-400"
              onClick={() => void reload()}
              type="button"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <EditProfileForm key={`${user.id}-${user.fullname}`} user={user} />
        )}
      </div>
    </section>
  );
}
