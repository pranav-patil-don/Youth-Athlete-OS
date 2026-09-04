export default function StatCard({
  label,
  value,
  unit = "",
  icon: Icon,
  accent = true,
}) {
  return (
    <div className="cyber-card neon-glow p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          {label}
        </p>

        {Icon && (
          <Icon
            size={18}
            className={accent ? "text-[#39ff14]" : "text-zinc-400"}
          />
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-black tracking-tight">
          {value}
        </span>

        {unit && (
          <span className="text-xs text-zinc-500">{unit}</span>
        )}
      </div>
    </div>
  );
}