"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, PanelRightOpen } from "lucide-react";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";

type DashboardShellProps = Readonly<{
  children: React.ReactNode;
}>;

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profil": "Profil",
  "/profil/ubah": "Profil",
  "/riwayat": "Riwayat",
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(true);
  const isDashboardRoute = pathname === "/dashboard";

  return (
    <div className="min-h-dvh bg-[#f7f7f8] text-[#171b20]">
      <div className="flex min-h-dvh">
        <button
          aria-label="Tutup menu navigasi"
          className={`fixed inset-0 z-30 bg-primary-900/30 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
            isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsMobileOpen(false)}
          tabIndex={isMobileOpen ? 0 : -1}
          type="button"
        />

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[240px] shrink-0 border-r border-[#e4e7eb] bg-white shadow-[8px_0_28px_rgba(22,45,75,0.08)] transition-[width,transform] duration-300 ease-out lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 lg:shadow-none ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } ${isCollapsed ? "lg:w-[80px]" : "lg:w-[240px]"}`}
        >
          <DashboardSidebar
            collapsed={isCollapsed && !isMobileOpen}
            onNavigate={() => setIsMobileOpen(false)}
            pathname={pathname}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center gap-3.5 border-b border-[#e5e8eb] bg-white/95 px-4 backdrop-blur-xl sm:px-7">
            <button
              aria-expanded={isMobileOpen}
              aria-label={isMobileOpen ? "Sembunyikan sidebar" : "Tampilkan sidebar"}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e0e4e8] bg-white text-[#303740] transition-[color,background-color,transform] duration-200 hover:bg-primary-50 hover:text-primary-400 active:scale-95 focus-visible:outline-2 focus-visible:outline-primary-300 lg:hidden"
              onClick={() => setIsMobileOpen((current) => !current)}
              type="button"
            >
              {isMobileOpen ? (
                <PanelLeftClose aria-hidden="true" size={19} strokeWidth={1.7} />
              ) : (
                <PanelLeftOpen aria-hidden="true" size={19} strokeWidth={1.7} />
              )}
            </button>
            <button
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar"}
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e0e4e8] bg-white text-[#303740] transition-[color,background-color,transform] duration-200 hover:bg-primary-50 hover:text-primary-400 active:scale-95 focus-visible:outline-2 focus-visible:outline-primary-300 lg:grid"
              onClick={() => setIsCollapsed((current) => !current)}
              type="button"
            >
              {isCollapsed ? (
                <PanelLeftOpen aria-hidden="true" size={19} strokeWidth={1.7} />
              ) : (
                <PanelLeftClose aria-hidden="true" size={19} strokeWidth={1.7} />
              )}
            </button>
            <DashboardTopbar
              showNotificationLink={!isDashboardRoute}
              title={routeTitles[pathname] ?? "Dashboard"}
            />
          </header>

          <div className="relative flex min-w-0 flex-1 flex-col xl:flex-row">
            {isDashboardRoute && !isNotificationsOpen ? (
              <button
                aria-label="Tampilkan notifikasi"
                className="fixed right-5 top-[100px] z-30 grid h-10 w-10 place-items-center rounded-xl border border-[#d7dce2] bg-white text-[#303740] transition-[color,border-color,background-color,transform] duration-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-400 active:scale-95 focus-visible:outline-2 focus-visible:outline-primary-300 sm:right-7"
                onClick={() => setIsNotificationsOpen(true)}
                title="Tampilkan notifikasi"
                type="button"
              >
                <PanelRightOpen aria-hidden="true" size={19} strokeWidth={1.7} />
              </button>
            ) : null}

            <main className="min-w-0 flex-1" key={pathname}>
              <div className="dashboard-enter min-h-full">{children}</div>
            </main>

            {isDashboardRoute ? (
              <div
                aria-hidden={!isNotificationsOpen}
                className={`self-stretch bg-white shrink-0 overflow-hidden transition-[width,opacity,max-height] duration-300 ease-out ${
                  isNotificationsOpen
                    ? "max-h-[1200px] w-full opacity-100 xl:max-h-none xl:w-[320px]"
                    : "pointer-events-none max-h-0 w-full opacity-0 xl:max-h-none xl:w-0"
                }`}
                inert={!isNotificationsOpen}
              >
                <NotificationPanel onClose={() => setIsNotificationsOpen(false)} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
