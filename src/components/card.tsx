import type { PropsWithChildren } from "react";
import { View, type ViewProps } from "react-native";
import { radii, spacing, useThemeColors } from "@/theme";

export function Card({ children, style, ...rest }: PropsWithChildren<ViewProps>) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.xl,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.xl
        },
        style
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
