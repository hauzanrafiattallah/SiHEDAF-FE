import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`inline-flex min-h-7 items-center rounded-full border border-primary-900/10 bg-white px-4 py-1.5 text-[10px] font-medium tracking-[-0.015em] text-primary-900/50 ${className}`}
    >
      {children}
    </p>
  );
}
