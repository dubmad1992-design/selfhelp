import { estimateTotals, foodEstimateSchema } from "./estimate";

const payload = {
  items: [
    { name: "Cheese toastie", calories: 420, protein_g: 18, carbs_g: 34, fat_g: 24 },
    { name: "Banana", calories: 105, protein_g: 1, carbs_g: 27, fat_g: 0 }
  ],
  assumptions: "Assumed two slices of white bread and a medium banana."
};

describe("foodEstimateSchema", () => {
  it("accepts a valid estimate", () => {
    expect(foodEstimateSchema.parse(payload).items).toHaveLength(2);
  });

  it("rejects an empty item list", () => {
    expect(foodEstimateSchema.safeParse({ items: [], assumptions: "" }).success).toBe(false);
  });

  it("rejects negative values", () => {
    const bad = { ...payload, items: [{ ...payload.items[0], calories: -5 }] };
    expect(foodEstimateSchema.safeParse(bad).success).toBe(false);
  });
});

describe("estimateTotals", () => {
  it("sums items", () => {
    expect(estimateTotals(foodEstimateSchema.parse(payload))).toEqual({
      calories: 525,
      proteinG: 19,
      carbsG: 61,
      fatG: 24
    });
  });
});
