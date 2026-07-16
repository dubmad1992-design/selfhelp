import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { TextField } from "@/components/text-field";
import { useSignUp } from "@/features/profile/api/use-auth";
import { credentialsSchema, type Credentials } from "@/features/profile/schemas/credentials";
import { spacing, typography, useThemeColors } from "@/theme";

export default function SignUpScreen() {
  const colors = useThemeColors();
  const signUp = useSignUp();
  const { control, handleSubmit } = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" }
  });

  const submit = handleSubmit((values) => {
    signUp.mutate(values, {
      onSuccess: () => router.replace("/(auth)/onboarding")
    });
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        padding: spacing.xl
      }}
    >
      <View style={{ gap: spacing.xl }}>
        <View style={{ gap: spacing.xs }}>
          <Text style={{ ...typography.title, color: colors.textPrimary }}>
            Let&apos;s get started
          </Text>
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            One account, all your progress.
          </Text>
        </View>

        <Card style={{ gap: spacing.lg }}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <TextField
                label="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <TextField
                label="Password"
                secureTextEntry
                autoComplete="new-password"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          {signUp.isError ? (
            <Text accessibilityRole="alert" style={{ ...typography.caption, color: colors.warn }}>
              We couldn&apos;t create your account — try a different email.
            </Text>
          ) : null}
          <Button label="Create account" loading={signUp.isPending} onPress={() => void submit()} />
        </Card>

        <Link href="/(auth)/sign-in" style={{ alignSelf: "center" }}>
          <Text style={{ ...typography.body, color: colors.primary }}>
            Already have an account? Sign in
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
