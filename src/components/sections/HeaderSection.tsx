import Link from "next/link";

import { BrandLogo } from "@/components/ui/BrandLogo";

type HeaderSectionProps = {
  activePage?: "home" | "team";
};

const navigation = [
  { label: "Tentang", href: "/#tentang", page: "home" as const },
  { label: "Fitur", href: "/#fitur", page: "home" as const },
  { label: "Cara Kerja", href: "/#cara-kerja", page: "home" as const },
  { label: "Tim Kami", href: "/tim-kami", page: "team" as const },
];

export function HeaderSection({
  activePage = "home",
}: HeaderSectionProps) {
  const isTeamPage = activePage === "team";

  return (
    <header
      className={`relative z-20 ${isTeamPage ? "pt-8" : "pt-4"}`}
      id="top"
    >
      <div className="mx-auto flex h-[50px] w-[calc(100%-32px)] max-w-[1200px] items-center justify-between rounded-[18px] border border-primary-900/[0.055] bg-white/95 px-4 shadow-[0_10px_35px_rgba(0,39,88,0.035)] backdrop-blur sm:w-[86.5%] md:px-5">
        <BrandLogo />

        <nav
          aria-label="Navigasi utama"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex"
        >
          {navigation.map((item) => {
            const isActive = item.page === "team" && activePage === "team";

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`rounded-md text-[10px] font-medium transition-colors hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400 ${
                  isActive ? "text-primary-300" : "text-primary-900/45"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            className="hidden rounded-md text-[10px] font-semibold text-primary-400 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400 sm:inline-flex"
            href="/register"
          >
            Daftar
          </Link>
          <Link
            className="inline-flex h-8 min-w-[72px] items-center justify-center rounded-full bg-primary-300 px-4 text-[10px] font-semibold text-white shadow-[0_8px_20px_rgba(0,110,251,0.18)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400"
            href="/login"
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}
