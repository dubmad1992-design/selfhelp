import { format } from "date-fns";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { TextField } from "@/components/text-field";
import { useLogWeight, useWeightEntries } from "@/features/weight/api/use-weight-entries";
import { logWeightInputSchema } from "@/features/weight/schemas/weight-entry";
import { useProfile } from "@/features/profile/api/use-profile";
import { formatWeight, inputWeightToKg, kgToLb } from "@/lib/units";
import { spacing, typography, useThemeColors } from "@/theme";

export default function LogScreen() {
  const colors = useThemeColors();
  const { data: profile } = useProfile();
  const { data: entries = [] } = useWeightEntries();
  const logWeight = useLogWeight();
  // null = untouched; the field then shows the latest entry, since today's
  // weight is usually ±0.x of yesterday's. Typing takes over from there.
  const [typed, setTyped] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const units = profile?.unitPreference ?? "metric";
  const today = format(new Date(), "yyyy-MM-dd");
  const latest = entries[entries.length - 1];
  const todayEntry = entries.find((e) => e.loggedOn === today);

  const prefill = latest
    ? String(Math.round((units === "metric" ? latest.weightKg : kgToLb(latest.weightKg)) * 10) / 10)
    : "";
  const value = typed ?? prefill;

  const save = () => {
    setError(null);
    const parsed = logWeightInputSchema.safeParse({
      loggedOn: today,
      weightKg: inputWeightToKg(Number(value), units)
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the number and try again.");
      return;
    }
    logWeight.mutate(parsed.data, {
      onError: () => setError("Couldn't save just now — it's kept on screen, try again."),
      onSuccess: () => {
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 2000);
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.xl,
        justifyContent: "center"
      }}
    >
      <View style={{ gap: spacing.xl }}>
        <View style={{ gap: spacing.xs }}>
          <Text style={{ ...typography.title, color: colors.textPrimary }}>
            {todayEntry ? "Update today's weight" : "Log today's weight"}
          </Text>
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            {latest
              ? `Last logged: ${formatWeight(latest.weightKg, units)}`
              : "First one sets your starting point."}
          </Text>
        </View>

        <Card style={{ gap: spacing.lg }}>
          <TextField
            label={`Weight (${units === "metric" ? "kg" : "lb"})`}
            keyboardType="decimal-pad"
            value={value}
            onChangeText={(v) => {
              setError(null);
              setTyped(v);
            }}
            error={error ?? undefined}
          />
          <Button
            label={savedFlash ? "Saved ✓" : "Save"}
            loading={logWeight.isPending}
            onPress={save}
          />
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}
