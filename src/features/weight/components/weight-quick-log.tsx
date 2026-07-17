import { format } from "date-fns";
import { useState } from "react";
import { Text } from "react-native";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { TextField } from "@/components/text-field";
import { useProfile } from "@/features/profile/api/use-profile";
import { formatWeight, inputWeightToKg, kgToLb } from "@/lib/units";
import { spacing, typography, useThemeColors } from "@/theme";
import { useLogWeight, useWeightEntries } from "../api/use-weight-entries";
import { logWeightInputSchema } from "../schemas/weight-entry";

export function WeightQuickLog() {
  const colors = useThemeColors();
  const { data: profile } = useProfile();
  const { data: entries = [] } = useWeightEntries();
  const logWeight = useLogWeight();
  const [edited, setEdited] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const units = profile?.unitPreference ?? "metric";
  const today = format(new Date(), "yyyy-MM-dd");
  const latest = entries[entries.length - 1];

  const prefill = latest
    ? String(Math.round((units === "metric" ? latest.weightKg : kgToLb(latest.weightKg)) * 10) / 10)
    : "";
  const value = edited ?? prefill;

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
    <Card style={{ gap: spacing.lg }}>
      <Text style={{ ...typography.heading, color: colors.textPrimary }}>Weight</Text>
      {latest ? (
        <Text style={{ ...typography.caption, color: colors.textSecondary }}>
          Last logged: {formatWeight(latest.weightKg, units)}
        </Text>
      ) : null}
      <TextField
        label={`Weight (${units === "metric" ? "kg" : "lb"})`}
        keyboardType="decimal-pad"
        value={value}
        onChangeText={(v) => {
          setError(null);
          setEdited(v);
        }}
        error={error ?? undefined}
      />
      <Button
        label={savedFlash ? "Saved ✓" : "Save weight"}
        loading={logWeight.isPending}
        onPress={save}
      />
    </Card>
  );
}
