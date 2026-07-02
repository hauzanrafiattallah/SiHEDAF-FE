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
        className="modal-backdrop fixed inset-0 bg-[#0d1520]/25"
        onClick={onClose}
        type="button"
      />
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className="modal-enter relative z-10 w-full max-w-[460px] rounded-[24px] bg-white p-6 text-[#171c22] shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,20,60,0.08),0_24px_64px_rgba(0,20,60,0.14)] sm:p-8"
        role="dialog"
      >
        <button
          aria-label="Tutup"
          className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-[#a0a7b0] transition-all hover:bg-[#f0f2f5] hover:text-[#505962] focus-visible:outline-2 focus-visible:outline-primary-300"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={16} strokeWidth={2} />
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

