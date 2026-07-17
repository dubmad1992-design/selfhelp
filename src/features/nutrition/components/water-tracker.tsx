import { Text, View } from "react-native";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ProgressBar } from "@/components/progress-bar";
import { useProfile } from "@/features/profile/api/use-profile";
import { spacing, typography, useThemeColors } from "@/theme";
import { useAddWater, useNutritionDay } from "../api/use-nutrition-day";
import { targetFraction } from "../lib/day-totals";

export function WaterTracker({ day }: { day: string }) {
  const colors = useThemeColors();
  const { data: profile } = useProfile();
  const { data } = useNutritionDay(day);
  const addWater = useAddWater(day);

  const totalMl = (data?.water ?? []).reduce((sum, w) => sum + w.amountMl, 0);
  const target = profile?.waterTargetMl ?? 2000;

  return (
    <Card style={{ gap: spacing.md }}>
      <Text style={{ ...typography.heading, color: colors.textPrimary }}>Water</Text>
      <Text style={{ ...typography.stat, color: colors.info }}>
        {(totalMl / 1000).toFixed(2).replace(/\.?0+$/, "")}
        <Text style={{ ...typography.body, color: colors.textSecondary }}>
          {" "}
          / {(target / 1000).toFixed(1)} L
        </Text>
      </Text>
      <ProgressBar fraction={targetFraction(totalMl, target)} startLabel="" endLabel="" />
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Button label="+250 ml" variant="secondary" onPress={() => addWater.mutate(250)} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="+500 ml" variant="secondary" onPress={() => addWater.mutate(500)} />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="+750 ml" variant="secondary" onPress={() => addWater.mutate(750)} />
        </View>
      </View>
    </Card>
  );
}
