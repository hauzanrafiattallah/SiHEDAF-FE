import Image from "next/image";

import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[680px] overflow-hidden px-5 pt-[88px] sm:pt-[100px]"
    >
      <div className="relative z-10 mx-auto flex max-w-[900px] flex-col items-center text-center">
        <h1
          className="text-[42px] leading-[0.98] font-medium tracking-[-0.06em] text-primary-900 sm:text-[54px] lg:text-[60px]"
          id="hero-title"
        >
          <span className="block">Deteksi Dini Risiko</span>
          <span className="mt-2 block">
            <span className="font-serif font-normal italic text-primary-300">
              Stroke
            </span>{" "}
            dengan AI
          </span>
        </h1>

        <p className="mt-7 max-w-[680px] text-[12px] leading-5 font-medium tracking-[-0.02em] text-primary-900/45 sm:text-[13px]">
          Pemantauan Jantung Portabel cerdas melalui sinyal PPG dan wearable
          device, dianalisis AI untuk memberikan peringatan dini risiko stroke.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
          <a
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary-500 px-6 text-[11px] font-semibold text-white shadow-[0_12px_30px_rgba(0,88,201,0.18)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400"
            href="#cta"
          >
            Mulai Sekarang
            <ArrowIcon />
          </a>
          <a
            className="inline-flex h-11 items-center rounded-full px-3 text-[11px] font-semibold text-primary-400 hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400"
            href="#tentang"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-5 h-[320px] max-w-[980px] sm:mt-2">
        <div className="absolute left-1/2 top-16 h-[300px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,210,254,0.52)_0%,rgba(217,233,251,0.26)_46%,rgba(255,255,255,0)_72%)] blur-xl sm:w-[560px]" />

        <svg
          aria-hidden="true"
          className="absolute left-1/2 top-[68px] w-[min(92vw,900px)] -translate-x-1/2 text-primary-300"
          fill="none"
          viewBox="0 0 900 92"
        >
          <path
            d="M1 48h76l10-3 8 7 12-3 9 2 15-1 10-27 12 55 13-33 12 3 12-1 8 4 12-7 12 8 8-5 10 2 10-42 12 69 12-35 14 8 12-2 12 1 13-2h46m142 0h46l13 2 11-1 13 3 13-6 12 5 10-38 13 64 12-32 12 2 12-2 13 1 12-3 10 5 10-7 11 4 12-47 13 72 12-37 13 8 14-4 12 3 12-2 12 2h76"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.1"
          />
        </svg>

        <Image
          alt="Jam tangan pintar SiHEDAF untuk pemantauan jantung portabel"
          className="absolute left-1/2 top-5 h-auto w-[150px] -translate-x-1/2 drop-shadow-[0_24px_28px_rgba(0,49,113,0.18)] sm:w-[180px]"
          height={443}
          priority
          src="/watch.png"
          width={277}
        />
      </div>
    </section>
  );
}
