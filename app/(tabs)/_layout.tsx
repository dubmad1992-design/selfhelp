import { Redirect, Tabs } from "expo-router";
import { useProfile } from "@/features/profile/api/use-profile";
import { useSessionStore } from "@/stores/session";
import { useThemeColors } from "@/theme";

export default function TabsLayout() {
  const colors = useThemeColors();
  const session = useSessionStore((s) => s.session);
  const initialized = useSessionStore((s) => s.initialized);
  const profile = useProfile();

  if (!initialized) return null;
  if (!session) return <Redirect href="/(auth)/sign-in" />;
  if (profile.data && !profile.data.onboardingCompleted) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="log" options={{ title: "Log" }} />
      <Tabs.Screen name="workouts" options={{ title: "Workouts" }} />
      <Tabs.Screen name="progress" options={{ title: "Progress" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
