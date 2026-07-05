import type { ReactNode } from "react";

import { AuthVisualPanel } from "@/components/auth/AuthVisualPanel";
import { BrandLogo } from "@/components/ui/BrandLogo";

type AuthShellProps = {
  titleLines: string[];
  titleLabel: string;
  accent: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  titleLines,
  titleLabel,
  accent,
  description,
  children,
}: AuthShellProps) {
  return (
    <div className="page-enter flex min-h-dvh flex-col bg-white text-primary-900">
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <AuthVisualPanel
          accent={accent}
          description={description}
          titleLabel={titleLabel}
          titleLines={titleLines}
        />

        <section className="flex w-full items-center justify-center bg-white px-6 py-10 sm:px-10 lg:w-1/2 lg:py-14 xl:px-20 2xl:px-28">
          <div className="w-full max-w-[580px]">{children}</div>
        </section>
      </main>

      <footer className="h-[72px] shrink-0 border-t border-primary-900/[0.055] bg-white px-5 sm:px-8">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between">
          <BrandLogo compact />
          <p className="text-[12px] font-medium text-primary-900/40">
            Copyright © 2026. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
