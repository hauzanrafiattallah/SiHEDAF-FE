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
  return (
    <header
      className="sticky top-0 z-50 py-4 transition-[padding,background-color] duration-300"
      id="top"
    >
      <div className="mx-auto flex h-[72px] w-[calc(100%-32px)] max-w-[1440px] items-center justify-between rounded-[24px] border border-primary-900/[0.06] bg-white/90 px-5 shadow-[0_14px_42px_rgba(0,39,88,0.08)] backdrop-blur-xl sm:w-[calc(100%-64px)] md:px-7">
        <BrandLogo />

        <nav
          aria-label="Navigasi utama"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex"
        >
          {navigation.map((item) => {
            const isActive = item.page === "team" && activePage === "team";

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`rounded-md text-[13px] font-medium transition-colors duration-200 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400 ${
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

        <div className="flex items-center gap-5">
          <Link
            className="hidden rounded-md text-[13px] font-semibold text-primary-400 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400 sm:inline-flex"
            href="/register"
          >
            Daftar
          </Link>
          <Link
            className="inline-flex h-11 min-w-[96px] items-center justify-center rounded-full bg-primary-300 px-5 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(0,110,251,0.22)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-[0_14px_30px_rgba(0,110,251,0.26)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400"
            href="/login"
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}
