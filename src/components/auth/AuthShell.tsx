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
    <div className="flex min-h-screen flex-col bg-white text-primary-900">
      <main className="flex min-h-0 flex-1">
        <AuthVisualPanel
          accent={accent}
          description={description}
          titleLabel={titleLabel}
          titleLines={titleLines}
        />

        <section className="flex w-full items-center justify-center bg-white px-6 py-12 sm:px-10 lg:w-1/2 xl:px-20">
          <div className="w-full max-w-[500px]">{children}</div>
        </section>
      </main>

      <footer className="h-[52px] shrink-0 border-t border-primary-900/[0.055] bg-white px-5 sm:px-8">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between">
          <BrandLogo compact />
          <p className="text-[8px] font-medium text-primary-900/40 sm:text-[9px]">
            Copyright © 2026. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
