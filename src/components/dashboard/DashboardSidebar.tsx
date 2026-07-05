import Image from "next/image";
import Link from "next/link";

import { DashboardIcon, type DashboardIconName } from "@/components/dashboard/DashboardIcon";

type DashboardSidebarProps = {
  collapsed: boolean;
  onNavigate: () => void;
  pathname: string;
};

const navigation: Array<{
  href: string;
  icon: DashboardIconName;
  label: string;
}> = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/riwayat", icon: "history", label: "Riwayat Analisis" },
  { href: "/profil", icon: "profile", label: "Profil" },
];

export function DashboardSidebar({
  collapsed,
  onNavigate,
  pathname,
}: DashboardSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      <Link
        aria-label="SiHEDAF"
        className={`flex h-[72px] shrink-0 items-center overflow-hidden border-b border-[#edf0f3] ${
          collapsed ? "justify-center px-3" : "px-7"
        }`}
        href="/dashboard"
      >
        <Image alt="Logo SiHEDAF" height={27} priority src="/logo.png" width={27} />
        <span
          className={`ml-3 whitespace-nowrap text-[17px] font-semibold tracking-[-0.04em] text-primary-900 transition-[opacity,max-width,margin] duration-300 ${
            collapsed ? "ml-0 max-w-0 opacity-0" : "max-w-28 opacity-100"
          }`}
        >
          SiHEDAF
        </span>
      </Link>

      <nav aria-label="Navigasi dashboard" className="space-y-2 px-3 py-7">
        {navigation.map((item) => {
          const isActive =
            item.href === "/profil"
              ? pathname.startsWith("/profil")
              : pathname === item.href;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex h-12 items-center rounded-xl text-[13px] transition-colors duration-200 ${
                collapsed ? "justify-center px-2" : "gap-3 px-4"
              } ${
                isActive
                  ? "bg-primary-50 text-primary-300"
                  : "text-[#222831] hover:bg-[#f5f7fa] hover:text-primary-500"
              }`}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
            >
              {isActive ? (
                <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-primary-300" />
              ) : null}
              <DashboardIcon className="h-5 w-5 shrink-0" name={item.icon} />
              <span
                className={`overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300 ${
                  collapsed ? "max-w-0 opacity-0" : "max-w-36 opacity-100"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 pb-5">
        <p
          className={`overflow-hidden whitespace-nowrap text-[12px] text-[#b1b6bf] transition-opacity duration-200 ${
            collapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          © 2026 SiHEDAF
        </p>
      </div>
    </div>
  );
}
