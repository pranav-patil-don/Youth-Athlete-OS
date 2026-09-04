export default function ProgressRing({
  value = 0,
  size = 120,
  stroke = 10,
  label = "",
}) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;

  const safeValue = Math.max(0, Math.min(100, value));

  const offset =
    circumference -
    (safeValue / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#202020"
          strokeWidth={stroke}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#39ff14"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>

      <div className="absolute text-center">
        <div className="text-xl font-black text-[#39ff14]">
          {Math.round(safeValue)}
        </div>

        {label && (
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}