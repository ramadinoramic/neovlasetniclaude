"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MODE_LABEL,
  type WorkoutMode,
  getExercise,
  getTrack,
} from "@/data/exercises";
import { ExerciseInstructions } from "./ExerciseInstructions";
import { LottiePlaceholder } from "./LottiePlaceholder";
import { SetLogger } from "./SetLogger";
import { CrowdedButton } from "./CrowdedButton";
import { cn } from "@/lib/cn";

interface SafeSpaceTrainingProps {
  mode: WorkoutMode;
}

export function SafeSpaceTraining({ mode }: SafeSpaceTrainingProps) {
  const track = useMemo(() => getTrack(mode), [mode]);

  const [stepIdx, setStepIdx] = useState(0);
  const [swapped, setSwapped] = useState(false);

  const baseExercise = track[stepIdx];
  const alternative = getExercise(baseExercise.alternativeId);
  const exercise = swapped ? alternative : baseExercise;

  const goNext = () => {
    setSwapped(false);
    setStepIdx((i) => Math.min(i + 1, track.length - 1));
  };
  const goPrev = () => {
    setSwapped(false);
    setStepIdx((i) => Math.max(i - 1, 0));
  };

  const isLast = stepIdx === track.length - 1;
  const progress = ((stepIdx + 1) / track.length) * 100;

  return (
    <section className="flex flex-col gap-6 animate-fade-in">
      {/* Header — UI ton (Neovlašteni) */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
            SafeSpace Trening
          </span>
          <span className="text-[10px] uppercase tracking-widest text-ash-600">
            {stepIdx + 1} / {track.length}
          </span>
        </div>
        <h1 className="text-2xl font-semibold leading-tight">
          {MODE_LABEL[mode]}.
          <span className="block text-ash-400 text-base font-normal mt-1">
            Bez ogledala. Bez ega. Idemo redom.
          </span>
        </h1>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-charcoal-soft">
          <div
            className="h-full bg-mint transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Exercise card */}
      <article
        key={exercise.id}
        className="flex flex-col gap-5 animate-fade-in"
      >
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-ash-50">{exercise.name}</h2>
          {swapped && (
            <span className="rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-violet-glow">
              alternativa
            </span>
          )}
        </div>

        <LottiePlaceholder
          muscles={exercise.primaryMuscles}
          exerciseName={exercise.name}
        />

        <CrowdedButton
          swapped={swapped}
          alternativeName={
            swapped ? baseExercise.name : alternative.name
          }
          onToggle={() => setSwapped((s) => !s)}
        />

        <ExerciseInstructions steps={exercise.instructions} />

        <SetLogger
          exerciseId={exercise.id}
          defaultSets={exercise.defaultSets}
          defaultReps={exercise.defaultReps}
          bodyweight={exercise.equipment === "bodyweight"}
        />
      </article>

      {/* Navigation between exercises in the track */}
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
            href="/"
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
    </section>
  );
}
