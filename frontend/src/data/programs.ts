/**
 * Workout programs — predefined templates.
 *
 * Pro:    Push/Pull/Legs (3-day split, hipertrofija) + Upper/Lower (4-day, snaga).
 * Amater: Full-body A/B (2x tjedno, balansirano).
 *
 * Per-exercise scheme overrides allow a single exercise (e.g. bench press)
 * to use 5×5 in a strength program but 3×8–12 in a hypertrophy program.
 */

import { getExercise, type Exercise } from "./exercises";

export type ProgramLevel = "amater" | "pro";
export type ProgramGoal = "strength" | "hypertrophy" | "balanced";

export interface SchemeOverride {
  sets?: number;
  reps?: string;
  restSec?: number;
  rpe?: number;
}

export interface ProgramDay {
  id: string;
  name: string;
  /** UI subtitle, "Neovlašteni" ton. */
  tagline: string;
  exerciseIds: string[];
  /** Per-exercise scheme overrides (use exercise default if absent). */
  schemeOverrides?: Record<string, SchemeOverride>;
}

export interface Program {
  id: string;
  name: string;
  level: ProgramLevel;
  goal: ProgramGoal;
  description: string;
  daysPerWeek: number;
  days: ProgramDay[];
}

export const PROGRAMS: Record<string, Program> = {
  // ─── PRO: Push / Pull / Legs (hypertrophy) ─────────────────────────────────
  pro_ppl: {
    id: "pro_ppl",
    name: "Push / Pull / Legs",
    level: "pro",
    goal: "hypertrophy",
    description:
      "Klasičan 3-dnevni split. Volumen orijentiran. Po 4–5 vježbi po sesiji.",
    daysPerWeek: 3,
    days: [
      {
        id: "push",
        name: "Push (prsa, ramena, triceps)",
        tagline: "Sve što gura. Bez heroja na bench-u.",
        exerciseIds: [
          "bench_press",
          "shoulder_press_db",
          "incline_db_press",
          "side_lateral_raise",
          "tricep_pushdown",
        ],
        schemeOverrides: {
          bench_press: { sets: 4, reps: "6–8", restSec: 150, rpe: 8 },
          shoulder_press_db: { sets: 3, reps: "8–10", restSec: 90, rpe: 8 },
          incline_db_press: { sets: 3, reps: "10–12", restSec: 75, rpe: 8 },
          side_lateral_raise: { sets: 3, reps: "12–15", restSec: 60, rpe: 9 },
          tricep_pushdown: { sets: 3, reps: "12–15", restSec: 60, rpe: 9 },
        },
      },
      {
        id: "pull",
        name: "Pull (leđa, biceps)",
        tagline: "Povuci. Tehnika prije težine.",
        exerciseIds: [
          "barbell_row",
          "pullup",
          "db_row",
          "bicep_curl",
        ],
        schemeOverrides: {
          barbell_row: { sets: 4, reps: "6–8", restSec: 150, rpe: 8 },
          pullup: { sets: 3, reps: "5–8", restSec: 120, rpe: 8 },
          db_row: { sets: 3, reps: "10–12", restSec: 75, rpe: 8 },
          bicep_curl: { sets: 3, reps: "10–12", restSec: 60, rpe: 9 },
        },
      },
      {
        id: "legs",
        name: "Legs (noge, glutei)",
        tagline: "Najkraći dan tjedna. Zato najteži.",
        exerciseIds: [
          "back_squat",
          "romanian_deadlift_db",
          "bulgarian_split_squat",
          "hip_thrust",
        ],
        schemeOverrides: {
          back_squat: { sets: 4, reps: "6–8", restSec: 180, rpe: 8 },
          romanian_deadlift_db: {
            sets: 3,
            reps: "10–12",
            restSec: 90,
            rpe: 8,
          },
          bulgarian_split_squat: {
            sets: 3,
            reps: "8 / nogu",
            restSec: 90,
            rpe: 8,
          },
          hip_thrust: { sets: 3, reps: "10", restSec: 90, rpe: 8 },
        },
      },
    ],
  },

  // ─── PRO: Upper / Lower (strength) ─────────────────────────────────────────
  pro_upper_lower: {
    id: "pro_upper_lower",
    name: "Upper / Lower (4 dana)",
    level: "pro",
    goal: "strength",
    description:
      "Snaga + volumen kroz 4 dana. Glavne vježbe niski reps / visoki RPE.",
    daysPerWeek: 4,
    days: [
      {
        id: "upper_a",
        name: "Upper A — snaga",
        tagline: "Bench i red kao glavni. Ostalo gradi naokolo.",
        exerciseIds: ["bench_press", "barbell_row", "overhead_press", "pullup"],
        schemeOverrides: {
          bench_press: { sets: 5, reps: "5", restSec: 180, rpe: 8 },
          barbell_row: { sets: 5, reps: "5", restSec: 180, rpe: 8 },
          overhead_press: { sets: 3, reps: "6–8", restSec: 120, rpe: 7 },
          pullup: { sets: 3, reps: "5–8", restSec: 120, rpe: 7 },
        },
      },
      {
        id: "lower_a",
        name: "Lower A — snaga",
        tagline: "Squat dan. Tehnika nije savjet, nego zakon.",
        exerciseIds: ["back_squat", "romanian_deadlift_db", "walking_lunge"],
        schemeOverrides: {
          back_squat: { sets: 5, reps: "5", restSec: 210, rpe: 8 },
          romanian_deadlift_db: {
            sets: 3,
            reps: "8",
            restSec: 120,
            rpe: 7,
          },
          walking_lunge: {
            sets: 3,
            reps: "10 / nogu",
            restSec: 90,
            rpe: 7,
          },
        },
      },
      {
        id: "upper_b",
        name: "Upper B — volumen",
        tagline: "Lakši kilažom, više ponavljanja. Lopatice rade.",
        exerciseIds: [
          "incline_db_press",
          "db_row",
          "shoulder_press_db",
          "bicep_curl",
          "tricep_pushdown",
        ],
        schemeOverrides: {
          incline_db_press: {
            sets: 3,
            reps: "10–12",
            restSec: 75,
            rpe: 8,
          },
          db_row: { sets: 3, reps: "10–12", restSec: 75, rpe: 8 },
          shoulder_press_db: {
            sets: 3,
            reps: "10–12",
            restSec: 75,
            rpe: 8,
          },
          bicep_curl: { sets: 3, reps: "12–15", restSec: 60, rpe: 9 },
          tricep_pushdown: {
            sets: 3,
            reps: "12–15",
            restSec: 60,
            rpe: 9,
          },
        },
      },
      {
        id: "lower_b",
        name: "Lower B — volumen + glutei",
        tagline: "Manje šipke, više glutealnog rada.",
        exerciseIds: [
          "front_squat",
          "deadlift",
          "hip_thrust",
          "bulgarian_split_squat",
        ],
        schemeOverrides: {
          front_squat: { sets: 4, reps: "6–8", restSec: 150, rpe: 7 },
          deadlift: { sets: 3, reps: "5", restSec: 180, rpe: 7 },
          hip_thrust: { sets: 3, reps: "10–12", restSec: 90, rpe: 8 },
          bulgarian_split_squat: {
            sets: 3,
            reps: "8 / nogu",
            restSec: 90,
            rpe: 8,
          },
        },
      },
    ],
  },

  // ─── AMATER: Full-body A/B ────────────────────────────────────────────────
  amater_fullbody: {
    id: "amater_fullbody",
    name: "Full body — početak/povratak",
    level: "amater",
    goal: "balanced",
    description:
      "Dvije sesije (A i B) koje pokrivaju cijelo tijelo. 2× tjedno je dovoljno.",
    daysPerWeek: 2,
    days: [
      {
        id: "a",
        name: "Sesija A",
        tagline: "Push, pull, čučanj, core. Bez gluposti.",
        exerciseIds: [
          "goblet_squat",
          "push_up",
          "db_row",
          "plank",
          "world_greatest_stretch",
        ],
        schemeOverrides: {
          goblet_squat: { sets: 3, reps: "10", restSec: 75 },
          push_up: { sets: 3, reps: "8–12", restSec: 60 },
          db_row: { sets: 3, reps: "10", restSec: 60 },
          plank: { sets: 3, reps: "30 s", restSec: 45 },
          world_greatest_stretch: { sets: 2, reps: "6 / strana", restSec: 30 },
        },
      },
      {
        id: "b",
        name: "Sesija B",
        tagline: "Hinge, push iznad glave, pull, core.",
        exerciseIds: [
          "romanian_deadlift_db",
          "shoulder_press_db",
          "inverted_row",
          "side_plank",
          "cat_cow",
        ],
        schemeOverrides: {
          romanian_deadlift_db: { sets: 3, reps: "10", restSec: 75 },
          shoulder_press_db: { sets: 3, reps: "8–10", restSec: 75 },
          inverted_row: { sets: 3, reps: "8–10", restSec: 60 },
          side_plank: { sets: 2, reps: "30 s / strana", restSec: 45 },
          cat_cow: { sets: 2, reps: "10", restSec: 30 },
        },
      },
    ],
  },
};

export const ALL_PROGRAMS: Program[] = Object.values(PROGRAMS);

export function getProgram(id: string): Program {
  const p = PROGRAMS[id];
  if (!p) throw new Error(`Unknown program: ${id}`);
  return p;
}

export function getDay(programId: string, dayId: string): ProgramDay {
  const p = getProgram(programId);
  const day = p.days.find((d) => d.id === dayId);
  if (!day) throw new Error(`Unknown day: ${programId}/${dayId}`);
  return day;
}

export interface ResolvedExercise {
  exercise: Exercise;
  scheme: {
    sets: number;
    reps: string;
    restSec: number;
    rpe?: number;
  };
}

/** Resolve a day's exercise IDs into Exercise + final scheme (override > default). */
export function resolveDay(day: ProgramDay): ResolvedExercise[] {
  return day.exerciseIds.map((id) => {
    const ex = getExercise(id);
    const ov = day.schemeOverrides?.[id] ?? {};
    return {
      exercise: ex,
      scheme: {
        sets: ov.sets ?? ex.defaultSets,
        reps: ov.reps ?? ex.defaultReps,
        restSec: ov.restSec ?? ex.restSec,
        rpe: ov.rpe,
      },
    };
  });
}

export const PROGRAMS_BY_LEVEL: Record<ProgramLevel, Program[]> = {
  pro: ALL_PROGRAMS.filter((p) => p.level === "pro"),
  amater: ALL_PROGRAMS.filter((p) => p.level === "amater"),
};
