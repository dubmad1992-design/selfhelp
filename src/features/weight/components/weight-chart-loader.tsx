import { lazy, Suspense, useEffect, useState, type ComponentProps } from "react";
import { Platform, Text, View } from "react-native";
import { spacing, typography, useThemeColors } from "@/theme";

const LazyWeightChart = lazy(() => import("./weight-chart"));

type Props = ComponentProps<typeof import("./weight-chart").default>;

/**
 * Victory Native draws with Skia; on web the CanvasKit wasm runtime must be
 * loaded before any Skia component renders. Native platforms skip all this.
 */
export function WeightChartLoader(props: Props) {
  const colors = useThemeColors();
  const [ready, setReady] = useState(Platform.OS !== "web");

  useEffect(() => {
    if (Platform.OS !== "web") return;
    void import("@shopify/react-native-skia/lib/module/web")
      .then(({ LoadSkiaWeb }) =>
        LoadSkiaWeb({
          // Version must match the canvaskit-wasm pinned by @shopify/react-native-skia.
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.41.0/bin/full/${file}`
        })
      )
      .then(() => setReady(true));
  }, []);

  const fallback = (
    <View style={{ height: 260, alignItems: "center", justifyContent: "center", gap: spacing.sm }}>
      <Text style={{ ...typography.caption, color: colors.textSecondary }}>
        Drawing your chart…
      </Text>
    </View>
  );

  if (!ready) return fallback;

  return (
    <Suspense fallback={fallback}>
      <LazyWeightChart {...props} />
    </Suspense>
  );
}
