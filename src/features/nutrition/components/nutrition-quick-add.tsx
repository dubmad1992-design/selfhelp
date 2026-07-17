import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ProgressBar } from "@/components/progress-bar";
import { TextField } from "@/components/text-field";
import { useProfile } from "@/features/profile/api/use-profile";
import { spacing, typography, useThemeColors } from "@/theme";
import { useAddNutrition, useNutritionDay } from "../api/use-nutrition-day";
import { dayTotals, targetFraction } from "../lib/day-totals";
import { addNutritionInputSchema } from "../schemas/nutrition";

const emptyDraft = { calories: "", proteinG: "", carbsG: "", fatG: "" };

export function NutritionQuickAdd({ day }: { day: string }) {
  const colors = useThemeColors();
  const { data: profile } = useProfile();
  const { data } = useNutritionDay(day);
  const addNutrition = useAddNutrition(day);
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState<string | null>(null);

  const totals = dayTotals(data?.entries ?? [], []);
  const set = (key: keyof typeof emptyDraft, v: string) => {
    setError(null);
    setDraft((d) => ({ ...d, [key]: v }));
  };

  const add = () => {
    const parsed = addNutritionInputSchema.safeParse({
      loggedOn: day,
      calories: Number(draft.calories),
      proteinG: draft.proteinG === "" ? 0 : Number(draft.proteinG),
      carbsG: draft.carbsG === "" ? 0 : Number(draft.carbsG),
      fatG: draft.fatG === "" ? 0 : Number(draft.fatG)
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the numbers and try again.");
      return;
    }
    addNutrition.mutate(parsed.data, {
      onError: () => setError("Couldn't save just now — try again."),
      onSuccess: () => setDraft(emptyDraft)
    });
  };

  const macros = [
    { label: "Protein", value: totals.proteinG, target: profile?.proteinTargetG ?? 0 },
    { label: "Carbs", value: totals.carbsG, target: profile?.carbsTargetG ?? 0 },
    { label: "Fat", value: totals.fatG, target: profile?.fatTargetG ?? 0 }
  ];

  return (
    <Card style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text style={{ ...typography.heading, color: colors.textPrimary }}>Food</Text>
        <Text style={{ ...typography.stat, color: colors.textPrimary }}>
          {totals.calories}
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            {" "}
            / {profile?.calorieTarget ?? 2000} kcal
          </Text>
        </Text>
        <ProgressBar
          fraction={targetFraction(totals.calories, profile?.calorieTarget ?? 2000)}
          startLabel=""
          endLabel=""
        />
      </View>

      <View style={{ gap: spacing.sm }}>
        {macros.map((m) => (
          <View key={m.label} style={{ gap: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ ...typography.caption, color: colors.textSecondary }}>{m.label}</Text>
              <Text style={{ ...typography.caption, color: colors.textSecondary }}>
                {Math.round(m.value)} / {m.target} g
              </Text>
            </View>
            <ProgressBar fraction={targetFraction(m.value, m.target)} startLabel="" endLabel="" />
          </View>
        ))}
      </View>

      <View style={{ gap: spacing.sm }}>
        <TextField
          label="Calories"
          keyboardType="number-pad"
          value={draft.calories}
          onChangeText={(v) => set("calories", v)}
          error={error ?? undefined}
        />
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <TextField
              label="Protein (g)"
              keyboardType="number-pad"
              value={draft.proteinG}
              onChangeText={(v) => set("proteinG", v)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              label="Carbs (g)"
              keyboardType="number-pad"
              value={draft.carbsG}
              onChangeText={(v) => set("carbsG", v)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              label="Fat (g)"
              keyboardType="number-pad"
              value={draft.fatG}
              onChangeText={(v) => set("fatG", v)}
            />
          </View>
        </View>
        <Button label="Add food" loading={addNutrition.isPending} onPress={add} />
      </View>
    </Card>
  );
}
