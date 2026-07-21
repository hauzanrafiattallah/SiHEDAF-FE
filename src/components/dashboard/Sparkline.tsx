type SparklineProps = {
  tone?: "blue" | "pink";
  data?: number[];
};

export function Sparkline({ tone = "blue", data }: SparklineProps) {
  let d = "M1 18h6l3-7 4 14 4-9 4 3h8l3-4 3 5h5l3-12 5 18 4-9 4 3h9l3-6 4 7 5-2 4-12 5 20 4-10 4 3h8l4-7 4 8 5-2 4-12 5 20 5-11 4 4h7l4-8 5 8 4-2 4-11 5 18 4-8 4 3h8";

  if (data && data.length > 0) {
    let maxVal = -Infinity;
    let minVal = Infinity;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > maxVal) maxVal = data[i];
      if (data[i] < minVal) minVal = data[i];
    }
    const range = maxVal - minVal || 1; // avoid division by zero
    
    // Map X from 0 to 190
    // Map Y from 34 to 0 (SVG Y goes down)
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * 190;
      const normalized = (val - minVal) / range;
      // leave some padding top and bottom (e.g., 2 to 32)
      const y = 32 - (normalized * 30);
      return `${idx === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    });
    
    d = points.join(" ");
  }

  return (
    <svg
      aria-label="Pratinjau sinyal PPG"
      className={`h-8 w-full min-w-[120px] max-w-[190px] ${
        tone === "pink" ? "text-[#ff6b91]" : "text-primary-300"
      }`}
      fill="none"
      role="img"
      viewBox="0 0 190 34"
      preserveAspectRatio="none"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
