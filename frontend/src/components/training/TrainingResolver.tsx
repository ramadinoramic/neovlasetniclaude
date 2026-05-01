"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getExercise } from "@/data/exercises";
import {
  SafeSpaceTraining,
  type SessionStep,
} from "@/components/training/SafeSpaceTraining";
import { WIZARD_STORAGE_KEY } from "@/components/wizard/WeekendWizard";

interface StoredWizardSession {
  exerciseIds: string[];
  rationale: string;
  ts: number;
}

export function TrainingResolver() {
  const [steps, setSteps] = useState<SessionStep[] | null>(null);
  const [rationale, setRationale] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(WIZARD_STORAGE_KEY);
    if (!raw) {
      setError("Wizard sesija nije pronađena. Krenimo ispočetka.");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredWizardSession;
      if (!parsed.exerciseIds || parsed.exerciseIds.length === 0) {
        setError("Sesija je prazna.");
        return;
      }
      const built: SessionStep[] = parsed.exerciseIds.map((id) => {
        const ex = getExercise(id);
        return {
          exerciseId: id,
          sets: ex.defaultSets,
          reps: ex.defaultReps,
          restSec: ex.restSec,
        };
      });
      setSteps(built);
      setRationale(parsed.rationale);
    } catch {
      setError("Sesija je oštećena.");
    }
  }, []);

  if (error) {
    return (
      <section className="flex flex-col gap-3 animate-fade-in">
        <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
          Vikendaš
        </span>
        <h1 className="text-2xl font-semibold">Hm.</h1>
        <p className="text-sm text-ash-200">{error}</p>
        <Link
          href="/wizard"
          className="mt-2 inline-block rounded-xl bg-mint px-4 py-3 text-center text-sm font-medium text-charcoal-deep hover:bg-mint-glow"
        >
          Pokreni wizard
        </Link>
      </section>
    );
  }

  if (!steps) {
    return (
      <section className="animate-pulse text-sm text-ash-400">
        Slazem ti trening…
      </section>
    );
  }

  return (
    <SafeSpaceTraining
      title="Vikendaš · Trening"
      subtitle={rationale}
      steps={steps}
      exitHref="/"
    />
  );
}
