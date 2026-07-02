"use client";

import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";

type DashboardModalProps = Readonly<{
  children: ReactNode;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
}>;

export function DashboardModal({
  children,
  description,
  onClose,
  open,
  title,
}: DashboardModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto px-4 py-8">
      <button
        aria-label="Tutup dialog"
        className="fixed inset-0 bg-primary-900/35 backdrop-blur-[3px]"
        onClick={onClose}
        type="button"
      />
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className="page-enter relative z-10 w-full max-w-[460px] rounded-[28px] border border-[#e1e6eb] bg-white p-6 text-[#171c22] shadow-[0_28px_80px_rgba(0,39,88,0.18)] sm:p-8"
        role="dialog"
      >
        <button
          aria-label="Tutup"
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[#e2e6ea] text-[#747b85] transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-300 focus-visible:outline-2 focus-visible:outline-primary-300"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={17} strokeWidth={1.8} />
        </button>

        <h2 className="pr-12 text-[21px] font-semibold tracking-[-0.035em]" id={titleId}>
          {title}
        </h2>
        {description ? (
          <p className="mt-2 pr-10 text-[13px] leading-5 text-[#8f969f]" id={descriptionId}>
            {description}
          </p>
        ) : null}
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}

