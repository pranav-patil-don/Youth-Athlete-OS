export function calculateSpeed(distanceKm, totalSeconds) {
  if (!distanceKm || !totalSeconds || totalSeconds <= 0) {
    return 0;
  }

  return distanceKm / (totalSeconds / 3600);
}

export function calculatePace(totalSeconds, distanceKm) {
  if (!distanceKm || !totalSeconds || distanceKm <= 0) {
    return 0;
  }

  return totalSeconds / 60 / distanceKm;
}

export function formatPace(decimalMinutes) {
  if (!Number.isFinite(decimalMinutes) || decimalMinutes <= 0) {
    return "--:--";
  }

  const minutes = Math.floor(decimalMinutes);
  const seconds = Math.round((decimalMinutes - minutes) * 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds < 0) {
    return "0:00";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function calculateImprovement(currentSpeed, previousSpeed) {
  if (!previousSpeed || previousSpeed <= 0) {
    return null;
  }

  return ((currentSpeed - previousSpeed) / previousSpeed) * 100;
}

export function getHydrationTarget(bodyWeight) {
  return Number(bodyWeight || 0) * 0.035;
}

export function getProteinRange(bodyWeight) {
  const weight = Number(bodyWeight || 0);

  return {
    minimum: weight * 1.6,
    maximum: weight * 2.0,
  };
}

export function getLevel(xp = 0) {
  if (xp >= 2500) return "Elite Builder";
  if (xp >= 1200) return "Performance Athlete";
  if (xp >= 600) return "Rising Star";
  if (xp >= 200) return "Developing Athlete";

  return "Novice Athlete";
}

export function getLevelProgress(xp = 0) {
  const levels = [
    { name: "Novice Athlete", min: 0, max: 200 },
    { name: "Developing Athlete", min: 200, max: 600 },
    { name: "Rising Star", min: 600, max: 1200 },
    { name: "Performance Athlete", min: 1200, max: 2500 },
    { name: "Elite Builder", min: 2500, max: 4000 },
  ];

  const current =
    levels.find((level) => xp >= level.min && xp < level.max) ||
    levels[levels.length - 1];

  const progress =
    ((xp - current.min) / (current.max - current.min)) * 100;

  return {
    ...current,
    progress: Math.max(0, Math.min(100, progress)),
  };
}