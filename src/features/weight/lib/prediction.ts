import { addDays, differenceInCalendarDays, parseISO } from "date-fns";
import type { TrendPoint } from "./trend";

export type GoalPrediction =
  | { kind: "on-track"; estimatedDate: Date; ratePerWeekKg: number }
  | { kind: "at-goal" }
  | { kind: "no-trend" }
  | { kind: "not-toward-goal" };

const MIN_POINTS = 5;
const WINDOW_DAYS = 28;
const MAX_HORIZON_DAYS = 365 * 2;

/**
 * Estimate when the trend line reaches the goal, from the average daily
 * change across the recent window. Encouraging by design: anything that
 * can't produce a confident, motivating answer returns a neutral kind.
 */
export function predictGoalDate(
  trend: TrendPoint[],
  goalWeightKg: number,
  today: Date = new Date()
): GoalPrediction {
  if (trend.length < MIN_POINTS) return { kind: "no-trend" };

  const latest = trend[trend.length - 1];
  const losing = latest.trendKg > goalWeightKg;

  if (Math.abs(latest.trendKg - goalWeightKg) < 0.25) return { kind: "at-goal" };

  const windowStart = addDays(parseISO(latest.date), -WINDOW_DAYS);
  const window = trend.filter((p) => parseISO(p.date) >= windowStart);
  if (window.length < MIN_POINTS) return { kind: "no-trend" };

  const first = window[0];
  const spanDays = differenceInCalendarDays(parseISO(latest.date), parseISO(first.date));
  if (spanDays < 7) return { kind: "no-trend" };

  const ratePerDay = (latest.trendKg - first.trendKg) / spanDays;
  const movingTowardGoal = losing ? ratePerDay < 0 : ratePerDay > 0;
  if (!movingTowardGoal || Math.abs(ratePerDay) < 0.005) return { kind: "not-toward-goal" };

  const daysToGoal = Math.round((goalWeightKg - latest.trendKg) / ratePerDay);
  if (daysToGoal > MAX_HORIZON_DAYS) return { kind: "not-toward-goal" };

  return {
    kind: "on-track",
    estimatedDate: addDays(today, daysToGoal),
    ratePerWeekKg: Math.round(Math.abs(ratePerDay) * 7 * 10) / 10
  };
}
