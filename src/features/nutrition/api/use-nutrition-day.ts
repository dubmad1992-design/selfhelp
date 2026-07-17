import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/stores/session";
import {
  nutritionEntryFromRow,
  waterEntrySchema,
  type AddNutritionInput,
  type NutritionEntry,
  type WaterEntry
} from "../schemas/nutrition";

const dayKey = (userId: string, day: string) => ["nutrition-day", userId, day] as const;

type NutritionDay = {
  entries: NutritionEntry[];
  water: WaterEntry[];
};

export function useNutritionDay(day: string) {
  const userId = useSessionStore((s) => s.session?.user.id);

  return useQuery({
    queryKey: dayKey(userId ?? "anonymous", day),
    enabled: Boolean(userId),
    queryFn: async (): Promise<NutritionDay> => {
      const [meals, water] = await Promise.all([
        supabase
          .from("nutrition_entries")
          .select("id, logged_on, calories, protein_g, carbs_g, fat_g")
          .eq("logged_on", day)
          .order("created_at", { ascending: true }),
        supabase.from("water_entries").select("id, logged_on, amount_ml").eq("logged_on", day)
      ]);
      if (meals.error) throw meals.error;
      if (water.error) throw water.error;

      return {
        entries: meals.data.map(nutritionEntryFromRow),
        water: water.data.map((w) =>
          waterEntrySchema.parse({ id: w.id, loggedOn: w.logged_on, amountMl: w.amount_ml })
        )
      };
    }
  });
}

export function useAddNutrition(day: string) {
  const queryClient = useQueryClient();
  const userId = useSessionStore((s) => s.session?.user.id);

  return useMutation({
    mutationFn: async (input: AddNutritionInput) => {
      if (!userId) throw new Error("Not signed in.");
      const { error } = await supabase.from("nutrition_entries").insert({
        user_id: userId,
        logged_on: input.loggedOn,
        calories: input.calories,
        protein_g: input.proteinG,
        carbs_g: input.carbsG,
        fat_g: input.fatG
      });
      if (error) throw error;
    },
    onMutate: async (input) => {
      if (!userId) return {};
      const key = dayKey(userId, day);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<NutritionDay>(key);
      queryClient.setQueryData<NutritionDay>(key, (current) => ({
        entries: [
          ...(current?.entries ?? []),
          {
            id: `optimistic-${Date.now()}`,
            loggedOn: input.loggedOn,
            calories: input.calories,
            proteinG: input.proteinG,
            carbsG: input.carbsG,
            fatG: input.fatG
          }
        ],
        water: current?.water ?? []
      }));
      return { previous };
    },
    onError: (_e, _i, ctx) => {
      if (userId && ctx?.previous) queryClient.setQueryData(dayKey(userId, day), ctx.previous);
    },
    onSettled: () => {
      if (userId) void queryClient.invalidateQueries({ queryKey: dayKey(userId, day) });
    }
  });
}

export function useAddWater(day: string) {
  const queryClient = useQueryClient();
  const userId = useSessionStore((s) => s.session?.user.id);

  return useMutation({
    mutationFn: async (amountMl: number) => {
      if (!userId) throw new Error("Not signed in.");
      const { error } = await supabase
        .from("water_entries")
        .insert({ user_id: userId, logged_on: day, amount_ml: amountMl });
      if (error) throw error;
    },
    onMutate: async (amountMl) => {
      if (!userId) return {};
      const key = dayKey(userId, day);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<NutritionDay>(key);
      queryClient.setQueryData<NutritionDay>(key, (current) => ({
        entries: current?.entries ?? [],
        water: [
          ...(current?.water ?? []),
          { id: `optimistic-${Date.now()}`, loggedOn: day, amountMl }
        ]
      }));
      return { previous };
    },
    onError: (_e, _i, ctx) => {
      if (userId && ctx?.previous) queryClient.setQueryData(dayKey(userId, day), ctx.previous);
    },
    onSettled: () => {
      if (userId) void queryClient.invalidateQueries({ queryKey: dayKey(userId, day) });
    }
  });
}
