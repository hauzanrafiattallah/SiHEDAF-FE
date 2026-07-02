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
      <div className="absolute top-[8%] left-[10%]">
        <BrandLogo />
      </div>

      <div className="absolute top-[25%] left-[10%] max-w-[500px]">
        <h2
          aria-label={titleLabel}
          className="text-[clamp(2.75rem,3.3vw,4rem)] leading-[1.02] font-medium tracking-[-0.055em] text-primary-900"
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
        <p className="mt-9 max-w-[410px] text-[15px] leading-[1.7] font-medium text-primary-900/43 2xl:text-[16px]">
          {description}
        </p>
      </div>

      <Image
        alt="Jam tangan pintar SiHEDAF"
        className="absolute bottom-[4%] left-1/2 h-auto w-[205px] -translate-x-1/2 drop-shadow-[0_28px_34px_rgba(0,49,113,0.18)] 2xl:w-[250px]"
        height={443}
        priority
        src="/watch.png"
        width={277}
      />
    </aside>
  );
}
