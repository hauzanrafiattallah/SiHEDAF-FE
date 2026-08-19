"use client";

import Image from "next/image";
import Link from "next/link";
import { Pause, Play, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { SignalChart } from "@/components/dashboard/SignalChart";
import { StatusMark } from "@/components/dashboard/StatusMark";
import { AiResultModal } from "@/components/dashboard/AiResultModal";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { useDashboardOverview } from "@/components/dashboard/hooks/UseDashboardOverview";

export function DashboardOverview() {
  const {
    firstName,
    deviceData,
    latestData,
    signalsData,
    confidenceVal,
    isMonitoringActive,
    monitoringRange,
    setMonitoringRange,
    isTogglingAction,
    handleToggleMonitoring,
    isAiModalOpen,
    setIsAiModalOpen,
  } = useDashboardOverview();

  return (
    <section className="min-h-[calc(100dvh-72px)] min-w-0 px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="mx-auto max-w-[1280px]">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.035em] text-[#151a20]">
            Selamat Datang, {firstName}!
          </h1>
          <p className="mt-2 text-[13px] text-[#9298a1]">
            Pantau kondisi dan hasil analisis perangkat SiHEDAF
          </p>
        </div>

        <article className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-[24px] bg-[linear-gradient(105deg,#f5fbff_0%,#e0eeff_100%)] p-7 sm:px-10 sm:py-8">
          <div className="flex flex-wrap items-center gap-7 sm:gap-9">
            <div className="ml-1 grid h-[100px] w-[100px] shrink-0 place-items-center rounded-full border border-primary-200/60 bg-white/45 sm:ml-2 sm:h-[110px] sm:w-[110px]">
              <StatusMark size="large" status={latestData?.resultLabel?.toLowerCase().includes("normal") ? "normal" : (latestData ? "af" : "normal")} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="text-[13px] font-medium text-primary-300">Hasil Analisis Terakhir</p>
                {latestData ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-primary-800 shadow-2xs">
                    <Sparkles size={12} className="text-primary-400" />
                    Keyakinan AI: {confidenceVal > 0 ? `${confidenceVal}%` : "95%"}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-2.5 text-[18px] font-semibold text-[#161b20]">
                {latestData ? (latestData.resultLabel?.toLowerCase().includes("normal") ? "Normal Rhythm" : "Terdeteksi AF") : "Belum ada data"}
              </h2>
              <p className="mt-1 text-[14px] text-[#343b43]">
                {latestData ? (latestData.resultLabel?.toLowerCase().includes("normal") ? "Tidak ditemukan pola AF pada analisis terakhir" : "Pola AF teridentifikasi pada analisis terakhir") : "Silakan mulai monitoring"}
              </p>
              <p className="mt-4 flex items-center gap-2.5 text-[12px] text-[#8e949d]">
                <span className="grid h-4 w-4 place-items-center rounded-full border border-[#a7afb8]">
                  <span className="h-1.5 w-px bg-[#929aa4]" />
                </span>
                {latestData?.updatedAt ? `Diperbarui ${formatDistanceToNow(new Date(latestData.updatedAt), { locale: localeId, addSuffix: true })}` : "-"}
              </p>
            </div>
          </div>

          {latestData ? (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-primary-300/40 bg-white px-4 py-2 text-[12px] font-semibold text-primary-500 transition-colors hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-primary-300"
              onClick={() => setIsAiModalOpen(true)}
              type="button"
            >
              <Sparkles size={14} className="text-primary-300" />
              Detail Diagnosa AI
            </button>
          ) : null}
        </article>

        <article className="mt-6 rounded-[24px] border border-[#edf0f3] bg-white px-6 py-6 sm:px-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[16px] font-semibold text-[#171c21]">Sinyal PPG Terbaru</h2>
              <div
                aria-live="polite"
                className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]"
              >
                <span
                  className={`flex items-center gap-2 ${isMonitoringActive ? "text-[#38b952]" : "text-[#9298a1]"
                    }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${isMonitoringActive ? "bg-[#43bd59]" : "bg-[#b6bbc3]"
                      }`}
                  />
                  {isMonitoringActive ? "Monitoring aktif" : "Monitoring dijeda"}
                </span>
                <span className="text-[#a4a9b1]">
                  {isMonitoringActive
                    ? `Pembaruan otomatis selama ${monitoringRange} menit`
                    : "Pembaruan dihentikan sementara"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative block">
                <span className="sr-only">Rentang waktu monitoring</span>
                <select
                  className="h-10 appearance-none rounded-full border border-[#222831] bg-white pl-5 pr-10 text-[12px] text-[#20252b] outline-none transition-colors hover:border-primary-300 focus:border-primary-300 focus-visible:ring-2 focus-visible:ring-primary-200"
                  onChange={(event) => setMonitoringRange(event.target.value)}
                  value={monitoringRange}
                >
                  {[3, 6, 12, 30].map((minute) => (
                    <option key={minute} value={minute}>
                      {minute} menit terakhir
                    </option>
                  ))}
                </select>
                <DashboardIcon
                  className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 rotate-90 text-[#20252b]"
                  name="chevron"
                />
              </label>
              <button
                aria-pressed={isMonitoringActive}
                disabled={isTogglingAction || !deviceData || deviceData?.status !== "ONLINE"}
                className={`flex h-10 items-center gap-2 rounded-full border px-5 text-[12px] font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${isMonitoringActive
                  ? "border-primary-300 bg-white text-primary-300 hover:bg-primary-50"
                  : "border-primary-300 bg-primary-300 text-white shadow-[0_8px_20px_rgba(0,110,251,0.2)] hover:bg-primary-400"
                  }`}
                onClick={handleToggleMonitoring}
                type="button"
              >
                {isTogglingAction ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : isMonitoringActive ? (
                  <Pause aria-hidden="true" size={16} strokeWidth={2} />
                ) : (
                  <Play aria-hidden="true" fill="currentColor" size={16} strokeWidth={2} />
                )}
                {isMonitoringActive ? "Hentikan Monitoring" : "Mulai Monitoring"}
              </button>
            </div>
          </div>
          <SignalChart isActive={isMonitoringActive} data={signalsData} />
        </article>

        <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-2">
          <article className="flex h-full flex-col justify-between rounded-[24px] border border-[#edf0f3] bg-white p-6">
            <div>
              <div className="flex items-start justify-between">
                <h2 className="text-[16px] font-semibold text-[#171c21]">Monitoring Terakhir</h2>
                {latestData && (
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-[#9ca2aa]">Keyakinan AI</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[12px] font-semibold text-primary-500">
                      <Sparkles size={12} className="text-primary-400" />
                      {confidenceVal > 0
                        ? confidenceVal <= 1
                          ? `${(confidenceVal * 100).toFixed(1)}%`
                          : `${confidenceVal}%`
                        : "95%"}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                {latestData ? (
                  <div>
                    <p
                      className={`flex items-center gap-2 text-[12px] ${latestData.resultLabel?.toLowerCase().includes("normal")
                          ? "text-[#4abb59]"
                          : "text-[#ff4572]"
                        }`}
                    >
                      <StatusMark
                        size="small"
                        status={
                          latestData.resultLabel?.toLowerCase().includes("normal")
                            ? "normal"
                            : "af"
                        }
                      />
                      <span className="font-medium">
                        {latestData.resultLabel?.toLowerCase().includes("normal")
                          ? "Normal Rhythm"
                          : "Terdeteksi Potensi AF"}
                      </span>
                    </p>

                    <h3 className="mt-2 text-[16px] font-semibold text-[#171c21]">
                      {latestData.resultLabel?.toLowerCase().includes("normal")
                        ? "Irama Jantung Normal & Stabil"
                        : "Indikasi Anomali Irama Jantung"}
                    </h3>

                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <dt className="text-[12px] text-[#9ca2aa]">Waktu Pengukuran</dt>
                        <dd className="mt-1 whitespace-nowrap text-[12px] font-semibold text-[#171c21]">
                          {latestData.createdAt
                            ? `${new Intl.DateTimeFormat("id-ID", {
                              timeZone: "Asia/Jakarta",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(latestData.createdAt))} WIB`
                            : "-"}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-[12px] text-[#9ca2aa]">Grafik Sinyal</dt>
                        <dd className="mt-1 flex items-center">
                          <Sparkline
                            tone={
                            latestData.resultLabel?.toLowerCase().includes("normal")
                              ? "blue"
                              : "pink"
                          }
                          data={latestData.ppgResult?.rawPpgData}
                        />
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <p className="py-8 text-center text-[12px] text-[#9b9fa7]">
                  Belum ada riwayat terbaru.
                </p>
              )}
            </div>
          </div>

          <Link
            className="mt-6 flex h-10 w-full items-center justify-center rounded-full border border-primary-300 text-[12px] font-medium text-primary-300 transition-colors hover:bg-primary-50"
            href="/riwayat"
          >
            Lihat semua riwayat
          </Link>
        </article>

        <article className="flex h-full flex-col rounded-[24px] border border-[#edf0f3] bg-white p-6">
          <h2 className="text-[16px] font-semibold text-[#171c21]">Status Perangkat</h2>
          <div className="mt-4 flex flex-1 flex-col justify-center">
            <div className="flex items-stretch gap-6">
              <Image
                alt="SiHEDAF Wristband"
                className="h-[160px] w-auto shrink-0 object-contain sm:h-[170px]"
                height={218}
                src="/watch2.png"
                width={63}
              />
              <div className="flex flex-1 flex-col justify-between min-w-0 pt-1 pb-6">
                <div>
                  <p
                    className={`flex items-center gap-2 text-[12px] ${
                      deviceData?.status === "ONLINE" ? "text-[#4abb59]" : "text-[#9ca2aa]"
                    }`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${
                        deviceData?.status === "ONLINE" ? "bg-[#45bb59]" : "bg-[#9ca2aa]"
                      }`}
                    />
                    {deviceData?.status === "ONLINE"
                      ? "Terhubung"
                      : deviceData
                      ? "Terputus"
                      : "Memuat..."}
                  </p>
                  <h3 className="mt-1 text-[16px] font-semibold text-[#171c21]">SiHEDAF Wristband</h3>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                  <div className="col-span-1">
                    <dt className="text-[12px] text-[#9ca2aa]">Device ID</dt>
                    <dd className="mt-1 truncate text-[12px] font-semibold text-[#171c21]">
                      {deviceData?.deviceNumber || "-"}
                    </dd>
                  </div>
                  <div className="col-span-1">
                    <dt className="text-[12px] text-[#9ca2aa]">Baterai</dt>
                    <dd className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-[#171c21]">
                      <DashboardIcon className="h-3.5 w-3.5 text-primary-300" name="battery" />
                      92%
                    </dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-[12px] text-[#9ca2aa]">Waktu Sinkronisasi</dt>
                    <dd className="mt-1 whitespace-nowrap text-[12px] font-semibold text-[#171c21]">
                      {deviceData?.lastSeen
                        ? new Intl.DateTimeFormat("id-ID", {
                            timeZone: "Asia/Jakarta",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(deviceData.lastSeen))
                        : "-"}
                    </dd>
                  </div>
                </dl>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <AiResultModal
        data={latestData}
        onClose={() => setIsAiModalOpen(false)}
        open={isAiModalOpen}
      />
    </section>
  );
}


