"use client";

import type { CSSProperties } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  LoaderCircle,
  TriangleAlert,
  X,
} from "lucide-react";
import { Toaster } from "sonner";

const iconClassName = "h-[18px] w-[18px] shrink-0";

export function AppToaster() {
  return (
    <Toaster
      closeButton
      containerAriaLabel="Notifikasi SiHEDAF"
      duration={4000}
      gap={10}
      icons={{
        success: (
          <CheckCircle2
            aria-hidden="true"
            className={`${iconClassName} text-[#43B956]`}
          />
        ),
        error: (
          <CircleAlert
            aria-hidden="true"
            className={`${iconClassName} text-[#FF4572]`}
          />
        ),
        info: (
          <Info
            aria-hidden="true"
            className={`${iconClassName} text-primary-300`}
          />
        ),
        warning: (
          <TriangleAlert
            aria-hidden="true"
            className={`${iconClassName} text-[#C98613]`}
          />
        ),
        loading: (
          <LoaderCircle
            aria-hidden="true"
            className={`${iconClassName} animate-spin text-primary-300`}
          />
        ),
        close: <X aria-hidden="true" className="h-3.5 w-3.5" />,
      }}
      mobileOffset={{ top: 12, left: 12, right: 12 }}
      offset={{ top: 20 }}
      position="top-center"
      style={
        {
          "--width": "min(380px, calc(100vw - 24px))",
        } as CSSProperties
      }
      swipeDirections={["right"]}
      theme="light"
      toastOptions={{
        closeButtonAriaLabel: "Tutup notifikasi",
        unstyled: true,
        classNames: {
          toast:
            "pointer-events-auto relative flex w-[min(380px,calc(100vw-24px))] items-start gap-3 rounded-[18px] border px-4 py-3.5 pr-11 font-sans shadow-[0_16px_42px_rgba(0,49,113,0.14)]",
          default: "border-primary-200 bg-white",
          info: "border-primary-200 bg-primary-50",
          success: "border-[#BDE9C5] bg-[#F2FBF4]",
          error: "border-[#FFC2D1] bg-[#FFF5F7]",
          warning: "border-[#F7D58B] bg-[#FFF9EB]",
          loading: "border-primary-200 bg-white",
          content: "min-w-0 flex-1",
          icon: "mt-0.5 flex shrink-0 items-center",
          title: "text-[13px] font-semibold leading-5 text-primary-900",
          description: "mt-0.5 text-[12px] leading-5 text-primary-900/65",
          closeButton:
            "absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-primary-100 bg-white text-primary-700 shadow-sm transition-colors hover:border-primary-200 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-300",
          actionButton:
            "rounded-full bg-primary-300 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-primary-300",
          cancelButton:
            "rounded-full border border-primary-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-300",
        },
      }}
      visibleToasts={4}
    />
  );
}
