import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type Credentials = {
  email: string;
  password: string;
};

export function useSignUp() {
  return useMutation({
    mutationFn: async ({ email, password }: Credentials) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    }
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async ({ email, password }: Credentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  });
}
