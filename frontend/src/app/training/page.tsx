import { TrainingResolver } from "@/components/training/TrainingResolver";
import { getDay, getProgram, resolveDay } from "@/data/programs";
import { getTrack, MODE_LABEL, type WorkoutMode } from "@/data/exercises";
import type { SessionStep } from "@/components/training/SafeSpaceTraining";
import { SafeSpaceTraining } from "@/components/training/SafeSpaceTraining";

const VALID_MODES: WorkoutMode[] = [
  "mobility",
  "light_cardio",
  "balanced",
  "strength",
  "heavy_strength",
];

interface PageProps {
  searchParams: {
    source?: string;
    programId?: string;
    dayId?: string;
    mode?: string;
  };
}

export default function TrainingPage({ searchParams }: PageProps) {
  const source = searchParams.source ?? (searchParams.mode ? "mode" : null);

  if (source === "program") {
    const { programId, dayId } = searchParams;
    if (!programId || !dayId) {
      return <ErrorBlock message="Nedostaje programId ili dayId." />;
    }
    try {
      const program = getProgram(programId);
      const day = getDay(programId, dayId);
      const resolved = resolveDay(day);
      const steps: SessionStep[] = resolved.map((r) => ({
        exerciseId: r.exercise.id,
        sets: r.scheme.sets,
        reps: r.scheme.reps,
        restSec: r.scheme.restSec,
        rpe: r.scheme.rpe,
      }));
      const exitHref = program.level === "pro" ? "/pro" : "/amater";
      return (
        <SafeSpaceTraining
          title={`${program.name} · ${day.name}`}
          subtitle={day.tagline}
          steps={steps}
          exitHref={exitHref}
        />
      );
    } catch {
      return <ErrorBlock message="Program ili dan ne postoji." />;
    }
  }

  if (source === "wizard") {
    // Client-side resolver — reads sessionStorage.
    return <TrainingResolver />;
  }

  if (source === "mode") {
    const raw = searchParams.mode;
    const mode = (
      VALID_MODES.includes(raw as WorkoutMode) ? raw : "balanced"
    ) as WorkoutMode;
    const exercises = getTrack(mode);
    const steps: SessionStep[] = exercises.map((ex) => ({
      exerciseId: ex.id,
      sets: ex.defaultSets,
      reps: ex.defaultReps,
      restSec: ex.restSec,
    }));
    return (
      <SafeSpaceTraining
        title="SafeSpace Trening"
        subtitle={MODE_LABEL[mode] + "."}
        steps={steps}
      />
    );
  }

  return <ErrorBlock message="Treba ti source: program, wizard ili mode." />;
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <section className="flex flex-col gap-3 animate-fade-in">
      <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
        Trening
      </span>
      <h1 className="text-2xl font-semibold">Hm.</h1>
      <p className="text-sm text-ash-200">{message}</p>
      <a
        href="/"
        className="mt-2 inline-block rounded-xl border border-charcoal-line px-4 py-3 text-center text-sm text-ash-200 hover:border-mint hover:text-mint"
      >
        Nazad na početnu
      </a>
    </section>
  );
}
