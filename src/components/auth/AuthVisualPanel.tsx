import Image from "next/image";

import { BrandLogo } from "@/components/ui/BrandLogo";

type AuthVisualPanelProps = {
  titleLines: string[];
  titleLabel: string;
  accent: string;
  description: string;
};

export function AuthVisualPanel({
  titleLines,
  titleLabel,
  accent,
  description,
}: AuthVisualPanelProps) {
  return (
    <aside className="relative hidden min-h-0 w-1/2 overflow-hidden bg-[linear-gradient(135deg,#f5f8ff_0%,#eaf2ff_55%,#d9e9fb_100%)] lg:block">
      <div className="absolute top-[9%] left-[12%]">
        <BrandLogo />
      </div>

      <div className="absolute top-[27%] left-[12%] max-w-[330px]">
        <h2
          aria-label={titleLabel}
          className="text-[38px] leading-[1.02] font-medium tracking-[-0.055em] text-primary-900 xl:text-[44px]"
        >
          {titleLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
          <span className="block font-serif font-normal italic text-primary-300">
            {accent}
          </span>
        </h2>
        <p className="mt-8 max-w-[280px] text-[11px] leading-[1.65] font-medium text-primary-900/43 xl:text-[12px]">
          {description}
        </p>
      </div>

      <Image
        alt="Jam tangan pintar SiHEDAF"
        className="absolute bottom-[5%] left-1/2 h-auto w-[165px] -translate-x-1/2 drop-shadow-[0_24px_28px_rgba(0,49,113,0.16)] xl:w-[205px]"
        height={443}
        priority
        src="/watch.png"
        width={277}
      />
    </aside>
  );
}
