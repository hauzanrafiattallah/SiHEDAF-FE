import Image from "next/image";

import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[calc(100svh-104px)] overflow-hidden px-5 pt-[clamp(3.5rem,7vh,6.5rem)]"
    >
      <div className="relative z-10 mx-auto flex max-w-[1120px] flex-col items-center text-center">
        <h1
          className="text-[clamp(3rem,4.4vw,5rem)] leading-[0.98] font-medium tracking-[-0.06em] text-primary-900"
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

        <p className="mt-8 max-w-[820px] text-[clamp(0.875rem,1vw,1.0625rem)] leading-[1.65] font-medium tracking-[-0.02em] text-primary-900/45">
          Pemantauan Jantung Portabel cerdas melalui sinyal PPG dan wearable
          device, dianalisis AI untuk memberikan peringatan dini risiko stroke.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a
            className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-primary-500 px-8 text-[14px] font-semibold text-white shadow-[0_12px_30px_rgba(0,88,201,0.2)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(0,88,201,0.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400"
            href="#cta"
          >
            Mulai Sekarang
            <ArrowIcon />
          </a>
          <a
            className="inline-flex h-13 items-center rounded-full px-4 text-[14px] font-semibold text-primary-400 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400"
            href="#tentang"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-5 h-[clamp(330px,39vh,430px)] max-w-[1280px]">
        <div className="absolute left-1/2 top-16 h-[340px] w-[min(72vw,720px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,210,254,0.52)_0%,rgba(217,233,251,0.26)_46%,rgba(255,255,255,0)_72%)] blur-xl" />

        <svg
          aria-hidden="true"
          className="absolute left-1/2 top-[88px] w-[min(94vw,1200px)] -translate-x-1/2 text-primary-300"
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
          className="absolute left-1/2 top-5 h-auto w-[clamp(175px,12vw,230px)] -translate-x-1/2 drop-shadow-[0_28px_34px_rgba(0,49,113,0.2)]"
          height={443}
          priority
          src="/watch.png"
          width={277}
        />
      </div>
    </section>
  );
}
