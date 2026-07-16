/**
 * Unit conversion — data is metric internally (kg, cm); conversion happens
 * only at the display/input layer based on the user's preference.
 */

import type { UnitPreference } from "@/features/profile/schemas/profile";

const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;

export function kgToLb(kg: number): number {
  return round1(kg / KG_PER_LB);
}

export function lbToKg(lb: number): number {
  return round1(lb * KG_PER_LB);
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / CM_PER_IN;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  // Rounding can push inches to 12 (e.g. 182.8cm) — carry into feet.
  if (inches === 12) return { feet: feet + 1, inches: 0 };
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return round1((feet * 12 + inches) * CM_PER_IN);
}

export function formatWeight(kg: number, unit: UnitPreference): string {
  return unit === "metric" ? `${round1(kg)} kg` : `${kgToLb(kg)} lb`;
}

export function formatHeight(cm: number, unit: UnitPreference): string {
  if (unit === "metric") return `${round1(cm)} cm`;
  const { feet, inches } = cmToFeetInches(cm);
  return `${feet}'${inches}"`;
}

/** Parses a user-entered weight in their display unit into kg. */
export function inputWeightToKg(value: number, unit: UnitPreference): number {
  return unit === "metric" ? round1(value) : lbToKg(value);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
