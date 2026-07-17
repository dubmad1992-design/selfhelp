import { z } from "zod";

const isoDay = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a YYYY-MM-DD date.");

export const nutritionEntrySchema = z.object({
  id: z.string(),
  loggedOn: isoDay,
  calories: z.number().int().min(0).max(10000),
  proteinG: z.number().min(0),
  carbsG: z.number().min(0),
  fatG: z.number().min(0)
});

export type NutritionEntry = z.infer<typeof nutritionEntrySchema>;

export const addNutritionInputSchema = z.object({
  loggedOn: isoDay,
  calories: z
    .number({ message: "Enter the calories." })
    .int("Whole calories only.")
    .positive("Enter the calories.")
    .max(10000, "That doesn't look right — check the number."),
  proteinG: z.number().min(0).max(500).default(0),
  carbsG: z.number().min(0).max(1000).default(0),
  fatG: z.number().min(0).max(400).default(0)
});

export type AddNutritionInput = z.infer<typeof addNutritionInputSchema>;

export const waterEntrySchema = z.object({
  id: z.string(),
  loggedOn: isoDay,
  amountMl: z.number().int().positive().max(5000)
});

export type WaterEntry = z.infer<typeof waterEntrySchema>;

export const dailyTargetsSchema = z.object({
  calorieTarget: z.number().int().min(800).max(10000),
  proteinTargetG: z.number().int().min(0).max(500),
  carbsTargetG: z.number().int().min(0).max(1000),
  fatTargetG: z.number().int().min(0).max(400),
  waterTargetMl: z.number().int().min(0).max(10000)
});

export type DailyTargets = z.infer<typeof dailyTargetsSchema>;

type NutritionRow = {
  id: string;
  logged_on: string;
  calories: number;
  protein_g: number | string;
  carbs_g: number | string;
  fat_g: number | string;
};

export function nutritionEntryFromRow(row: NutritionRow): NutritionEntry {
  return nutritionEntrySchema.parse({
    id: row.id,
    loggedOn: row.logged_on,
    calories: row.calories,
    proteinG: Number(row.protein_g),
    carbsG: Number(row.carbs_g),
    fatG: Number(row.fat_g)
  });
}
