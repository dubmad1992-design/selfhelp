import { format } from "date-fns";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ProgressBar } from "@/components/progress-bar";
import { StatTile } from "@/components/stat-tile";
import { useProfile } from "@/features/profile/api/use-profile";
import { useWeightEntries } from "@/features/weight/api/use-weight-entries";
import { predictGoalDate } from "@/features/weight/lib/prediction";
import { movingAverage, trendChange } from "@/features/weight/lib/trend";
import { formatWeight } from "@/lib/units";
import { spacing, typography, useThemeColors } from "@/theme";

function greeting(now: Date) {
  const hour = now.getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

export default function DashboardScreen() {
  const colors = useThemeColors();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: entries = [], isLoading: entriesLoading } = useWeightEntries();

  const units = profile?.unitPreference ?? "metric";
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");
  const loggedToday = entries.some((e) => e.loggedOn === today);

  const trend = movingAverage(
    entries.map((e) => ({ date: e.loggedOn, weightKg: e.weightKg })),
    7
  );
  const current = trend[trend.length - 1];
  const weekChange = trendChange(trend, 7);
  const prediction = profile?.goalWeightKg ? predictGoalDate(trend, profile.goalWeightKg) : null;

  const journey =
    profile?.startWeightKg && profile.goalWeightKg && current
      ? (profile.startWeightKg - current.trendKg) / (profile.startWeightKg - profile.goalWeightKg)
      : null;

  const loading = profileLoading || entriesLoading;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg }}
    >
      <View style={{ gap: spacing.xs }}>
        <Text style={{ ...typography.caption, color: colors.textSecondary }}>
          {format(now, "EEEE d MMMM")}
        </Text>
        <Text style={{ ...typography.title, color: colors.textPrimary }}>
          {greeting(now)}
          {profile?.displayName ? `, ${profile.displayName}` : ""}
        </Text>
      </View>

      {loading ? (
        <Card>
          <Text style={{ ...typography.body, color: colors.textSecondary }}>Loading…</Text>
        </Card>
      ) : current ? (
        <>
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <StatTile
              emphasis
              label="Trend weight"
              value={formatWeight(current.trendKg, units)}
              caption={
                weekChange === null
                  ? "Keep logging to see your weekly change"
                  : weekChange < -0.05
                    ? `Down ${formatWeight(Math.abs(weekChange), units)} this week`
                    : weekChange > 0.05
                      ? `Up ${formatWeight(weekChange, units)} this week`
                      : "Holding steady this week"
              }
            />
          </View>

          {journey !== null && profile?.startWeightKg && profile.goalWeightKg ? (
            <Card style={{ gap: spacing.md }}>
              <Text
                style={{ ...typography.caption, fontWeight: "600", color: colors.textSecondary }}
              >
                YOUR JOURNEY
              </Text>
              <ProgressBar
                fraction={journey}
                startLabel={formatWeight(profile.startWeightKg, units)}
                endLabel={formatWeight(profile.goalWeightKg, units)}
              />
              {prediction?.kind === "on-track" ? (
                <Text style={{ ...typography.body, color: colors.textSecondary }}>
                  On track for {format(prediction.estimatedDate, "d MMMM")}.
                </Text>
              ) : prediction?.kind === "at-goal" ? (
                <Text style={{ ...typography.body, color: colors.primary }}>
                  Goal reached — maintain and enjoy it.
                </Text>
              ) : null}
            </Card>
          ) : null}
        </>
      ) : (
        <Card style={{ gap: spacing.xs }}>
          <Text style={{ ...typography.heading, color: colors.textPrimary }}>
            Day one starts with one number
          </Text>
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            Log your first weight and everything here comes to life.
          </Text>
        </Card>
      )}

      <Button
        label={loggedToday ? "Update today's weight" : "Log today's weight"}
        onPress={() => router.push("/log")}
      />
      {loggedToday ? (
        <Text style={{ ...typography.caption, color: colors.textSecondary, textAlign: "center" }}>
          Logged today ✓ — see you tomorrow
        </Text>
      ) : null}
    </ScrollView>
  );
}
