"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      closeButton
      duration={4000}
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-primary-200 bg-white text-primary-900 shadow-xl",
          success: "border-[#BDE9C5]",
          error: "border-[#FFC2D1]",
          title: "font-semibold",
          description: "text-primary-900/65",
        },
      }}
    />
  );
}
