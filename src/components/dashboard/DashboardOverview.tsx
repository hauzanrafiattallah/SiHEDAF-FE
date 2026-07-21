"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";

import { useProfile } from "@/features/profile/client/ProfileProvider";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { SignalChart } from "@/components/dashboard/SignalChart";
import { StatusMark } from "@/components/dashboard/StatusMark";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function DashboardOverview() {
  const { user } = useProfile();
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [monitoringRange, setMonitoringRange] = useState("12");
  const [isTogglingAction, setIsTogglingAction] = useState(false);

  const [deviceData, setDeviceData] = useState<any>(null);
  const [latestData, setLatestData] = useState<any>(null);
  const [signalsData, setSignalsData] = useState<number[]>([]);

  useEffect(() => {
    async function fetchDevice() {
      try {
        const res = await fetch("/api/v1/measurement/my-device");
        const json = await res.json();
        if (json.code === 200 && json.data) {
          setDeviceData(json.data);
        }
      } catch (e) {
        console.error("Gagal memuat status perangkat:", e);
      }
    }
    async function fetchLatest() {
      try {
        const res = await fetch("/api/v1/measurement/latest");
        const json = await res.json();
        if (json.code === 200 && json.data) {
          setLatestData(json.data);
          // If there is an IN_PROGRESS measurement, we might set isMonitoringActive(true)
          if (json.data.status === "IN_PROGRESS") {
            setIsMonitoringActive(true);
          }
        }
      } catch (e) {
        console.error("Gagal memuat data terakhir:", e);
      }
    }
    fetchDevice();
    fetchLatest();
  }, []);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch(`/api/v1/measurement/signals?minutes=${monitoringRange}`);
        const json = await res.json();
        if (json.code === 200 && json.data) {
          setSignalsData(json.data.rawPpgData || []);
        }
      } catch (e) {
        console.error("Gagal memuat data sinyal:", e);
      }
    }
    
    // Ambil data pertama kali
    fetchSignals();

    // Jika monitoring aktif, lakukan polling setiap 3 detik
    let intervalId: NodeJS.Timeout;
    if (isMonitoringActive) {
      intervalId = setInterval(fetchSignals, 3000);
    }

    // Bersihkan interval ketika komponen unmount atau dependency berubah
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [monitoringRange, isMonitoringActive]);

  async function handleToggleMonitoring() {
    setIsTogglingAction(true);
    try {
      const endpoint = isMonitoringActive ? "/api/v1/measurement/stop" : "/api/v1/measurement/start";
      const res = await fetch(endpoint, { method: "POST" });
      const json = await res.json();
      if (json.code === 200) {
        setIsMonitoringActive(!isMonitoringActive);
      } else {
        alert(json.message || "Gagal mengubah status monitoring");
      }
    } catch (e) {
      alert("Terjadi kesalahan saat mengubah status monitoring");
    } finally {
      setIsTogglingAction(false);
    }
  }

  const firstName = user?.fullname ? user.fullname.split(" ")[0] : "Pengguna";

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

        <article className="mt-6 flex min-h-[184px] items-center gap-9 rounded-[24px] bg-[linear-gradient(105deg,#f5fbff_0%,#e0eeff_100%)] px-7 py-7 sm:px-11">
          <div className="ml-2 grid h-[110px] w-[110px] shrink-0 place-items-center rounded-full border border-primary-200/60 bg-white/45 sm:ml-4">
            <StatusMark size="large" status={latestData?.resultLabel?.toLowerCase().includes("normal") ? "normal" : (latestData ? "af" : "normal")} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-primary-300">Hasil Analisis Terakhir</p>
            <h2 className="mt-3 text-[18px] font-semibold text-[#161b20]">
              {latestData ? (latestData.resultLabel?.toLowerCase().includes("normal") ? "Normal Rhythm" : "Terdeteksi AF") : "Belum ada data"}
            </h2>
            <p className="mt-1.5 text-[14px] text-[#343b43]">
              {latestData ? (latestData.resultLabel?.toLowerCase().includes("normal") ? "Tidak ditemukan pola AF pada analisis terakhir" : "Pola AF teridentifikasi pada analisis terakhir") : "Silakan mulai monitoring"}
            </p>
            <p className="mt-5 flex items-center gap-2.5 text-[12px] text-[#8e949d]">
              <span className="grid h-4 w-4 place-items-center rounded-full border border-[#a7afb8]">
                <span className="h-1.5 w-px bg-[#929aa4]" />
              </span>
              {latestData?.updatedAt ? `Diperbarui ${formatDistanceToNow(new Date(latestData.updatedAt), { locale: localeId, addSuffix: true })}` : "-"}
            </p>
          </div>
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

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[24px] border border-[#edf0f3] bg-white px-6 py-6">
            <h2 className="text-[16px] font-semibold">Monitoring Terakhir</h2>
            <div className="mt-4 divide-y divide-[#edf0f3]">
              {latestData ? (
                <div className="flex items-center gap-3 py-3">
                  <StatusMark size="small" status={latestData.resultLabel?.toLowerCase().includes("normal") ? "normal" : "af"} />
                  <div>
                    <p className="text-[12px] text-[#9b9fa7]">
                      {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(latestData.createdAt))} WIB
                    </p>
                    <p className={`mt-1 text-[13px] font-medium ${latestData.resultLabel?.toLowerCase().includes("normal") ? "text-[#43b957]" : "text-[#ff4572]"}`}>
                      {latestData.resultLabel?.toLowerCase().includes("normal") ? "Normal Rythm" : "Terdeteksi AF"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="py-6 text-center text-[12px] text-[#9b9fa7]">Belum ada riwayat terbaru.</p>
              )}
            </div>
            <Link
              className="mt-5 flex h-10 items-center justify-center rounded-full border border-primary-300 text-[12px] font-medium text-primary-300 transition-colors hover:bg-primary-50"
              href="/riwayat"
            >
              Lihat semua riwayat
            </Link>
          </article>

          <article className="rounded-[24px] border border-[#edf0f3] bg-white px-6 py-6">
            <h2 className="text-[16px] font-semibold">Status Perangkat</h2>
            <div className="mt-4 flex items-center gap-6">
              <Image
                alt="SiHEDAF Wristband"
                className="h-[152px] w-auto shrink-0 object-contain"
                height={218}
                src="/watch2.png"
                width={63}
              />
              <div className="min-w-0 flex-1">
                <p className={`flex items-center gap-2 text-[12px] ${deviceData?.status === "ONLINE" ? "text-[#4abb59]" : "text-[#9ca2aa]"}`}>
                  <span className={`h-3 w-3 rounded-full ${deviceData?.status === "ONLINE" ? "bg-[#45bb59]" : "bg-[#9ca2aa]"}`} />
                  {deviceData?.status === "ONLINE" ? "Terhubung" : (deviceData ? "Terputus" : "Memuat...")}
                </p>
                <h3 className="mt-2 text-[16px] font-semibold">SiHEDAF Wristband</h3>
                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <dt className="text-[12px] text-[#9ca2aa]">Device ID</dt>
                    <dd className="mt-1 text-[12px] font-semibold">{deviceData?.deviceNumber || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-[#9ca2aa]">Waktu Sinkronisasi</dt>
                    <dd className="mt-1 whitespace-nowrap text-[12px] font-semibold">
                      {deviceData?.lastSeen ? new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }).format(new Date(deviceData.lastSeen)) : "-"}
                    </dd>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <div>
                      <dt className="text-[12px] text-[#9ca2aa]">Baterai</dt>
                      <dd className="mt-1 flex items-center gap-2 text-[12px] font-semibold">
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
  );
}
