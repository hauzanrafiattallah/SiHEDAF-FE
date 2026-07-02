import { DashboardIcon } from "@/components/dashboard/DashboardIcon";

type DashboardTopbarProps = {
  title: string;
};

export function DashboardTopbar({ title }: DashboardTopbarProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2.5 text-[12px] font-medium text-[#1f252c]">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-[#cbd0d6]">
          <span className="h-3 w-px bg-[#505860]" />
        </span>
        <span className="truncate">{title}</span>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <button
          aria-label="Buka notifikasi"
          className="grid h-9 w-9 place-items-center rounded-full text-[#303740] transition-colors hover:bg-primary-50 hover:text-primary-400 focus-visible:outline-2 focus-visible:outline-primary-300"
          type="button"
        >
          <DashboardIcon className="h-[18px] w-[18px]" name="bell" />
        </button>
        <button
          className="flex h-9 items-center gap-2 rounded-full border border-[#e1e4e8] bg-white px-2.5 pr-3 text-[10px] text-[#1c2229] shadow-[0_2px_8px_rgba(10,32,60,0.03)] transition-shadow hover:shadow-[0_5px_18px_rgba(10,32,60,0.09)]"
          type="button"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,#d7ebff,#8eb9e7)] text-[8px] font-semibold text-primary-900">
            AS
          </span>
          <span className="hidden sm:inline">Armand Setya</span>
          <DashboardIcon className="h-3 w-3 text-[#858b94]" name="chevron" />
        </button>
      </div>
    </div>
  );
}
