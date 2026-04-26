import { SafeSpaceTraining } from "@/components/training/SafeSpaceTraining";
import type { WorkoutMode } from "@/data/exercises";

const VALID_MODES: WorkoutMode[] = [
  "mobility",
  "light_cardio",
  "balanced",
  "strength",
  "heavy_strength",
];

function parseMode(raw: string | string[] | undefined): WorkoutMode {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return VALID_MODES.includes(value as WorkoutMode)
    ? (value as WorkoutMode)
    : "balanced";
}

export default function TrainingPage({
  searchParams,
}: {
  searchParams: { mode?: string };
}) {
  const mode = parseMode(searchParams.mode);
  return <SafeSpaceTraining mode={mode} />;
}
