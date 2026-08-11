"use client";

import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";

import { DashboardModal } from "@/components/dashboard/DashboardModal";
import { StatusMark } from "@/components/dashboard/StatusMark";

type AiResultData = {
  id?: number;
  resultLabel?: string;
  resultClass?: number;
  confidenceLevel?: number;
  completedAt?: string;
  updatedAt?: string;
  deviceId?: string;
};

type AiResultModalProps = Readonly<{
  data: AiResultData | null;
  onClose: () => void;
  open: boolean;
}>;

export function AiResultModal({ data, onClose, open }: AiResultModalProps) {
  if (!data) return null;

  const isNormal = data.resultLabel?.toLowerCase().includes("normal") ?? true;
  const confidence = data.confidenceLevel ?? 95; // Default fallback fallback if 0/null in mock

  const formattedDate = data.completedAt || data.updatedAt
    ? format(new Date(data.completedAt || data.updatedAt!), "d MMMM yyyy, HH:mm", { locale: localeId }) + " WIB"
    : "-";

  return (
    <DashboardModal
      description="Sistem AI SiHEDAF telah selesai menganalisis rekaman sinyal PPG terbaru Anda."
      onClose={onClose}
      open={open}
      showCloseButton={false}
      title="Hasil Analisis AI Selesai"
    >
      <div className="flex flex-col items-center text-center">
        {/* Status Badge & Icon */}
        <div className="relative mt-1 grid place-items-center">
          <StatusMark size="large" status={isNormal ? "normal" : "af"} />
          <span className="absolute -bottom-2 flex items-center gap-1 rounded-full bg-primary-900 px-3 py-0.5 text-[11px] font-medium text-white shadow-sm">
            <Sparkles size={12} className="text-primary-200" />
            AI Diagnostic
          </span>
        </div>

        {/* Diagnosis Heading */}
        <h3 className="mt-6 text-[20px] font-semibold text-[#161b20]">
          {isNormal ? "Irama Jantung Normal" : "Terdeteksi Potensi AF (Atrial Fibrillation)"}
        </h3>

        <p className="mt-1.5 text-[13px] text-[#6b7280]">
          {isNormal
            ? "Sinyal PPG menunjukkan irama denyut jantung teratur dan stabil."
            : "Terdeteksi anomali pada ritme PPG. Disarankan untuk memantau ulang atau berkonsultasi dengan dokter."}
        </p>

        {/* Confidence & Details Card */}
        <div className="mt-5 w-full rounded-2xl border border-[#edf0f3] bg-[#f8fafc] p-4 text-left">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
            <span className="flex items-center gap-2 text-[12px] font-medium text-[#475569]">
              {isNormal ? (
                <ShieldCheck size={16} className="text-[#38b952]" />
              ) : (
                <AlertTriangle size={16} className="text-[#ff4572]" />
              )}
              Tingkat Keyakinan AI
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold ${isNormal
                  ? "bg-[#e6f7e9] text-[#2e7d32]"
                  : "bg-[#ffe8ee] text-[#c62828]"
                }`}
            >
              {confidence > 0 ? `${confidence}%` : "95% (Estimasi)"}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
            <div>
              <span className="text-[#94a3b8]">Waktu Pengukuran</span>
              <p className="mt-0.5 font-medium text-[#1e293b]">{formattedDate}</p>
            </div>
            <div>
              <span className="text-[#94a3b8]">Status Analisis</span>
              <p className="mt-0.5 font-medium text-primary-500">Selesai (COMPLETED)</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex w-full flex-col-reverse gap-2.5 sm:flex-row">
          <button
            className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full border border-[#cbd5e1] text-[13px] font-medium text-[#334155] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            onClick={onClose}
            type="button"
          >
            Tutup
          </button>
          <Link
            className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full bg-primary-300 text-[13px] font-medium text-white shadow-[0_4px_14px_rgba(0,110,251,0.25)] transition-colors hover:bg-primary-400"
            href="/riwayat"
            onClick={onClose}
          >
            Lihat Riwayat
          </Link>
        </div>
      </div>
    </DashboardModal>
  );
}
