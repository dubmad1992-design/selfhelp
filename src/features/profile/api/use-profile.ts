import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/stores/session";
import { profileFromRow, type OnboardingInput, type Profile } from "../schemas/profile";

const profileKey = (userId: string) => ["profile", userId] as const;

export function useProfile() {
  const userId = useSessionStore((s) => s.session?.user.id);

  return useQuery({
    queryKey: profileKey(userId ?? "anonymous"),
    enabled: Boolean(userId),
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (error) throw error;
      return profileFromRow(data);
    }
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const userId = useSessionStore((s) => s.session?.user.id);

  return useMutation({
    mutationFn: async (input: OnboardingInput): Promise<Profile> => {
      if (!userId) throw new Error("Not signed in.");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          display_name: input.displayName,
          unit_preference: input.unitPreference,
          start_weight_kg: input.startWeightKg,
          goal_weight_kg: input.goalWeightKg,
          height_cm: input.heightCm,
          onboarding_completed: true
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return profileFromRow(data);
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKey(profile.id), profile);
    }
  });
}
