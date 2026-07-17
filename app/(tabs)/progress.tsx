import { format } from "date-fns";
import { ScrollView, Text, View } from "react-native";
import { Card } from "@/components/card";
import { useProfile } from "@/features/profile/api/use-profile";
import { useWeightEntries } from "@/features/weight/api/use-weight-entries";
import { WeightChartLoader } from "@/features/weight/components/weight-chart-loader";
import { predictGoalDate } from "@/features/weight/lib/prediction";
import { movingAverage } from "@/features/weight/lib/trend";
import { formatWeight } from "@/lib/units";
import { spacing, typography, useThemeColors } from "@/theme";

export default function ProgressScreen() {
  const colors = useThemeColors();
  const { data: profile } = useProfile();
  const { data: entries = [], isLoading } = useWeightEntries();

  const units = profile?.unitPreference ?? "metric";
  const trend = movingAverage(
    entries.map((e) => ({ date: e.loggedOn, weightKg: e.weightKg })),
    7
  );
  const latest = trend[trend.length - 1];
  const prediction = profile?.goalWeightKg ? predictGoalDate(trend, profile.goalWeightKg) : null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg }}
    >
      <View style={{ gap: spacing.xs }}>
        <Text style={{ ...typography.title, color: colors.textPrimary }}>Progress</Text>
        {latest ? (
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            Trend: {formatWeight(latest.trendKg, units)}
            {profile?.goalWeightKg ? ` · Goal: ${formatWeight(profile.goalWeightKg, units)}` : ""}
          </Text>
        ) : null}
      </View>

      {entries.length >= 2 ? (
        <Card style={{ padding: spacing.md }}>
          <WeightChartLoader trend={trend} />
        </Card>
      ) : (
        <Card style={{ gap: spacing.xs }}>
          <Text style={{ ...typography.heading, color: colors.textPrimary }}>
            {isLoading ? "Loading…" : "Your chart starts here"}
          </Text>
          {!isLoading ? (
            <Text style={{ ...typography.body, color: colors.textSecondary }}>
              Log your weight a couple of days in a row and the trend line will appear.
            </Text>
          ) : null}
        </Card>
      )}

      {prediction ? (
        <Card style={{ gap: spacing.xs }}>
          <Text style={{ ...typography.caption, fontWeight: "600", color: colors.textSecondary }}>
            GOAL OUTLOOK
          </Text>
          {prediction.kind === "on-track" ? (
            <Text style={{ ...typography.heading, color: colors.textPrimary }}>
              On track for {format(prediction.estimatedDate, "d MMMM yyyy")} at ~
              {formatWeight(prediction.ratePerWeekKg, units)}/week
            </Text>
          ) : prediction.kind === "at-goal" ? (
            <Text style={{ ...typography.heading, color: colors.primary }}>
              You&apos;re at your goal. Incredible work.
            </Text>
          ) : prediction.kind === "not-toward-goal" ? (
            <Text style={{ ...typography.body, color: colors.textSecondary }}>
              The trend has flattened lately — that happens. Keep logging; it usually moves again
              within a couple of weeks.
            </Text>
          ) : (
            <Text style={{ ...typography.body, color: colors.textSecondary }}>
              A few more days of logging and we can estimate your goal date.
            </Text>
          )}
        </Card>
      ) : null}
    </ScrollView>
  );
}
