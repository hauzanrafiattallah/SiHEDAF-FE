import { ProfileAvatar } from "@/components/dashboard/ProfileView";

const fieldClassName =
  "mt-2 h-11 w-full rounded-full border border-[#dce1e6] bg-white px-4 text-[10px] text-[#2c3239] outline-none transition-[border-color,box-shadow] placeholder:text-[#b1b6be] focus:border-primary-300 focus:shadow-[0_0_0_3px_rgba(0,110,251,0.1)] disabled:cursor-not-allowed disabled:bg-[#f4f6f9] disabled:text-[#9ba2ab]";

export function EditProfileView() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-7">
      <div className="max-w-[620px]">
        <p className="text-[9px] text-[#9aa0a8]">Profil / Ubah Profil</p>
        <h1 className="mt-3 text-[16px] font-semibold">Ubah Profil</h1>

        <form className="dashboard-card mt-5 rounded-2xl border border-[#e1e5e9] bg-white p-6">
          <div className="flex items-center gap-4 border-b border-[#edf0f3] pb-5">
            <ProfileAvatar editable />
            <button
              className="h-8 rounded-full border border-primary-300 px-4 text-[9px] font-medium text-primary-300 transition-colors hover:bg-primary-50"
              type="button"
            >
              Ganti Foto
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block text-[9px] text-[#7f8690]">
              Nama Lengkap
              <input className={fieldClassName} defaultValue="Armand Setya Nugraha" name="fullName" />
            </label>
            <label className="block text-[9px] text-[#7f8690]">
              Email
              <input
                className={fieldClassName}
                defaultValue="armand@email.com"
                inputMode="email"
                name="email"
                type="email"
              />
            </label>
            <label className="block text-[9px] text-[#7f8690]">
              ID Perangkat
              <input className={fieldClassName} defaultValue="PPG001" disabled name="deviceId" />
              <span className="mt-2 block text-[8px] text-[#9fa5ad]">
                ID perangkat tidak dapat diubah
              </span>
            </label>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              className="h-11 rounded-full border border-[#dfe3e7] text-[10px] text-[#737a84] transition-colors hover:bg-[#f6f7f9]"
              type="button"
            >
              Batal
            </button>
            <button
              className="h-11 rounded-full bg-primary-300 text-[10px] font-medium text-white shadow-[0_8px_22px_rgba(0,110,251,0.17)] transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-[0_11px_26px_rgba(0,110,251,0.22)]"
              type="button"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
