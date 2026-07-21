const timeLabels = ["03:00", "06:01", "09:02", "12:03", "15:04", "18:05", "21:06", "24:07", "27:08", "30:09", "33:10"];

type SignalChartProps = {
  isActive?: boolean;
  data?: number[];
};

export function SignalChart({ isActive = true, data }: SignalChartProps) {
  return (
    <div className={`mt-5 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-45"}`}>
      <svg
        aria-label={isActive ? "Grafik sinyal PPG terbaru sedang aktif" : "Grafik sinyal PPG dijeda"}
        className="h-[126px] w-full overflow-visible text-primary-300"
        fill="none"
        role="img"
        viewBox="0 0 760 112"
      >
        <path
          className={isActive ? "signal-draw" : undefined}
          d={(() => {
            let pathD = "M0 69h10l8-34 9 23 9-9 9 27 9 8 9-18 9 2 8-56 9 42 9-8 9 28 9 5 9-40 9-5 9 24 9 23 9 2 9-18 8 5 9-65 9 50 9 10 9-38 9-2 9 48 9 8 9-8 9-38 9 2 9 33 9 10 9-25 9-3 8 23 9 11 9-26 9-47 9 59 9-6 9 33 9 8 9-27 9-10 9 19 9 15 9-21 9-15 9 20 9-70 8 57 9 8 9 18 9-20 9-4 9 21 9 5 9-23 9-31 9 54 9-6 9 16 9-14 9 2 9-60 9 48 8 14 9 8 9-17 9-2 9-30 9 45h10";
            
            if (data && data.length > 0) {
              let maxVal = -Infinity;
              let minVal = Infinity;
              for (let i = 0; i < data.length; i++) {
                if (data[i] > maxVal) maxVal = data[i];
                if (data[i] < minVal) minVal = data[i];
              }
              const range = maxVal - minVal || 1;
              
              const points = data.map((val, idx) => {
                const x = (idx / (data.length - 1)) * 760;
                const normalized = (val - minVal) / range;
                const y = 110 - (normalized * 108); // margin from 2 to 110
                return `${idx === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
              });
              
              pathD = points.join(" ");
            }
            
            return pathD;
          })()}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-2 flex justify-between text-[12px] text-[#8c929d]">
        {timeLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
