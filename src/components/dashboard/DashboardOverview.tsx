import Image from "next/image";
import Link from "next/link";

import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { SignalChart } from "@/components/dashboard/SignalChart";
import { StatusMark } from "@/components/dashboard/StatusMark";

export function DashboardOverview() {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] xl:grid-cols-[minmax(0,1fr)_270px]">
      <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-7">
        <div className="mx-auto max-w-[1050px]">
          <div>
            <h1 className="text-[16px] font-semibold tracking-[-0.035em] text-[#151a20]">
              Selamat Datang, Armand!
            </h1>
            <p className="mt-1 text-[10px] text-[#9298a1]">
              Pantau kondisi dan hasil analisis perangkat SiHEDAF
            </p>
          </div>

          <article className="dashboard-card mt-5 flex min-h-[148px] items-center gap-8 rounded-2xl bg-[linear-gradient(105deg,#f5fbff_0%,#e0eeff_100%)] px-7 py-6 sm:px-10">
            <div className="ml-3 grid h-[94px] w-[94px] shrink-0 place-items-center rounded-full border border-primary-200/60 bg-white/45 sm:ml-5">
              <StatusMark size="large" status="normal" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-primary-300">Hasil Analisis Terakhir</p>
              <h2 className="mt-3 text-[14px] font-semibold text-[#161b20]">Normal Rhythm</h2>
              <p className="mt-1 text-[10px] text-[#343b43]">
                Tidak ditemukan pola AF pada analisis terakhir
              </p>
              <p className="mt-4 flex items-center gap-2 text-[9px] text-[#8e949d]">
                <span className="grid h-4 w-4 place-items-center rounded-full border border-[#a7afb8]">
                  <span className="h-1.5 w-px bg-[#929aa4]" />
                </span>
                Diperbarui 3 menit yang lalu
              </p>
            </div>
          </article>

          <article className="dashboard-card mt-5 rounded-2xl border border-[#edf0f3] bg-white px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-[12px] font-semibold text-[#171c21]">Sinyal PPG Terbaru</h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px]">
                  <span className="flex items-center gap-2 text-[#38b952]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#43bd59]" />
                    Monitoring aktif
                  </span>
                  <span className="text-[#a4a9b1]">Pembaruan otomatis selama 3 menit</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="flex h-8 items-center gap-2 rounded-full border border-[#222831] px-4 text-[9px] text-[#20252b] transition-colors hover:border-primary-300 hover:text-primary-300"
                  type="button"
                >
                  12 menit terakhir
                  <DashboardIcon className="h-3 w-3 rotate-90" name="chevron" />
                </button>
                <button
                  className="flex h-8 items-center gap-2 rounded-full border border-primary-300 px-4 text-[9px] text-primary-300 transition-colors hover:bg-primary-50"
                  type="button"
                >
                  <span className="h-3.5 w-px bg-primary-300" />
                  Hentikan Monitoring
                </button>
              </div>
            </div>
            <SignalChart />
          </article>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <article className="dashboard-card rounded-2xl border border-[#edf0f3] bg-white px-5 py-5">
              <h2 className="text-[12px] font-semibold">Monitoring Terakhir</h2>
              <div className="mt-4 divide-y divide-[#edf0f3]">
                <div className="flex items-center gap-3 pb-3">
                  <StatusMark size="small" status="af" />
                  <div>
                    <p className="text-[9px] text-[#9b9fa7]">2 Juni 2026&nbsp; • &nbsp;12:45 WIB</p>
                    <p className="mt-1 text-[10px] font-medium text-[#ff4572]">Terdeteksi AF</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <StatusMark size="small" status="normal" />
                  <div>
                    <p className="text-[9px] text-[#9b9fa7]">2 Juni 2026&nbsp; • &nbsp;09:45 WIB</p>
                    <p className="mt-1 text-[10px] font-medium text-[#43b957]">Normal Rythm</p>
                  </div>
                </div>
              </div>
              <Link
                className="mt-4 flex h-9 items-center justify-center rounded-full border border-primary-300 text-[9px] font-medium text-primary-300 transition-colors hover:bg-primary-50"
                href="/riwayat"
              >
                Lihat semua riwayat
              </Link>
            </article>

            <article className="dashboard-card rounded-2xl border border-[#edf0f3] bg-white px-5 py-5">
              <h2 className="text-[12px] font-semibold">Status Perangkat</h2>
              <div className="mt-4 flex items-center gap-6">
                <Image
                  alt="SiHEDAF Wristband"
                  className="h-[132px] w-auto shrink-0 object-contain"
                  height={218}
                  src="/watch2.png"
                  width={63}
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[9px] text-[#4abb59]">
                    <span className="h-3 w-3 rounded-full bg-[#45bb59]" />
                    Terhubung
                  </p>
                  <h3 className="mt-2 text-[12px] font-semibold">SiHEDAF Wristband</h3>
                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <dt className="text-[8px] text-[#9ca2aa]">Device ID</dt>
                      <dd className="mt-1 text-[9px] font-semibold">PPG001</dd>
                    </div>
                    <div>
                      <dt className="text-[8px] text-[#9ca2aa]">Waktu Sinkronisasi</dt>
                      <dd className="mt-1 whitespace-nowrap text-[9px] font-semibold">20 Mei 2026, 14:00</dd>
                    </div>
                    <div className="col-span-2 flex items-center justify-between">
                      <div>
                        <dt className="text-[8px] text-[#9ca2aa]">Baterai</dt>
                        <dd className="mt-1 flex items-center gap-2 text-[9px] font-semibold">
                          <DashboardIcon className="h-3.5 w-3.5 text-primary-300" name="battery" />
                          92%
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      <NotificationPanel />
    </div>
  );
}
