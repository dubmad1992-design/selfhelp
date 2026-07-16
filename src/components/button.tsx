import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";
import { radii, spacing, typography, useThemeColors } from "@/theme";

type Props = Omit<PressableProps, "children"> & {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};

export function Button({ label, variant = "primary", loading = false, disabled, ...rest }: Props) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  const background =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
        ? colors.surfaceMuted
        : "transparent";
  const labelColor = variant === "primary" ? colors.textInverse : colors.textPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => ({
        backgroundColor: background,
        borderRadius: radii.lg,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        alignItems: "center",
        justifyContent: "center",
        opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1
      })}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <Text style={{ ...typography.body, fontWeight: "600", color: labelColor }}>{label}</Text>
      )}
    </Pressable>
  );
}
