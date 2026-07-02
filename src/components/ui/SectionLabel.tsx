import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`inline-flex min-h-9 items-center rounded-full border border-primary-900/10 bg-white px-5 py-2 text-[13px] font-medium tracking-[-0.015em] text-primary-900/50 shadow-[0_5px_20px_rgba(0,39,88,0.035)] ${className}`}
    >
      {children}
    </p>
  );
}
