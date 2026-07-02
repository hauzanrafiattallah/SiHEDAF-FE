type TeamCardProps = {
  role: string;
  name: string;
  linkedInLabel?: string;
};

export function TeamCard({
  role,
  name,
  linkedInLabel = "LinkedIn",
}: TeamCardProps) {
  return (
    <article
      aria-label={`${role}: ${name}`}
      className="relative aspect-[0.76] min-h-[218px] overflow-hidden rounded-t-sm rounded-b-[12px] bg-gradient-to-b from-[#f4f4f4] via-[#d6d6d5] to-[#858582]"
      data-team-card
    >
      <span className="absolute top-3 left-3 inline-flex h-7 items-center rounded-full bg-white/95 px-4 text-[9px] font-medium text-primary-900/48 shadow-[0_3px_12px_rgba(0,39,88,0.03)]">
        {role}
      </span>

      <div className="absolute right-4 bottom-4 left-4 text-white">
        <h2 className="text-[16px] leading-none font-medium tracking-[-0.035em]">
          {name}
        </h2>
        <p className="mt-2 truncate text-[9px] font-medium tracking-[-0.01em] text-white/85">
          {linkedInLabel}
        </p>
      </div>
    </article>
  );
}
