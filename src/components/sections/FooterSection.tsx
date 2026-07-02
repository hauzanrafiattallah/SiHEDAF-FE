import Link from "next/link";

import { BrandLogo } from "@/components/ui/BrandLogo";

const footerNavigation = [
  { label: "Tentang", href: "/#tentang" },
  { label: "Fitur", href: "/#fitur" },
  { label: "Cara Kerja", href: "/#cara-kerja" },
  { label: "Tim Kami", href: "/tim-kami" },
];

export function FooterSection() {
  return (
    <footer className="border-t border-primary-900/[0.055] bg-white">
      <div className="mx-auto flex min-h-[52px] w-[calc(100%-40px)] max-w-[1200px] flex-col items-center justify-between gap-5 py-6 sm:w-[86.5%] sm:flex-row sm:py-0">
        <BrandLogo compact />

        <nav
          aria-label="Navigasi footer"
          className="flex flex-wrap justify-center gap-5"
        >
          {footerNavigation.map((item) => (
            <Link
              className="text-[9px] font-medium text-primary-900/45 hover:text-primary-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="text-center text-[9px] font-medium text-primary-900/40 sm:text-right">
          Copyright © 2026. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
