import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { TextField } from "@/components/text-field";
import { useCompleteOnboarding } from "@/features/profile/api/use-profile";
import { onboardingInputSchema, type UnitPreference } from "@/features/profile/schemas/profile";
import { feetInchesToCm, inputWeightToKg } from "@/lib/units";
import { spacing, typography, useThemeColors } from "@/theme";

type Draft = {
  displayName: string;
  unitPreference: UnitPreference;
  weight: string;
  goalWeight: string;
  heightCm: string;
  heightFeet: string;
  heightInches: string;
};

const steps = ["About you", "Where you are", "Where you're going"] as const;

export default function OnboardingScreen() {
  const colors = useThemeColors();
  const complete = useCompleteOnboarding();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({
    displayName: "",
    unitPreference: "metric",
    weight: "",
    goalWeight: "",
    heightCm: "",
    heightFeet: "",
    heightInches: ""
  });

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setError(null);
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const metric = draft.unitPreference === "metric";
  const weightUnit = metric ? "kg" : "lb";

  const finish = () => {
    const heightCm = metric
      ? Number(draft.heightCm)
      : feetInchesToCm(Number(draft.heightFeet || 0), Number(draft.heightInches || 0));

    const parsed = onboardingInputSchema.safeParse({
      displayName: draft.displayName,
      unitPreference: draft.unitPreference,
      startWeightKg: inputWeightToKg(Number(draft.weight), draft.unitPreference),
      goalWeightKg: inputWeightToKg(Number(draft.goalWeight), draft.unitPreference),
      heightCm
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details and try again.");
      return;
    }

    complete.mutate(parsed.data, {
      onSuccess: () => router.replace("/"),
      onError: () => setError("Couldn't save just now — give it another try.")
    });
  };

  const next = () => {
    setError(null);
    if (step === 0 && draft.displayName.trim().length === 0) {
      setError("Tell us what to call you.");
      return;
    }
    if (step === 1) {
      const hasHeight = metric ? draft.heightCm : draft.heightFeet;
      if (!draft.weight || !hasHeight) {
        setError("Add your weight and height so we can track your progress.");
        return;
      }
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    finish();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        padding: spacing.xl
      }}
    >
      <View style={{ gap: spacing.xl }}>
        <View style={{ gap: spacing.xs }}>
          <Text style={{ ...typography.caption, color: colors.textSecondary }}>
            Step {step + 1} of {steps.length}
          </Text>
          <Text style={{ ...typography.title, color: colors.textPrimary }}>{steps[step]}</Text>
        </View>

        <Card style={{ gap: spacing.lg }}>
          {step === 0 ? (
            <>
              <TextField
                label="What should we call you?"
                autoComplete="name"
                value={draft.displayName}
                onChangeText={(v) => set("displayName", v)}
              />
              <View style={{ gap: spacing.xs }}>
                <Text
                  style={{ ...typography.caption, fontWeight: "600", color: colors.textSecondary }}
                >
                  Units
                </Text>
                <View style={{ flexDirection: "row", gap: spacing.sm }}>
                  <View style={{ flex: 1 }}>
                    <Button
                      label="Metric (kg, cm)"
                      variant={metric ? "primary" : "secondary"}
                      onPress={() => set("unitPreference", "metric")}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      label="Imperial (lb, ft)"
                      variant={metric ? "secondary" : "primary"}
                      onPress={() => set("unitPreference", "imperial")}
                    />
                  </View>
                </View>
              </View>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <TextField
                label={`Current weight (${weightUnit})`}
                keyboardType="decimal-pad"
                value={draft.weight}
                onChangeText={(v) => set("weight", v)}
              />
              {metric ? (
                <TextField
                  label="Height (cm)"
                  keyboardType="decimal-pad"
                  value={draft.heightCm}
                  onChangeText={(v) => set("heightCm", v)}
                />
              ) : (
                <View style={{ flexDirection: "row", gap: spacing.sm }}>
                  <View style={{ flex: 1 }}>
                    <TextField
                      label="Height (ft)"
                      keyboardType="number-pad"
                      value={draft.heightFeet}
                      onChangeText={(v) => set("heightFeet", v)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextField
                      label="(in)"
                      keyboardType="number-pad"
                      value={draft.heightInches}
                      onChangeText={(v) => set("heightInches", v)}
                    />
                  </View>
                </View>
              )}
            </>
          ) : null}

          {step === 2 ? (
            <TextField
              label={`Goal weight (${weightUnit})`}
              keyboardType="decimal-pad"
              value={draft.goalWeight}
              onChangeText={(v) => set("goalWeight", v)}
            />
          ) : null}

          {error ? (
            <Text accessibilityRole="alert" style={{ ...typography.caption, color: colors.warn }}>
              {error}
            </Text>
          ) : null}

          <Button
            label={step < steps.length - 1 ? "Continue" : "Start your journey"}
            loading={complete.isPending}
            onPress={next}
          />
          {step > 0 ? (
            <Button label="Back" variant="ghost" onPress={() => setStep(step - 1)} />
          ) : null}
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}
