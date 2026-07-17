import type { NutritionEntry, WaterEntry } from "../schemas/nutrition";

export type DayTotals = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
};

export function dayTotals(entries: NutritionEntry[], water: WaterEntry[]): DayTotals {
  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      proteinG: acc.proteinG + e.proteinG,
      carbsG: acc.carbsG + e.carbsG,
      fatG: acc.fatG + e.fatG
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  return {
    ...totals,
    waterMl: water.reduce((sum, w) => sum + w.amountMl, 0)
  };
}

/** 0..1 progress toward a target; a zero target reads as complete. */
export function targetFraction(value: number, target: number) {
  if (target <= 0) return 1;
  return Math.max(0, Math.min(1, value / target));
}
