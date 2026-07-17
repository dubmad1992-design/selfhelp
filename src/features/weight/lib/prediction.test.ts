import { addDays, format } from "date-fns";
import { predictGoalDate } from "./prediction";
import { movingAverage } from "./trend";

const start = new Date("2026-06-01T00:00:00Z");

function steadyLoss(days: number, startKg: number, perDay: number) {
  return movingAverage(
    Array.from({ length: days }, (_, i) => ({
      date: format(addDays(start, i), "yyyy-MM-dd"),
      weightKg: startKg + i * perDay
    })),
    7
  );
}

describe("predictGoalDate", () => {
  const today = addDays(start, 27);

  it("predicts a date for a steady loser", () => {
    const trend = steadyLoss(28, 100, -0.1); // ~0.7 kg/week
    const p = predictGoalDate(trend, 90, today);
    expect(p.kind).toBe("on-track");
    if (p.kind === "on-track") {
      // The 7-day average dampens the earliest points, so the trend slope
      // sits slightly below the raw 0.7 kg/week.
      expect(p.ratePerWeekKg).toBeGreaterThanOrEqual(0.5);
      expect(p.ratePerWeekKg).toBeLessThanOrEqual(0.8);
      expect(p.estimatedDate.getTime()).toBeGreaterThan(today.getTime());
    }
  });

  it("supports gaining toward a goal", () => {
    const trend = steadyLoss(28, 60, 0.05);
    expect(predictGoalDate(trend, 65, today).kind).toBe("on-track");
  });

  it("is neutral when trend moves away from the goal", () => {
    const trend = steadyLoss(28, 100, 0.05);
    expect(predictGoalDate(trend, 90, today).kind).toBe("not-toward-goal");
  });

  it("is neutral on a plateau instead of an absurd date", () => {
    const trend = steadyLoss(28, 100, -0.001);
    expect(predictGoalDate(trend, 90, today).kind).toBe("not-toward-goal");
  });

  it("celebrates reaching the goal", () => {
    const trend = steadyLoss(28, 90.1, -0.001);
    expect(predictGoalDate(trend, 90, today).kind).toBe("at-goal");
  });

  it("needs enough history", () => {
    expect(predictGoalDate(steadyLoss(3, 100, -0.1), 90, today).kind).toBe("no-trend");
  });
});
