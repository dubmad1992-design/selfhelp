import { View } from "react-native";
import { CartesianChart, Line } from "victory-native";
import { radii, useThemeColors } from "@/theme";
import type { TrendPoint } from "../lib/trend";

type Props = {
  trend: TrendPoint[];
  height?: number;
};

/**
 * Trend-first weight chart: daily weights as a muted line, the 7-day
 * trend as the emphasized one (product rule: trends over daily noise).
 */
export default function WeightChart({ trend, height = 260 }: Props) {
  const colors = useThemeColors();

  const data = trend.map((p) => ({
    x: new Date(`${p.date}T00:00:00`).getTime(),
    weight: p.weightKg,
    trendLine: p.trendKg
  }));

  return (
    <View
      accessibilityLabel="Weight trend chart"
      style={{ height, borderRadius: radii.lg, overflow: "hidden" }}
    >
      <CartesianChart
        data={data}
        xKey="x"
        yKeys={["weight", "trendLine"]}
        domainPadding={{ top: 16, bottom: 16 }}
      >
        {({ points }) => (
          <>
            <Line
              points={points.weight}
              color={colors.border}
              strokeWidth={2}
              curveType="monotoneX"
            />
            <Line
              points={points.trendLine}
              color={colors.primary}
              strokeWidth={4}
              curveType="monotoneX"
            />
          </>
        )}
      </CartesianChart>
    </View>
  );
}
