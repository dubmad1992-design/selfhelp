import { z } from "zod";

export const weightEntrySchema = z.object({
  id: z.string(),
  /** ISO 8601 date (user's local day) the entry belongs to. */
  loggedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a YYYY-MM-DD date."),
  /** Kilograms — metric internally, converted at the display layer. */
  weightKg: z.number().positive().max(500)
});

export type WeightEntry = z.infer<typeof weightEntrySchema>;

export const logWeightInputSchema = z.object({
  loggedOn: weightEntrySchema.shape.loggedOn,
  weightKg: z
    .number({ message: "Enter your weight." })
    .positive("Enter your weight.")
    .max(500, "That doesn't look right — check the number.")
});

export type LogWeightInput = z.infer<typeof logWeightInputSchema>;

type WeightEntryRow = {
  id: string;
  logged_on: string;
  weight_kg: number | string;
};

export function weightEntryFromRow(row: WeightEntryRow): WeightEntry {
  return weightEntrySchema.parse({
    id: row.id,
    loggedOn: row.logged_on,
    weightKg: Number(row.weight_kg)
  });
}
