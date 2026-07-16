import { movingAverage, trendChange } from "./trend";

const entry = (date: string, weightKg: number) => ({ date, weightKg });

describe("movingAverage", () => {
  it("returns empty for no entries", () => {
    expect(movingAverage([])).toEqual([]);
  });

  it("averages the trailing window", () => {
    const points = movingAverage(
      [entry("2026-07-01", 100), entry("2026-07-02", 98), entry("2026-07-03", 99)],
      2
    );
    expect(points.map((p) => p.trendKg)).toEqual([100, 99, 98.5]);
  });

  it("sorts by date before averaging", () => {
    const points = movingAverage([entry("2026-07-03", 99), entry("2026-07-01", 101)], 7);
    expect(points[0].date).toBe("2026-07-01");
    expect(points[1].trendKg).toBe(100);
  });

  it("smooths daily noise toward the trend", () => {
    const noisy = [
      entry("2026-07-01", 100),
      entry("2026-07-02", 101.5),
      entry("2026-07-03", 99.2),
      entry("2026-07-04", 100.8),
      entry("2026-07-05", 98.9),
      entry("2026-07-06", 100.1),
      entry("2026-07-07", 99.0)
    ];
    const points = movingAverage(noisy, 7);
    const last = points[points.length - 1];
    expect(last.trendKg).toBeCloseTo(99.9, 1);
  });
});

describe("trendChange", () => {
  const week = movingAverage(
    [
      entry("2026-07-01", 100),
      entry("2026-07-03", 99.4),
      entry("2026-07-05", 98.8),
      entry("2026-07-08", 98.2)
    ],
    7
  );

  it("reports loss as negative", () => {
    const change = trendChange(week, 7);
    expect(change).not.toBeNull();
    expect(change as number).toBeLessThan(0);
  });

  it("returns null with insufficient history", () => {
    expect(trendChange(week, 90)).toBeNull();
    expect(trendChange([], 7)).toBeNull();
  });
});
