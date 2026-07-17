import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@/components/button";
import { TextField } from "@/components/text-field";
import { spacing, typography, useThemeColors } from "@/theme";
import { useEstimateFood } from "../api/use-estimate-food";
import { estimateTotals, type FoodEstimate } from "../schemas/estimate";

type Props = {
  onEstimate: (totals: ReturnType<typeof estimateTotals>) => void;
};

export function FoodEstimateInput({ onEstimate }: Props) {
  const colors = useThemeColors();
  const estimate = useEstimateFood();
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<FoodEstimate | null>(null);

  const run = () => {
    if (description.trim().length < 2) return;
    setResult(null);
    estimate.mutate(description, {
      onSuccess: (data) => {
        setResult(data);
        onEstimate(estimateTotals(data));
      }
    });
  };

  return (
    <View style={{ gap: spacing.sm }}>
      <TextField
        label="Describe what you ate"
        placeholder="e.g. cheese toastie and a banana"
        value={description}
        onChangeText={(v) => setDescription(v)}
        error={estimate.isError ? (estimate.error as Error).message : undefined}
      />
      <Button
        label={estimate.isPending ? "Estimating…" : "Estimate with AI"}
        variant="secondary"
        loading={estimate.isPending}
        onPress={run}
      />
      {result ? (
        <View style={{ gap: 2 }}>
          {result.items.map((item) => (
            <Text key={item.name} style={{ ...typography.caption, color: colors.textSecondary }}>
              {item.name}: {item.calories} kcal · {Math.round(item.protein_g)}p/
              {Math.round(item.carbs_g)}c/{Math.round(item.fat_g)}f
            </Text>
          ))}
          <Text style={{ ...typography.caption, color: colors.textSecondary }}>
            {result.assumptions} Adjust below if needed, then add.
          </Text>
        </View>
      ) : null}
    </View>
  );
}
