import { dayTotals, targetFraction } from "./day-totals";

const meal = (calories: number, proteinG = 0, carbsG = 0, fatG = 0) => ({
  id: `m${calories}`,
  loggedOn: "2026-07-17",
  calories,
  proteinG,
  carbsG,
  fatG
});

describe("dayTotals", () => {
  it("is all zeros for an empty day", () => {
    expect(dayTotals([], [])).toEqual({
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      waterMl: 0
    });
  });

  it("sums meals and water", () => {
    const totals = dayTotals(
      [meal(450, 30, 40, 15), meal(650, 45, 60, 20)],
      [
        { id: "w1", loggedOn: "2026-07-17", amountMl: 250 },
        { id: "w2", loggedOn: "2026-07-17", amountMl: 500 }
      ]
    );
    expect(totals).toEqual({ calories: 1100, proteinG: 75, carbsG: 100, fatG: 35, waterMl: 750 });
  });
});

describe("targetFraction", () => {
  it("caps at 1 and floors at 0", () => {
    expect(targetFraction(2500, 2000)).toBe(1);
    expect(targetFraction(0, 2000)).toBe(0);
    expect(targetFraction(1500, 2000)).toBe(0.75);
  });

  it("treats a zero target as complete", () => {
    expect(targetFraction(100, 0)).toBe(1);
  });
});
