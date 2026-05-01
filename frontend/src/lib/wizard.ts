/**
 * Vikendaš wizard — generates an ad-hoc session from 4 inputs:
 * vrijeme, oprema, lokacija, energija.
 *
 * Output: ordered list of exerciseIds. Picks try to cover full-body (push,
 * pull, hinge/squat, core), filtered by available equipment, sized to time,
 * intensity adjusted to energy.
 */

import {
  ALL_EXERCISES,
  type Equipment,
  type Exercise,
  type MovementPattern,
} from "@/data/exercises";

export type Time = "15min" | "30min" | "45min";
export type Location = "home" | "outdoor" | "gym";
export type EquipmentTier = "none" | "mat" | "dumbbell" | "full_gym";
export type EnergyBucket = "low" | "mid" | "high";

export interface WizardInput {
  time: Time;
  location: Location;
  equipment: EquipmentTier;
  energy: EnergyBucket;
}

const EQUIPMENT_BY_TIER: Record<EquipmentTier, Equipment[]> = {
  none: ["bodyweight"],
  mat: ["bodyweight", "mat"],
  dumbbell: ["bodyweight", "mat", "dumbbell", "kettlebell"],
  full_gym: [
    "bodyweight",
    "mat",
    "dumbbell",
    "kettlebell",
    "barbell",
    "machine",
    "bench",
  ],
};

const TIME_BUDGET: Record<Time, number> = {
  "15min": 3,
  "30min": 5,
  "45min": 6,
};

/** Movement-pattern slots we try to fill, in order, for a balanced session. */
const FULL_BODY_SLOTS_HIGH: MovementPattern[] = [
  "mobility",
  "squat",
  "push_horizontal",
  "pull_horizontal",
  "hinge",
  "core",
];

const FULL_BODY_SLOTS_MID: MovementPattern[] = [
  "mobility",
  "squat",
  "push_horizontal",
  "pull_horizontal",
  "core",
  "conditioning",
];

const FULL_BODY_SLOTS_LOW: MovementPattern[] = [
  "mobility",
  "mobility",
  "core",
  "conditioning",
  "mobility",
  "core",
];

function slotsFor(energy: EnergyBucket): MovementPattern[] {
  if (energy === "high") return FULL_BODY_SLOTS_HIGH;
  if (energy === "low") return FULL_BODY_SLOTS_LOW;
  return FULL_BODY_SLOTS_MID;
}

function pickFor(
  pattern: MovementPattern,
  candidates: Exercise[],
  energy: EnergyBucket
): Exercise | undefined {
  const matches = candidates.filter((c) => c.movementPattern === pattern);
  if (matches.length === 0) return undefined;

  // Prefer level matching energy: low → beginner, high → intermediate+.
  const ranked = matches.slice().sort((a, b) => {
    const score = (ex: Exercise) => {
      const lvl =
        ex.level === "beginner" ? 0 : ex.level === "intermediate" ? 1 : 2;
      if (energy === "high") return -lvl; // prefer harder
      if (energy === "low") return lvl; // prefer easier
      return Math.abs(lvl - 1); // prefer middle
    };
    return score(a) - score(b);
  });

  return ranked[0];
}

export interface GeneratedSession {
  exerciseIds: string[];
  rationale: string;
}

export function generateSession(input: WizardInput): GeneratedSession {
  const allowed = new Set(EQUIPMENT_BY_TIER[input.equipment]);
  const candidates = ALL_EXERCISES.filter((ex) => allowed.has(ex.equipment));
  const slots = slotsFor(input.energy);
  const limit = TIME_BUDGET[input.time];

  const seen = new Set<string>();
  const result: string[] = [];

  for (const slot of slots) {
    if (result.length >= limit) break;
    const remaining = candidates.filter((c) => !seen.has(c.id));
    const pick = pickFor(slot, remaining, input.energy);
    if (pick) {
      result.push(pick.id);
      seen.add(pick.id);
    }
  }

  // If we're under budget, fill from any remaining candidate (no duplicates).
  while (result.length < limit) {
    const next = candidates.find((c) => !seen.has(c.id));
    if (!next) break;
    result.push(next.id);
    seen.add(next.id);
  }

  const rationale = buildRationale(input, result.length);
  return { exerciseIds: result, rationale };
}

function buildRationale(input: WizardInput, count: number): string {
  const energy =
    input.energy === "high"
      ? "Energija je tu — dao sam ti težu kombinaciju."
      : input.energy === "low"
      ? "Mala baterija — ostajemo na mobilnosti i lakšim stvarima."
      : "Srednja energija — balansiran trening.";
  const where =
    input.location === "outdoor"
      ? "Vani."
      : input.location === "gym"
      ? "Teretana."
      : "Doma.";
  return `${energy} ${where} ${count} vježbi za ${input.time}.`;
}

export const TIME_LABEL: Record<Time, string> = {
  "15min": "15 min",
  "30min": "30 min",
  "45min": "45 min",
};
export const LOCATION_LABEL: Record<Location, string> = {
  home: "Doma",
  outdoor: "Vani",
  gym: "Teretana",
};
export const EQUIPMENT_TIER_LABEL: Record<EquipmentTier, string> = {
  none: "Ništa",
  mat: "Strunjača",
  dumbbell: "Bučice / kettlebell",
  full_gym: "Puna teretana",
};
export const ENERGY_LABEL: Record<EnergyBucket, string> = {
  low: "Slabo",
  mid: "Srednje",
  high: "Pun pogon",
};
