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
  const leadingTitleLines = titleLines.slice(0, -1);
  const finalTitleLine = titleLines.at(-1);

  return (
    <aside className="hidden min-h-0 w-1/2 overflow-hidden bg-[linear-gradient(135deg,#f5f8ff_0%,#eaf2ff_55%,#d9e9fb_100%)] lg:block">
      <div className="flex h-full flex-col px-[clamp(3rem,7vw,7rem)] py-[clamp(1.5rem,4vh,3.5rem)]">
        <div className="shrink-0">
          <BrandLogo />
        </div>

        <div className="mt-[clamp(1.75rem,6vh,5.5rem)] max-w-[500px] shrink-0">
          <h2
            aria-label={titleLabel}
            className="text-[clamp(2rem,2.6vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.055em] text-primary-900"
          >
            {leadingTitleLines.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
            <span className="block">
              {finalTitleLine}{" "}
              <span className="font-serif font-normal italic text-primary-300">
                {accent}
              </span>
            </span>
          </h2>
          <p className="mt-6 max-w-[410px] text-[13px] leading-[1.65] font-medium text-primary-900/43 2xl:text-[14px]">
            {description}
          </p>
        </div>

        <div className="mt-auto flex min-h-0 flex-1 items-end justify-center pt-4">
          <Image
            alt="Jam tangan pintar SiHEDAF"
            className="h-full max-h-[42vh] w-auto max-w-[clamp(150px,18vw,240px)] object-contain drop-shadow-[0_24px_30px_rgba(0,49,113,0.16)]"
            height={443}
            priority
            src="/watch.png"
            width={277}
          />
        </div>
      </div>
    </aside>
  );
}
