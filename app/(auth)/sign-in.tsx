import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { TextField } from "@/components/text-field";
import { useSignIn } from "@/features/profile/api/use-auth";
import { useGoogleSignIn } from "@/features/profile/api/use-google-auth";
import { credentialsSchema, type Credentials } from "@/features/profile/schemas/credentials";
import { spacing, typography, useThemeColors } from "@/theme";

export default function SignInScreen() {
  const colors = useThemeColors();
  const signIn = useSignIn();
  const googleSignIn = useGoogleSignIn();
  const { control, handleSubmit } = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" }
  });

  const submit = handleSubmit((values) => {
    signIn.mutate(values, {
      onSuccess: () => router.replace("/")
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
          <Text style={{ ...typography.title, color: colors.textPrimary }}>Welcome back</Text>
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            Pick up where you left off.
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
                autoComplete="current-password"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          {signIn.isError ? (
            <Text accessibilityRole="alert" style={{ ...typography.caption, color: colors.warn }}>
              We couldn&apos;t sign you in — check your details and try again.
            </Text>
          ) : null}
          <Button label="Sign in" loading={signIn.isPending} onPress={() => void submit()} />
          <Button
            label="Continue with Google"
            variant="secondary"
            loading={googleSignIn.isPending}
            onPress={() => googleSignIn.mutate(undefined, { onSuccess: () => router.replace("/") })}
          />
        </Card>

        <Link href="/(auth)/sign-up" style={{ alignSelf: "center" }}>
          <Text style={{ ...typography.body, color: colors.primary }}>
            New here? Create an account
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
