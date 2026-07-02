"use client";

import { useState } from "react";
import type { DateRange } from "@daypicker/react";

import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { StatusMark } from "@/components/dashboard/StatusMark";

type HistoryStatus = "af" | "normal";

type HistoryRow = {
  date: Date;
  id: number;
  status: HistoryStatus;
  time: string;
  tone: "blue" | "pink";
};

const times = [
  "06:45 WIB",
  "07:18 WIB",
  "08:02 WIB",
  "08:42 WIB",
  "09:12 WIB",
  "09:39 WIB",
  "09:42 WIB",
  "10:15 WIB",
  "11:08 WIB",
  "12:45 WIB",
];

const historyRows: HistoryRow[] = Array.from({ length: 20 }, (_, index) => {
  const status: HistoryStatus = index % 4 === 1 ? "af" : "normal";

  return {
    date: new Date(2026, 5, index < 10 ? 1 : 2),
    id: index + 1,
    status,
    time: times[index % times.length],
    tone: status === "normal" ? "blue" : "pink",
  };
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function isDateInRange(date: Date, range: DateRange) {
  if (!range.from) return true;

  const start = new Date(range.from);
  start.setHours(0, 0, 0, 0);
  const end = new Date(range.to ?? range.from);
  end.setHours(23, 59, 59, 999);

  return date >= start && date <= end;
}

export function HistoryView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2026, 5, 1),
    to: new Date(2026, 5, 2),
  });

  const filteredRows = historyRows.filter((row) => isDateInRange(row.date, dateRange));
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));
  const pageStart = (currentPage - 1) * itemsPerPage;
  const visibleRows = filteredRows.slice(pageStart, pageStart + itemsPerPage);
  const afCount = filteredRows.filter((row) => row.status === "af").length;
  const summaries = [
    { label: "Total jumlah monitoring", value: filteredRows.length },
    { label: "Terdeteksi AF", value: afCount },
    { label: "Ritme Normal", value: filteredRows.length - afCount },
  ];

  function handleRangeChange(range: DateRange) {
    setDateRange(range);
    setCurrentPage(1);
  }

  function handleItemsPerPageChange(value: number) {
    setItemsPerPage(value);
    setCurrentPage(1);
  }

  return (
    <section className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-semibold text-[#161b20]">Riwayat Analisis</h1>
            <p className="mt-2 text-[13px] text-[#989da6]">
              Lihat semua riwayat analisis dan hasil monitoring perangkat SiHEDAF kamu
            </p>
          </div>
          <DateRangePicker onChange={handleRangeChange} value={dateRange} />
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {summaries.map((summary) => (
            <article
              className="rounded-[22px] border border-[#edf0f3] bg-white px-7 py-6"
              key={summary.label}
            >
              <p className="text-[28px] font-semibold tracking-[-0.04em] text-[#171c21]">
                {summary.value}
              </p>
              <p className="mt-2 text-[12px] text-[#9298a1]">{summary.label}</p>
            </article>
          ))}
        </div>

        <article className="mt-6 overflow-hidden rounded-[24px] border border-[#edf0f3] bg-white">
          <div className="px-7 py-6">
            <h2 className="text-[16px] font-semibold">Daftar Riwayat</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#edf0f3] text-[12px] font-medium text-[#6e7580]">
                  <th className="w-[38%] px-6 pb-3 font-medium">Waktu Analisis</th>
                  <th className="w-[34%] px-4 pb-3 font-medium">Hasil Klasifikasi ↕</th>
                  <th className="w-[28%] px-6 pb-3 font-medium">Detail Hasil</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const isNormal = row.status === "normal";

                  return (
                    <tr
                      className="stagger-item border-b border-[#f0f2f4] last:border-b-0"
                      key={row.id}
                    >
                      <td className="px-6 py-4 text-[12px] text-[#989da5]">
                        {dateFormatter.format(row.date)}&nbsp; • &nbsp;{row.time}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <StatusMark size="small" status={row.status} />
                          <div>
                            <p
                              className={`text-[12px] font-medium ${
                                isNormal ? "text-[#43b956]" : "text-[#ff4572]"
                              }`}
                            >
                              {isNormal ? "Normal Rythm" : "Terdeteksi AF"}
                            </p>
                            <p className="mt-1 text-[12px] text-[#a1a6ae]">
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
            {visibleRows.length === 0 ? (
              <p className="px-6 py-12 text-center text-[13px] text-[#9298a1]">
                Tidak ada riwayat pada rentang tanggal ini.
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#edf0f3] px-6 py-4">
            <nav aria-label="Pagination riwayat" className="flex items-center gap-2 text-[12px]">
              <button
                className="h-8 rounded-full border border-[#e1e5e9] px-4 text-[#6f7680] transition-colors hover:border-primary-200 hover:text-primary-300 disabled:cursor-not-allowed disabled:text-[#b3b8bf] disabled:hover:border-[#e1e5e9]"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                type="button"
              >
                ‹&nbsp; Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${
                    page === currentPage
                      ? "border-primary-300 bg-primary-300 text-white"
                      : "border-[#e1e5e9] text-[#6f7680] hover:border-primary-200"
                  }`}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}
              <button
                className="h-8 rounded-full border border-[#e1e5e9] px-4 text-[#6f7680] transition-colors hover:border-primary-200 hover:text-primary-300 disabled:cursor-not-allowed disabled:text-[#b3b8bf] disabled:hover:border-[#e1e5e9]"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                type="button"
              >
                Selanjutnya&nbsp; ›
              </button>
            </nav>

            <label className="flex items-center gap-3 text-[12px] text-[#9aa0a9]">
              <span>Tampilkan</span>
              <select
                aria-label="Jumlah riwayat per halaman"
                className="h-8 rounded-full border border-[#e2e6ea] bg-white px-3 text-[#555c65] outline-none focus:border-primary-300 focus-visible:ring-2 focus-visible:ring-primary-200"
                onChange={(event) => handleItemsPerPageChange(Number(event.target.value))}
                value={itemsPerPage}
              >
                {[5, 10, 20].map((amount) => (
                  <option key={amount} value={amount}>
                    {amount}
                  </option>
                ))}
              </select>
              <span>per halaman</span>
            </label>
          </div>
        </article>
      </div>
    </section>
  );
}
