import { Text, View } from "react-native";
import { Card } from "@/components/card";
import { spacing, typography, useThemeColors } from "@/theme";

type Props = {
  label: string;
  value: string;
  caption?: string;
  emphasis?: boolean;
};

export function StatTile({ label, value, caption, emphasis = false }: Props) {
  const colors = useThemeColors();

  return (
    <Card style={{ flex: 1, gap: spacing.xs, padding: spacing.lg }}>
      <Text style={{ ...typography.caption, fontWeight: "600", color: colors.textSecondary }}>
        {label.toUpperCase()}
      </Text>
      <Text
        style={{
          ...(emphasis ? typography.stat : typography.heading),
          color: emphasis ? colors.primary : colors.textPrimary
        }}
      >
        {value}
      </Text>
      {caption ? (
        <Text style={{ ...typography.caption, color: colors.textSecondary }}>{caption}</Text>
      ) : null}
    </Card>
  );
}
