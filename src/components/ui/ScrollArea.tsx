"use client";

import type { ReactNode } from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

type ScrollAreaProps = {
  children: ReactNode;
  className?: string;
  viewportClassName?: string;
};

export function ScrollArea({
  children,
  className = "",
  viewportClassName = "",
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      className={`relative overflow-hidden ${className}`}
      scrollHideDelay={500}
      type="auto"
    >
      <ScrollAreaPrimitive.Viewport
        className={`h-full w-full rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-300 ${viewportClassName}`}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        aria-label="Geser konten secara horizontal"
        className="flex h-2.5 touch-none select-none flex-col bg-primary-50/80 p-0.5 transition-colors data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100"
        orientation="horizontal"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-primary-200 transition-colors hover:bg-primary-300" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
}
