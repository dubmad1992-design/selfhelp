import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "./tokens";

export { darkColors, lightColors, palette, radii, spacing, typography } from "./tokens";
export type { ThemeColors } from "./tokens";

export function useThemeColors() {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkColors : lightColors;
}
