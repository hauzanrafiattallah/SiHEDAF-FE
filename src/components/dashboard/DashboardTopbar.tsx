import Link from "next/link";
import { Bell } from "lucide-react";

import { DashboardIcon } from "@/components/dashboard/DashboardIcon";

type DashboardTopbarProps = {
  showNotificationLink: boolean;
  title: string;
};

const notificationButtonClassName =
  "grid h-10 w-10 place-items-center rounded-xl border border-[#d7dce2] text-[#303740] transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-400 focus-visible:outline-2 focus-visible:outline-primary-300";

export function DashboardTopbar({
  showNotificationLink,
  title,
}: DashboardTopbarProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
      <span className="truncate text-[14px] font-medium text-[#1f252c]">{title}</span>

      <div className="flex shrink-0 items-center gap-4">
        {showNotificationLink ? (
          <Link
            aria-label="Buka notifikasi di dashboard"
            className={notificationButtonClassName}
            href="/dashboard"
          >
            <Bell aria-hidden="true" size={19} strokeWidth={1.7} />
          </Link>
        ) : null}
        <button
          className="flex h-10 items-center gap-2.5 rounded-full border border-[#e1e4e8] bg-white px-2.5 pr-4 text-[12px] text-[#1c2229] shadow-[0_2px_8px_rgba(10,32,60,0.03)] transition-shadow hover:shadow-[0_5px_18px_rgba(10,32,60,0.09)]"
          type="button"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[linear-gradient(135deg,#d7ebff,#8eb9e7)] text-[12px] font-semibold text-primary-900">
            AS
          </span>
          <span className="hidden sm:inline">Armand Setya</span>
          <DashboardIcon className="h-3 w-3 text-[#858b94]" name="chevron" />
        </button>
      </div>
    </div>
  );
}
