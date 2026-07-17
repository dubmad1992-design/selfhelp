import { Text, View } from "react-native";
import { radii, spacing, typography, useThemeColors } from "@/theme";

type Props = {
  /** 0..1 */
  fraction: number;
  startLabel: string;
  endLabel: string;
};

export function ProgressBar({ fraction, startLabel, endLabel }: Props) {
  const colors = useThemeColors();
  const clamped = Math.max(0, Math.min(1, fraction));

  return (
    <View
      accessibilityLabel={`Progress: ${Math.round(clamped * 100)} percent of the way to your goal`}
      style={{ gap: spacing.xs }}
    >
      <View
        style={{
          height: 12,
          borderRadius: radii.full,
          backgroundColor: colors.surfaceMuted,
          overflow: "hidden"
        }}
      >
        <View
          style={{
            width: `${clamped * 100}%`,
            height: "100%",
            borderRadius: radii.full,
            backgroundColor: colors.primary
          }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ ...typography.caption, color: colors.textSecondary }}>{startLabel}</Text>
        <Text style={{ ...typography.caption, color: colors.textSecondary }}>{endLabel}</Text>
      </View>
    </View>
  );
}
