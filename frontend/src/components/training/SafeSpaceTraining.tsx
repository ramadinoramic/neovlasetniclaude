"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getExercise, type Exercise } from "@/data/exercises";
import { ExerciseInstructions } from "./ExerciseInstructions";
import { MuscleMap } from "./MuscleMap";
import { SetLogger } from "./SetLogger";
import { CrowdedButton } from "./CrowdedButton";
import { ExercisePicker } from "./ExercisePicker";
import { cn } from "@/lib/cn";

export interface SessionStep {
  exerciseId: string;
  sets: number;
  reps: string;
  restSec: number;
  rpe?: number;
}

interface SafeSpaceTrainingProps {
  /** Session metadata (used in header). */
  title: string;
  subtitle?: string;
  /** Ordered list of exercises with per-step scheme. */
  steps: SessionStep[];
  /** Where "Završio sam" should go. */
  exitHref?: string;
}

type Overrides = Record<number, string>;

export function SafeSpaceTraining({
  title,
  subtitle,
  steps,
  exitHref = "/",
}: SafeSpaceTrainingProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [pickerOpen, setPickerOpen] = useState(false);

  const baseStep = steps[stepIdx];
  const baseExercise = useMemo<Exercise>(
    () => getExercise(baseStep.exerciseId),
    [baseStep.exerciseId]
  );
  const overrideId = overrides[stepIdx];
  const exercise = overrideId ? getExercise(overrideId) : baseExercise;
  const isOverridden = Boolean(overrideId);
  const isAlternative = overrideId === baseExercise.alternativeId;
  const alternative = getExercise(baseExercise.alternativeId);

  const setOverride = (id: string | null) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (id === null) delete next[stepIdx];
      else next[stepIdx] = id;
      return next;
    });
  };

  const toggleCrowded = () => {
    if (isAlternative) setOverride(null);
    else setOverride(baseExercise.alternativeId);
  };

  const goNext = () =>
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  const goPrev = () => setStepIdx((i) => Math.max(i - 1, 0));

  const isLast = stepIdx === steps.length - 1;
  const progress = ((stepIdx + 1) / steps.length) * 100;

  return (
    <section className="flex flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
            {title}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-ash-600">
            {stepIdx + 1} / {steps.length}
          </span>
        </div>
        {subtitle && (
          <h1 className="text-2xl font-semibold leading-tight">
            {subtitle}
            <span className="block text-ash-400 text-base font-normal mt-1">
              Bez ogledala. Bez ega. Idemo redom.
            </span>
          </h1>
        )}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-charcoal-soft">
          <div
            className="h-full bg-mint transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <article key={exercise.id} className="flex flex-col gap-5 animate-fade-in">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-ash-50">{exercise.name}</h2>
          {isOverridden && (
            <span className="shrink-0 rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-violet-glow">
              {isAlternative ? "alternativa" : "tvoj odabir"}
            </span>
          )}
        </div>

        <MuscleMap
          primary={exercise.primaryMuscles}
          secondary={exercise.secondaryMuscles}
          exerciseName={exercise.name}
        />

        <div className="grid grid-cols-1 gap-2.5">
          <CrowdedButton
            swapped={isAlternative}
            alternativeName={isAlternative ? baseExercise.name : alternative.name}
            onToggle={toggleCrowded}
          />
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-charcoal-line bg-charcoal-soft px-4 py-3 text-left transition hover:border-mint hover:shadow-glow-mint"
          >
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-ash-400">
                Sve vježbe
              </span>
              <span className="text-sm font-medium text-ash-50">
                Biraj sam (po mišiću ili opremi)
              </span>
            </div>
            <span
              aria-hidden
              className="shrink-0 rounded-full border border-charcoal-line px-3 py-1 text-xs text-ash-200"
            >
              ⌕
            </span>
          </button>
          {isOverridden && !isAlternative && (
            <button
              type="button"
              onClick={() => setOverride(null)}
              className="text-center text-xs text-ash-400 underline-offset-2 hover:text-ash-200 hover:underline"
            >
              Vrati originalnu vježbu ({baseExercise.name})
            </button>
          )}
        </div>

        <ExerciseInstructions steps={exercise.instructions} />

        <SetLogger
          exerciseId={exercise.id}
          defaultSets={baseStep.sets}
          defaultReps={baseStep.reps}
          restSec={baseStep.restSec}
          rpe={baseStep.rpe}
          bodyweight={exercise.equipment === "bodyweight"}
        />
      </article>

      <nav className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={stepIdx === 0}
          className={cn(
            "rounded-xl border px-4 py-3 text-sm font-medium transition",
            stepIdx === 0
              ? "border-charcoal-line text-ash-600"
              : "border-charcoal-line text-ash-200 hover:border-ash-200"
          )}
        >
          ← Prethodna
        </button>
        {isLast ? (
          <Link
            href={exitHref}
            className="rounded-xl bg-mint px-4 py-3 text-center text-sm font-medium text-charcoal-deep transition hover:bg-mint-glow"
          >
            Završio sam ✓
          </Link>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="rounded-xl bg-mint px-4 py-3 text-sm font-medium text-charcoal-deep transition hover:bg-mint-glow"
          >
            Sljedeća vježba →
          </button>
        )}
      </nav>

      <p className="text-center text-xs text-ash-400">
        Možeš stati kad god. Trening nije ispit.
      </p>

      <ExercisePicker
        open={pickerOpen}
        currentExerciseId={exercise.id}
        onClose={() => setPickerOpen(false)}
        onPick={(id) => setOverride(id)}
      />
    </section>
  );
}
