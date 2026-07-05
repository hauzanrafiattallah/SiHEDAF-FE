"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import {
  publicNavigation,
  type PublicPage,
} from "@/components/sections/PublicNavigation";

type MobileNavigationProps = {
  activePage: PublicPage;
};

export function MobileNavigation({ activePage }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        aria-controls="mobile-navigation-menu"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
        className="grid h-10 w-10 place-items-center rounded-full text-primary-900/60 transition-colors duration-300 hover:bg-primary-50 hover:text-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 md:hidden"
        onClick={() => setIsMenuOpen((open) => !open)}
        type="button"
      >
        {isMenuOpen ? (
          <X aria-hidden="true" size={20} strokeWidth={2} />
        ) : (
          <Menu aria-hidden="true" size={20} strokeWidth={2} />
        )}
      </button>

      <div
          className={`absolute inset-x-0 top-[96px] z-10 transition-[opacity,visibility,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
            isMenuOpen
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
          data-mobile-menu-overlay
        >
          <div
            className="mx-auto w-[calc(100%-32px)] max-w-[1440px] overflow-hidden rounded-[20px] border border-primary-900/[0.06] bg-white shadow-[0_14px_42px_rgba(0,39,88,0.08)] sm:w-[calc(100%-64px)]"
            id="mobile-navigation-menu"
          >
            <nav aria-label="Menu mobile" className="flex flex-col py-3">
              {publicNavigation.map((item) => {
                const isActive =
                  item.page === "team" && activePage === "team";

                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`px-6 py-3.5 text-[14px] font-medium transition-colors duration-200 hover:bg-primary-50 hover:text-primary-500 ${
                      isActive ? "text-primary-300" : "text-primary-900/55"
                    }`}
                    href={item.href}
                    key={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-3 border-t border-primary-900/[0.06] px-6 py-5">
              <Link
                className="flex h-12 items-center justify-center rounded-full border border-primary-300/30 text-[13px] font-semibold text-primary-400 transition-colors duration-300 hover:bg-primary-50"
                href="/register"
                onClick={() => setIsMenuOpen(false)}
              >
                Daftar
              </Link>
              <Link
                className="flex h-12 items-center justify-center rounded-full bg-primary-300 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(0,110,251,0.22)] transition-[background-color] duration-300 hover:bg-primary-400"
                href="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
    </>
  );
}
