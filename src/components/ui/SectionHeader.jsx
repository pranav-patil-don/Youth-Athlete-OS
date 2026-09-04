export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold tracking-[0.22em] text-[#39ff14]">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 text-2xl font-black tracking-tight">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-zinc-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}