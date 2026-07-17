import { z } from "zod";

export const estimateItemSchema = z.object({
  name: z.string(),
  calories: z.number().int().min(0),
  protein_g: z.number().min(0),
  carbs_g: z.number().min(0),
  fat_g: z.number().min(0)
});

export const foodEstimateSchema = z.object({
  items: z.array(estimateItemSchema).min(1, "Nothing recognisable in that description."),
  assumptions: z.string()
});

export type FoodEstimate = z.infer<typeof foodEstimateSchema>;

export function estimateTotals(estimate: FoodEstimate) {
  return estimate.items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      proteinG: acc.proteinG + item.protein_g,
      carbsG: acc.carbsG + item.carbs_g,
      fatG: acc.fatG + item.fat_g
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );
}
