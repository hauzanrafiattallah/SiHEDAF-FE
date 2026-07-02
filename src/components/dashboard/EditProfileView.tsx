"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Save } from "lucide-react";

import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { ProfileAvatar } from "@/components/dashboard/ProfileView";
import {
  defaultProfileSnapshot,
  getProfileSnapshot,
  parseProfileSnapshot,
  saveProfile,
  subscribeProfile,
  type ProfileData,
} from "@/components/dashboard/ProfileStorage";

const fieldClassName =
  "mt-2.5 h-14 w-full rounded-full border border-[#dce1e6] bg-white px-5 text-[14px] text-[#2c3239] outline-none transition-[border-color,box-shadow] placeholder:text-[#b1b6be] focus:border-primary-300 focus:shadow-[0_0_0_3px_rgba(0,110,251,0.1)] disabled:cursor-not-allowed disabled:bg-[#f4f6f9] disabled:text-[#9ba2ab]";

function EditProfileForm({ initialProfile }: { initialProfile: ProfileData }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [email, setEmail] = useState(initialProfile.email);
  const [avatarPreview, setAvatarPreview] = useState(initialProfile.avatarDataUrl);
  const [formError, setFormError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("File yang dipilih harus berupa gambar.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError("Ukuran foto maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(String(reader.result));
      setFormError("");
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      setFormError("Nama lengkap dan email wajib diisi.");
      return;
    }

    setFormError("");
    setShowConfirm(true);
  }

  function confirmSave() {
    saveProfile({
      avatarDataUrl: avatarPreview,
      email: email.trim(),
      fullName: fullName.trim(),
    });
    setShowConfirm(false);
    setIsSaved(true);
  }

  return (
    <>
      <form
        className="mt-6 rounded-[24px] border border-[#e1e5e9] bg-white p-7"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-4 border-b border-[#edf0f3] pb-5">
          <button
            aria-label="Pilih foto profil"
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
            onClick={openFilePicker}
            type="button"
          >
            <ProfileAvatar avatarDataUrl={avatarPreview} />
          </button>
          <input
            accept="image/*"
            className="sr-only"
            onChange={handleAvatarChange}
            ref={fileInputRef}
            type="file"
          />
          <button
            className="h-10 rounded-full border border-primary-300 px-5 text-[12px] font-medium text-primary-300 transition-colors hover:bg-primary-50"
            onClick={openFilePicker}
            type="button"
          >
            Ganti Foto
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block text-[12px] text-[#7f8690]">
            Nama Lengkap
            <input
              className={fieldClassName}
              name="fullName"
              onChange={(event) => setFullName(event.target.value)}
              value={fullName}
            />
          </label>
          <label className="block text-[12px] text-[#7f8690]">
            Email
            <input
              className={fieldClassName}
              inputMode="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
          </label>
          <label className="block text-[12px] text-[#7f8690]">
            ID Perangkat
            <input className={fieldClassName} defaultValue="PPG001" disabled name="deviceId" />
            <span className="mt-2 block text-[12px] text-[#9fa5ad]">
              ID perangkat tidak dapat diubah
            </span>
          </label>
        </div>

        {formError ? (
          <p aria-live="polite" className="mt-4 text-[12px] text-[#ff3768]">
            {formError}
          </p>
        ) : null}

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            className="h-13 rounded-full border border-[#dfe3e7] text-[13px] text-[#737a84] transition-colors hover:bg-[#f6f7f9]"
            onClick={() => router.push("/profil")}
            type="button"
          >
            Batal
          </button>
          <button
            className="h-13 rounded-full bg-primary-300 text-[13px] font-medium text-white transition-colors hover:bg-primary-400"
            type="submit"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>

      <DashboardModal
        description="Perubahan pada nama, email, dan foto profil akan disimpan."
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
              onClick={() => setShowConfirm(false)}
              type="button"
            >
              Batal
            </button>
            <button
              className="h-12 rounded-full bg-primary-300 text-[13px] font-medium text-white transition-colors hover:bg-primary-400"
              onClick={confirmSave}
              type="button"
            >
              Ya, simpan
            </button>
          </div>
        </div>
      </DashboardModal>

      <DashboardModal
        description="Nama, email, dan foto profil sudah tersimpan pada simulasi frontend."
        onClose={() => setIsSaved(false)}
        open={isSaved}
        title="Profil berhasil diperbarui"
      >
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e8f8ec] text-[#43b956]">
            <CheckCircle2 aria-hidden="true" size={32} strokeWidth={1.8} />
          </span>
          <button
            className="mt-7 h-12 w-full rounded-full bg-primary-300 text-[13px] font-medium text-white transition-colors hover:bg-primary-400"
            onClick={() => router.push("/profil")}
            type="button"
          >
            Kembali ke profil
          </button>
        </div>
      </DashboardModal>
    </>
  );
}

export function EditProfileView() {
  const profileSnapshot = useSyncExternalStore(
    subscribeProfile,
    getProfileSnapshot,
    () => defaultProfileSnapshot,
  );

  return (
    <section className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="max-w-[720px]">
        <p className="text-[12px] text-[#9aa0a8]">Profil / Ubah Profil</p>
        <h1 className="mt-3 text-[22px] font-semibold">Ubah Profil</h1>
        <EditProfileForm
          initialProfile={parseProfileSnapshot(profileSnapshot)}
          key={profileSnapshot}
        />
      </div>
    </section>
  );
}
