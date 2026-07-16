import { Text, TextInput, View, type TextInputProps } from "react-native";
import { radii, spacing, typography, useThemeColors } from "@/theme";

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, ...rest }: Props) {
  const colors = useThemeColors();

  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={{ ...typography.caption, fontWeight: "600", color: colors.textSecondary }}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textSecondary}
        style={{
          ...typography.body,
          color: colors.textPrimary,
          backgroundColor: colors.surfaceMuted,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: error ? colors.warn : colors.border,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg
        }}
        {...rest}
      />
      {error ? (
        <Text accessibilityRole="alert" style={{ ...typography.caption, color: colors.warn }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
