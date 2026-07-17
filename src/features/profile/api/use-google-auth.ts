import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

import { sessionParamsFromUrl } from "../lib/oauth-url";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleSignIn() {
  return useMutation({
    mutationFn: async () => {
      if (Platform.OS === "web") {
        // Full-page redirect; the session lands in the URL when Google returns.
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
        return;
      }

      const redirectTo = Linking.createURL("auth-callback");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true }
      });
      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== "success") throw new Error("Sign-in was cancelled.");

      const tokens = sessionParamsFromUrl(result.url);
      if (!tokens) throw new Error("Google didn't return a session.");

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      });
      if (sessionError) throw sessionError;
    }
  });
}
