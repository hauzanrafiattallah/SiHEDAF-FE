import Link from "next/link";

import { DashboardIcon } from "@/components/dashboard/DashboardIcon";

function ProfileAvatar({ editable = false }: { editable?: boolean }) {
  return (
    <span className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full border-4 border-white/80 bg-[radial-gradient(circle_at_32%_28%,#d9efff_0_16%,transparent_17%),linear-gradient(145deg,#8ab8dd,#315a85)] text-[17px] font-semibold text-white shadow-sm">
      AS
      {editable ? null : (
        <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-primary-300 text-white">
          <DashboardIcon className="h-2.5 w-2.5" name="edit" />
        </span>
      )}
    </span>
  );
}

export function ProfileView() {
  return (
    <section className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="max-w-[720px]">
        <h1 className="text-[22px] font-semibold">Profil Akun</h1>
        <p className="mt-2 text-[13px] text-[#969ca5]">Kelola profil kamu di sini</p>

        <article className="dashboard-card mt-7 flex items-center gap-6 rounded-[24px] bg-[linear-gradient(105deg,#f5fbff,#dcecff)] px-7 py-7">
          <ProfileAvatar />
          <div>
            <h2 className="text-[18px] font-semibold text-[#1b2026]">Armand Setya Nugraha</h2>
            <p className="mt-1.5 text-[13px] text-[#7f8790]">armand@sihedaf.f</p>
          </div>
        </article>

        <article className="dashboard-card mt-6 overflow-hidden rounded-[24px] border border-[#e3e7eb] bg-white">
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
              <dd className="text-right font-medium text-[#252a30]">Armand Setya Nugraha</dd>
            </div>
            <div className="grid grid-cols-[1fr_1.2fr] gap-5 px-7 py-5 text-[12px]">
              <dt className="text-[#9298a1]">Email</dt>
              <dd className="text-right font-medium text-[#252a30]">armand@email.com</dd>
            </div>
            <div className="grid grid-cols-[1fr_1.2fr] gap-5 px-7 py-5 text-[12px]">
              <dt className="text-[#9298a1]">Perangkat Terdaftar</dt>
              <dd className="text-right font-medium text-[#252a30]">PPG001</dd>
            </div>
          </dl>
        </article>

        <div className="mt-5 space-y-3">
          <button
            className="group flex h-14 w-full items-center rounded-full border border-[#e3e7eb] bg-white px-6 text-[13px] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-primary-200"
            type="button"
          >
            <DashboardIcon className="mr-3 h-4 w-4 text-primary-300" name="key" />
            Ubah kata sandi
            <DashboardIcon className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" name="chevron" />
          </button>
          <button
            className="group flex h-14 w-full items-center rounded-full border border-[#e3e7eb] bg-white px-6 text-[13px] text-[#ff3768] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[#ffb2c4]"
            type="button"
          >
            <DashboardIcon className="mr-3 h-4 w-4" name="logout" />
            Keluar akun
            <DashboardIcon className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" name="chevron" />
          </button>
        </div>
      </div>
    </section>
  );
}

export { ProfileAvatar };
