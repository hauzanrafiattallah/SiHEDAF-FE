type SparklineProps = {
  tone?: "blue" | "pink";
};

export function Sparkline({ tone = "blue" }: SparklineProps) {
  return (
    <svg
      aria-label="Pratinjau sinyal PPG"
      className={`h-8 w-full min-w-[120px] max-w-[190px] ${
        tone === "pink" ? "text-[#ff6b91]" : "text-primary-300"
      }`}
      fill="none"
      role="img"
      viewBox="0 0 190 34"
    >
      <path
        d="M1 18h6l3-7 4 14 4-9 4 3h8l3-4 3 5h5l3-12 5 18 4-9 4 3h9l3-6 4 7 5-2 4-12 5 20 4-10 4 3h8l4-7 4 8 5-2 4-12 5 20 5-11 4 4h7l4-8 5 8 4-2 4-11 5 18 4-8 4 3h8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
