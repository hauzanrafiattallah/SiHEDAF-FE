import Link from "next/link";

import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function CtaSection() {
  return (
    <section
      className="section-reveal bg-[#fbfbfb] px-5 pb-24 pt-16 sm:px-8 lg:px-10 lg:pb-28"
      id="cta"
    >
      <div className="mx-auto flex min-h-[320px] max-w-[1440px] items-center rounded-[36px] bg-primary-300 px-8 py-14 shadow-[0_24px_60px_rgba(0,84,190,0.14)] sm:px-14 lg:px-20">
        <div>
          <h2 className="max-w-[720px] text-[clamp(2.25rem,3.25vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.05em] text-white">
            Pantau Kesehatan Kamu dengan
            <span className="block">
              Mudah Bersama{" "}
              <span className="font-serif font-normal italic">SiHEDAF</span>
            </span>
          </h2>
          <Link
            className="mt-9 inline-flex h-13 items-center gap-2.5 rounded-full bg-white px-8 text-[14px] font-semibold text-primary-500 shadow-[0_10px_24px_rgba(0,39,88,0.12)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(0,39,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
