import { BatteryCharging, Moon } from "lucide-react";
import ProgressRing from "./ui/ProgressRing";

export default function ReadinessCard({
  recovery,
}) {
  const latest =
    recovery.length > 0
      ? recovery[recovery.length - 1]
      : null;

  let score = 50;
  let status = "NO DATA";
  let message =
    "Log sleep and morning readiness to generate today's recovery guidance.";

  if (latest) {
    score = Math.round(
      ((Math.min(latest.hours, 9) / 9) * 40 +
        (latest.quality / 5) * 30 +
        (latest.readiness / 5) * 30)
    );

    if (latest.hours < 7 || latest.quality < 3) {
      status = "RECOVERY DEFICIT";
      message =
        "Prioritize recovery today. Consider lighter training and excellent technique.";
    } else if (score >= 80) {
      status = "READY";
      message =
        "Recovery looks solid. Follow your planned training while respecting technique and fatigue.";
    } else {
      status = "MODERATE";
      message =
        "You can train, but keep intensity appropriate and monitor fatigue.";
    }
  }

  return (
    <div className="cyber-card neon-glow p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BatteryCharging
              size={17}
              className="text-[#39ff14]"
            />

            <p className="text-xs font-bold tracking-widest text-zinc-400">
              DAILY READINESS
            </p>
          </div>

          <h3 className="mt-2 text-lg font-black">
            {status}
          </h3>
        </div>

        <ProgressRing
          value={score}
          size={92}
          stroke={8}
          label="Score"
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-zinc-400">
        {message}
      </p>

      {latest && (
        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <Moon size={14} />

          Last sleep: {latest.hours}h · Quality {latest.quality}/5
        </div>
      )}
    </div>
  );
}