import { z } from "zod";

export const unitPreferenceSchema = z.enum(["metric", "imperial"]);
export type UnitPreference = z.infer<typeof unitPreferenceSchema>;

export const profileSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1).max(60).nullable(),
  unitPreference: unitPreferenceSchema,
  startWeightKg: z.number().positive().max(500).nullable(),
  goalWeightKg: z.number().positive().max(500).nullable(),
  heightCm: z.number().positive().max(300).nullable(),
  onboardingCompleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Profile = z.infer<typeof profileSchema>;

/** Everything onboarding collects; weights arrive already converted to kg. */
export const onboardingInputSchema = z
  .object({
    displayName: z.string().trim().min(1, "Tell us what to call you.").max(60),
    unitPreference: unitPreferenceSchema,
    startWeightKg: z.number({ message: "Enter your current weight." }).positive().max(500),
    goalWeightKg: z.number({ message: "Enter your goal weight." }).positive().max(500),
    heightCm: z.number({ message: "Enter your height." }).positive().max(300)
  })
  .refine((data) => data.goalWeightKg !== data.startWeightKg, {
    message: "Your goal should differ from your starting weight.",
    path: ["goalWeightKg"]
  });

export type OnboardingInput = z.infer<typeof onboardingInputSchema>;

/** Maps a raw supabase row (snake_case) to the app shape. */
export function profileFromRow(row: Record<string, unknown>): Profile {
  return profileSchema.parse({
    id: row.id,
    displayName: row.display_name,
    unitPreference: row.unit_preference,
    startWeightKg: row.start_weight_kg === null ? null : Number(row.start_weight_kg),
    goalWeightKg: row.goal_weight_kg === null ? null : Number(row.goal_weight_kg),
    heightCm: row.height_cm === null ? null : Number(row.height_cm),
    onboardingCompleted: row.onboarding_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}
