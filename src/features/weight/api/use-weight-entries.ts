import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/stores/session";
import { weightEntryFromRow, type LogWeightInput, type WeightEntry } from "../schemas/weight-entry";

const entriesKey = (userId: string) => ["weight-entries", userId] as const;

export function useWeightEntries() {
  const userId = useSessionStore((s) => s.session?.user.id);

  return useQuery({
    queryKey: entriesKey(userId ?? "anonymous"),
    enabled: Boolean(userId),
    queryFn: async (): Promise<WeightEntry[]> => {
      const { data, error } = await supabase
        .from("weight_entries")
        .select("id, logged_on, weight_kg")
        .order("logged_on", { ascending: true });
      if (error) throw error;
      return data.map(weightEntryFromRow);
    }
  });
}

/** Upsert by (user, day) with an optimistic cache update — logging must feel instant. */
export function useLogWeight() {
  const queryClient = useQueryClient();
  const userId = useSessionStore((s) => s.session?.user.id);

  return useMutation({
    mutationFn: async (input: LogWeightInput): Promise<WeightEntry> => {
      if (!userId) throw new Error("Not signed in.");
      const { data, error } = await supabase
        .from("weight_entries")
        .upsert(
          { user_id: userId, logged_on: input.loggedOn, weight_kg: input.weightKg },
          { onConflict: "user_id,logged_on" }
        )
        .select("id, logged_on, weight_kg")
        .single();
      if (error) throw error;
      return weightEntryFromRow(data);
    },
    onMutate: async (input) => {
      if (!userId) return { previous: undefined };
      const key = entriesKey(userId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<WeightEntry[]>(key);

      queryClient.setQueryData<WeightEntry[]>(key, (current = []) => {
        const optimistic: WeightEntry = {
          id: `optimistic-${input.loggedOn}`,
          loggedOn: input.loggedOn,
          weightKg: input.weightKg
        };
        const rest = current.filter((e) => e.loggedOn !== input.loggedOn);
        return [...rest, optimistic].sort((a, b) => a.loggedOn.localeCompare(b.loggedOn));
      });

      return { previous };
    },
    onError: (_error, _input, context) => {
      if (userId && context?.previous) {
        queryClient.setQueryData(entriesKey(userId), context.previous);
      }
    },
    onSettled: () => {
      if (userId) void queryClient.invalidateQueries({ queryKey: entriesKey(userId) });
    }
  });
}
