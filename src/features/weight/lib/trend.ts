/**
 * Trend math for weight tracking. Product rule: trends beat single data
 * points — charts emphasise the moving average over daily noise.
 */

export type DatedWeight = {
  /** ISO date, e.g. "2026-07-16" */
  date: string;
  weightKg: number;
};

export type TrendPoint = DatedWeight & {
  /** Rolling average of the trailing window ending on this date. */
  trendKg: number;
};

/**
 * Rolling average over the trailing `windowDays` entries (by date order).
 * Entries may be sparse — the window is over logged entries, not calendar
 * days, so a user who logs 3×/week still gets a stable trend.
 */
export function movingAverage(entries: DatedWeight[], windowDays = 7): TrendPoint[] {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  return sorted.map((entry, index) => {
    const windowStart = Math.max(0, index - windowDays + 1);
    const window = sorted.slice(windowStart, index + 1);
    const sum = window.reduce((total, e) => total + e.weightKg, 0);
    return { ...entry, trendKg: round1(sum / window.length) };
  });
}

/**
 * Change between the trend value now and the trend value `days` ago.
 * Positive = gaining, negative = losing. Null until enough history exists.
 */
export function trendChange(points: TrendPoint[], days: number): number | null {
  if (points.length === 0) return null;

  const latest = points[points.length - 1];
  const cutoff = addDays(latest.date, -days);
  const past = [...points].reverse().find((p) => p.date <= cutoff);

  if (!past) return null;
  return round1(latest.trendKg - past.trendKg);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
