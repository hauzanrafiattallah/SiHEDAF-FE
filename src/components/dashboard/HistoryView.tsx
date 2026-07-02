import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { StatusMark } from "@/components/dashboard/StatusMark";

const historyRows = [
  { status: "normal", time: "06:45 WIB", tone: "blue" },
  { status: "af", time: "09:42 WIB", tone: "pink" },
  { status: "normal", time: "09:39 WIB", tone: "blue" },
  { status: "af", time: "08:42 WIB", tone: "pink" },
  { status: "af", time: "09:42 WIB", tone: "pink" },
  { status: "normal", time: "09:39 WIB", tone: "blue" },
] as const;

const summaries = [
  { label: "Total jumlah monitoring", value: "20" },
  { label: "Terdeteksi AF", value: "5" },
  { label: "Ritme Normal", value: "15" },
];

export function HistoryView() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-7">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[16px] font-semibold text-[#161b20]">Riwayat Analisis</h1>
            <p className="mt-2 text-[10px] text-[#989da6]">
              Lihat semua riwayat analisis dan hasil monitoring perangkat SiHEDAF kamu
            </p>
          </div>
          <button
            className="flex h-9 items-center gap-3 rounded-full border border-[#e1e5e9] bg-white px-4 text-[9px] text-[#252b31] transition-colors hover:border-primary-200 hover:bg-primary-50/50"
            type="button"
          >
            1 Juni 2026 - 2 Juni 2026
            <DashboardIcon className="h-4 w-4" name="calendar" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {summaries.map((summary) => (
            <article
              className="dashboard-card rounded-2xl border border-[#edf0f3] bg-white px-6 py-5"
              key={summary.label}
            >
              <p className="text-[22px] font-semibold tracking-[-0.04em] text-[#171c21]">
                {summary.value}
              </p>
              <p className="mt-1.5 text-[9px] text-[#9298a1]">{summary.label}</p>
            </article>
          ))}
        </div>

        <article className="mt-5 overflow-hidden rounded-2xl border border-[#edf0f3] bg-white">
          <div className="px-6 py-5">
            <h2 className="text-[13px] font-semibold">Daftar Riwayat</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#edf0f3] text-[9px] font-medium text-[#6e7580]">
                  <th className="w-[38%] px-6 pb-3 font-medium">Waktu Analisis</th>
                  <th className="w-[34%] px-4 pb-3 font-medium">Hasil Klasifikasi ↕</th>
                  <th className="w-[28%] px-6 pb-3 font-medium">Detail Hasil</th>
                </tr>
              </thead>
              <tbody>
                {historyRows.map((row, index) => {
                  const isNormal = row.status === "normal";

                  return (
                    <tr
                      className="stagger-item border-b border-[#f0f2f4] last:border-b-0"
                      key={`${row.time}-${index}`}
                    >
                      <td className="px-6 py-3 text-[9px] text-[#989da5]">
                        2 Juni 2026&nbsp; • &nbsp;{row.time}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <StatusMark size="small" status={row.status} />
                          <div>
                            <p
                              className={`text-[9px] font-medium ${
                                isNormal ? "text-[#43b956]" : "text-[#ff4572]"
                              }`}
                            >
                              {isNormal ? "Normal Rythm" : "Terdeteksi AF"}
                            </p>
                            <p className="mt-1 text-[8px] text-[#a1a6ae]">
                              {isNormal ? "Tidak ditemukan pola AF" : "Pola AF teridentifikasi"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2.5">
                        <Sparkline tone={row.tone} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#edf0f3] px-6 py-4">
            <div className="flex items-center gap-2 text-[9px]">
              <button
                className="h-8 rounded-full border border-[#e1e5e9] px-4 text-[#a0a5ad] transition-colors hover:border-primary-200 hover:text-primary-300"
                type="button"
              >
                ‹&nbsp; Sebelumnya
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  aria-current={page === 1 ? "page" : undefined}
                  className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${
                    page === 1
                      ? "border-primary-300 bg-primary-300 text-white"
                      : "border-[#e1e5e9] text-[#6f7680] hover:border-primary-200"
                  }`}
                  key={page}
                  type="button"
                >
                  {page}
                </button>
              ))}
              <span className="px-1 text-[#9ca2aa]">...</span>
              <button
                className="grid h-8 w-8 place-items-center rounded-full border border-[#e1e5e9] text-[#6f7680]"
                type="button"
              >
                5
              </button>
              <button
                className="h-8 rounded-full border border-[#e1e5e9] px-4 text-[#6f7680] transition-colors hover:border-primary-200 hover:text-primary-300"
                type="button"
              >
                Selanjutnya&nbsp; ›
              </button>
            </div>

            <div className="flex items-center gap-3 text-[8px] text-[#9aa0a9]">
              <span>Tampilkan</span>
              <button
                className="flex h-7 min-w-11 items-center justify-center gap-1 rounded-full border border-[#e2e6ea] px-2 text-[#555c65]"
                type="button"
              >
                6 <DashboardIcon className="h-2.5 w-2.5 rotate-90" name="chevron" />
              </button>
              <span>per halaman</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
