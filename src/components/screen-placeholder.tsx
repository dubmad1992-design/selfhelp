import { Text, View } from "react-native";
import { spacing, typography, useThemeColors } from "@/theme";

type Props = {
  title: string;
  hint: string;
};

export function ScreenPlaceholder({ title, hint }: Props) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityLabel={`${title} screen`}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        padding: spacing.xl,
        backgroundColor: colors.background
      }}
    >
      <Text style={{ ...typography.heading, color: colors.textPrimary }}>{title}</Text>
      <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: "center" }}>
        {hint}
      </Text>
    </View>
  );
}
