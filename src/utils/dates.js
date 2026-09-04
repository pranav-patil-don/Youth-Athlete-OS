export function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(dateValue) {
  if (!dateValue) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

export function isToday(dateValue) {
  if (!dateValue) return false;

  return new Date(dateValue).toDateString() === new Date().toDateString();
}

export function getLastNDays(days) {
  const dates = [];

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();

    date.setDate(date.getDate() - index);

    dates.push(date);
  }

  return dates;
}

export function getWeekStart(date = new Date()) {
  const current = new Date(date);

  const day = current.getDay();

  const difference = current.getDate() - day + (day === 0 ? -6 : 1);

  current.setDate(difference);
  current.setHours(0, 0, 0, 0);

  return current;
}

export function isWithinLastDays(dateValue, days) {
  const date = new Date(dateValue);

  const cutoff = new Date();

  cutoff.setDate(cutoff.getDate() - days);

  return date >= cutoff;
}