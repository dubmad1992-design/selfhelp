import { z } from "zod";

export const weightEntrySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  /** Kilograms — metric internally, converted at the display layer. */
  weightKg: z.number().positive().max(500),
  /** ISO 8601 date (user's local day) the entry belongs to. */
  loggedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  createdAt: z.string().datetime()
});

export type WeightEntry = z.infer<typeof weightEntrySchema>;

export const newWeightEntrySchema = weightEntrySchema.pick({
  weightKg: true,
  loggedOn: true
});

export type NewWeightEntry = z.infer<typeof newWeightEntrySchema>;
