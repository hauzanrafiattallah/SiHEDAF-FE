import type { ReactNode } from "react";

type LineIconName = "pulse" | "scan" | "heart" | "spark" | "chart";

type LineIconProps = {
  name: LineIconName;
  className?: string;
};

const iconPaths: Record<LineIconName, ReactNode> = {
  pulse: <path d="M3 12h3l2.1-5 3.4 10L14 9l1.5 3H21" />,
  scan: (
    <>
      <path d="M7 3H4a1 1 0 0 0-1 1v3M17 3h3a1 1 0 0 1 1 1v3M7 21H4a1 1 0 0 1-1-1v-3M17 21h3a1 1 0 0 0 1-1v-3" />
      <path d="M12 7v10M8.5 9l7 6M15.5 9l-7 6" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20.5 4.2 13A5.2 5.2 0 0 1 11.6 5.7L12 6l.4-.3A5.2 5.2 0 0 1 19.8 13L12 20.5Z" />
      <path d="M2.5 12h4l1.7-3.5 2.6 7 2.1-4h3.2" />
    </>
  ),
  spark: (
    <>
      <path d="M12 4.5a7.5 7.5 0 1 0 6.5 11.2" />
      <path d="M18 3v6M15 6h6" />
    </>
  ),
  chart: (
    <>
      <path d="M3 4h18v13H3zM8 21h8M12 17v4" />
      <path d="m6.5 13 3.2-3 2.7 2 4.6-5" />
    </>
  ),
};

export function LineIcon({ name, className = "size-8" }: LineIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.65"
      >
        {iconPaths[name]}
      </g>
    </svg>
  );
}
