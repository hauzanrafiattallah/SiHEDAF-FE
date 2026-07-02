import Link from "next/link";

import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function CtaSection() {
  return (
    <section
      className="bg-[#fbfbfb] px-5 pb-0 pt-12 sm:px-6 lg:px-8"
      id="cta"
    >
      <div className="mx-auto flex min-h-[245px] max-w-[1200px] items-center rounded-t-[30px] bg-primary-300 px-8 py-12 sm:rounded-[30px] sm:px-14 lg:px-16">
        <div>
          <h2 className="max-w-[530px] text-[32px] leading-[1.08] font-medium tracking-[-0.05em] text-white sm:text-[40px]">
            Pantau Kesehatan Kamu dengan
            <span className="block">
              Mudah Bersama{" "}
              <span className="font-serif font-normal italic">SiHEDAF</span>
            </span>
          </h2>
          <Link
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-[11px] font-semibold text-primary-500 shadow-[0_10px_24px_rgba(0,39,88,0.12)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            href="/register"
          >
            Daftar Sekarang
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
