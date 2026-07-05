type TeamCardProps = {
  role: string;
  name: string;
  linkedInLabel?: string;
  imageSrc?: string;
};

import Image from "next/image";
import { LinkedinIcon } from "@/components/ui/LinkedinIcon";

export function TeamCard({
  role,
  name,
  linkedInLabel,
  imageSrc,
}: TeamCardProps) {
  const hasLinkedIn = Boolean(linkedInLabel && linkedInLabel.includes("http"));

  return (
    <article
      aria-label={`${role}: ${name}`}
      className="dashboard-card relative aspect-[0.76] min-h-[300px] overflow-hidden rounded-t-md rounded-b-[18px] bg-gradient-to-b from-[#f4f4f4] via-[#d6d6d5] to-[#858582]"
    >
      {imageSrc ? (
        <>
          <Image
            alt={name}
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            src={imageSrc}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/80" />
        </>
      ) : null}
      <span className="absolute top-4 left-4 inline-flex h-9 items-center rounded-full bg-white/95 px-5 text-[12px] font-medium text-primary-900/48 shadow-[0_3px_12px_rgba(0,39,88,0.03)]">
        {role}
      </span>

      <div className="absolute right-4 bottom-4 left-4 text-white">
        <h2 className="text-[22px] leading-none font-medium tracking-[-0.035em]">
          {name}
        </h2>
        {hasLinkedIn ? (
          <a
            className="mt-3.5 inline-flex h-9 items-center gap-2 rounded-full bg-primary-300 px-4 text-[13px] font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-[0_8px_16px_rgba(0,110,251,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
            href={linkedInLabel}
            rel="noopener noreferrer"
            target="_blank"
          >
            <LinkedinIcon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            <span>LinkedIn</span>
          </a>
        ) : (
          <div className="mt-3.5 inline-flex h-9 items-center gap-2 rounded-full bg-primary-300/50 px-4 text-[13px] font-medium text-white/70">
            <LinkedinIcon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            <span>LinkedIn</span>
          </div>
        )}
      </div>
    </article>
  );
}
