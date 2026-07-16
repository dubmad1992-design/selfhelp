import {
  cmToFeetInches,
  feetInchesToCm,
  formatHeight,
  formatWeight,
  inputWeightToKg,
  kgToLb,
  lbToKg
} from "./units";

describe("weight conversion", () => {
  it("round-trips kg → lb → kg within rounding tolerance", () => {
    expect(lbToKg(kgToLb(80))).toBeCloseTo(80, 0);
  });

  it("converts known values", () => {
    expect(kgToLb(100)).toBeCloseTo(220.5, 1);
    expect(lbToKg(154)).toBeCloseTo(69.9, 1);
  });

  it("parses input in the user's display unit", () => {
    expect(inputWeightToKg(80, "metric")).toBe(80);
    expect(inputWeightToKg(176, "imperial")).toBeCloseTo(79.8, 1);
  });
});

describe("height conversion", () => {
  it("converts cm to feet and inches", () => {
    expect(cmToFeetInches(180)).toEqual({ feet: 5, inches: 11 });
    expect(cmToFeetInches(152.4)).toEqual({ feet: 5, inches: 0 });
  });

  it("carries a rounded 12th inch into feet", () => {
    expect(cmToFeetInches(182.8)).toEqual({ feet: 6, inches: 0 });
  });

  it("round-trips feet/inches to cm", () => {
    expect(feetInchesToCm(5, 11)).toBeCloseTo(180.3, 1);
  });
});

describe("formatting", () => {
  it("formats weight for both unit systems", () => {
    expect(formatWeight(80, "metric")).toBe("80 kg");
    expect(formatWeight(80, "imperial")).toBe("176.4 lb");
  });

  it("formats height for both unit systems", () => {
    expect(formatHeight(180, "metric")).toBe("180 cm");
    expect(formatHeight(180, "imperial")).toBe(`5'11"`);
  });
});
