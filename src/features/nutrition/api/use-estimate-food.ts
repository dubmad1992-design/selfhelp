import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { foodEstimateSchema, type FoodEstimate } from "../schemas/estimate";

export function useEstimateFood() {
  return useMutation({
    mutationFn: async (description: string): Promise<FoodEstimate> => {
      const { data, error } = await supabase.functions.invoke("estimate-food", {
        body: { description }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return foodEstimateSchema.parse(data);
    }
  });
}
