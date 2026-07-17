import { format } from "date-fns";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { NutritionQuickAdd } from "@/features/nutrition/components/nutrition-quick-add";
import { WaterTracker } from "@/features/nutrition/components/water-tracker";
import { WeightQuickLog } from "@/features/weight/components/weight-quick-log";
import { spacing, typography, useThemeColors } from "@/theme";

export default function LogScreen() {
  const colors = useThemeColors();
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text style={{ ...typography.caption, color: colors.textSecondary }}>
            {format(new Date(), "EEEE d MMMM")}
          </Text>
          <Text style={{ ...typography.title, color: colors.textPrimary }}>Today&apos;s log</Text>
        </View>

        <WeightQuickLog />
        <NutritionQuickAdd day={today} />
        <WaterTracker day={today} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
