"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ALL_EXERCISES,
  EQUIPMENT_LABEL,
  MUSCLE_LABEL,
  type Equipment,
  type Exercise,
  type MuscleGroup,
} from "@/data/exercises";
import { cn } from "@/lib/cn";

interface ExercisePickerProps {
  open: boolean;
  currentExerciseId: string;
  onClose: () => void;
  onPick: (id: string) => void;
}

/** Coarse muscle filters — keep the chip row short. */
const MUSCLE_FILTERS: { id: MuscleGroup; matches: MuscleGroup[] }[] = [
  { id: "chest", matches: ["chest"] },
  {
    id: "shoulders_front",
    matches: ["shoulders_front", "shoulders_side", "shoulders_rear"],
  },
  { id: "biceps", matches: ["biceps", "triceps", "forearms"] },
  { id: "abs", matches: ["abs", "obliques"] },
  { id: "lats", matches: ["lats", "traps", "lower_back"] },
  { id: "glutes", matches: ["glutes"] },
  { id: "quads", matches: ["quads", "hamstrings", "adductors"] },
  { id: "calves", matches: ["calves"] },
];

const FILTER_GROUP_LABEL: Record<string, string> = {
  chest: "Prsa",
  shoulders_front: "Ramena",
  biceps: "Ruke",
  abs: "Trbuh",
  lats: "Leđa",
  glutes: "Glutei",
  quads: "Noge",
  calves: "Listovi",
};

const EQUIPMENT_FILTERS: Equipment[] = [
  "bodyweight",
  "barbell",
  "dumbbell",
  "kettlebell",
  "machine",
  "mat",
];

export function ExercisePicker({
  open,
  currentExerciseId,
  onClose,
  onPick,
}: ExercisePickerProps) {
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | null>(null);
  const [equipFilter, setEquipFilter] = useState<Equipment | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    return ALL_EXERCISES.filter((ex) => {
      if (muscleFilter) {
        const group = MUSCLE_FILTERS.find((g) => g.id === muscleFilter);
        if (!group) return false;
        const muscles = [...ex.primaryMuscles, ...ex.secondaryMuscles];
        if (!muscles.some((m) => group.matches.includes(m))) {
          if (!muscles.includes("full_body")) return false;
        }
      }
      if (equipFilter && ex.equipment !== equipFilter) return false;
      return true;
    });
  }, [muscleFilter, equipFilter]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Odabir vježbe"
    >
      <button
        type="button"
        aria-label="Zatvori"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal-deep/80 backdrop-blur-sm"
      />
      <div className="relative flex max-h-[85vh] w-full max-w-screen-sm flex-col rounded-t-3xl border border-charcoal-line bg-charcoal-soft shadow-2xl animate-fade-in">
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-charcoal-line" />
        </div>
        <header className="flex items-center justify-between px-5 pb-3 pt-3">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
              Sve vježbe
            </span>
            <h2 className="text-lg font-semibold text-ash-50">
              Biraj sam. Bez pritiska.
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori"
            className="h-9 w-9 rounded-full border border-charcoal-line text-ash-200 transition hover:border-ash-200"
          >
            ×
          </button>
        </header>

        <div className="flex flex-col gap-2 border-b border-charcoal-line px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <FilterChip
              label="Sve mišiće"
              active={muscleFilter === null}
              onClick={() => setMuscleFilter(null)}
            />
            {MUSCLE_FILTERS.map((g) => (
              <FilterChip
                key={g.id}
                label={FILTER_GROUP_LABEL[g.id] ?? MUSCLE_LABEL[g.id]}
                active={muscleFilter === g.id}
                onClick={() => setMuscleFilter(g.id)}
              />
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <FilterChip
              label="Sva oprema"
              active={equipFilter === null}
              onClick={() => setEquipFilter(null)}
              tone="violet"
            />
            {EQUIPMENT_FILTERS.map((e) => (
              <FilterChip
                key={e}
                label={EQUIPMENT_LABEL[e]}
                active={equipFilter === e}
                onClick={() => setEquipFilter(e)}
                tone="violet"
              />
            ))}
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto px-5 py-3">
          {filtered.length === 0 ? (
            <li className="py-10 text-center text-sm text-ash-400">
              Ništa ne paše. Probaj manje filtera.
            </li>
          ) : (
            filtered.map((ex) => (
              <ExerciseRow
                key={ex.id}
                ex={ex}
                isCurrent={ex.id === currentExerciseId}
                onPick={(id) => {
                  onPick(id);
                  onClose();
                }}
              />
            ))
          )}
        </ul>
        <div className="h-[env(safe-area-inset-bottom,0)]" />
      </div>
    </div>
  );
}

function ExerciseRow({
  ex,
  isCurrent,
  onPick,
}: {
  ex: Exercise;
  isCurrent: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onPick(ex.id)}
        disabled={isCurrent}
        className={cn(
          "mb-2 flex w-full items-center justify-between gap-3 rounded-xl border bg-charcoal-deep/40 p-3 text-left transition",
          isCurrent
            ? "border-mint/40 opacity-50"
            : "border-charcoal-line hover:border-mint hover:shadow-glow-mint"
        )}
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-ash-50">{ex.name}</span>
          <span className="flex flex-wrap gap-1 text-[10px] uppercase tracking-widest text-ash-400">
            <span>{EQUIPMENT_LABEL[ex.equipment]}</span>
            <span>·</span>
            <span>
              {ex.primaryMuscles
                .slice(0, 2)
                .map((m) => MUSCLE_LABEL[m])
                .join(", ")}
            </span>
          </span>
        </div>
        <span
          className={cn(
            "shrink-0 text-xs",
            isCurrent ? "text-mint" : "text-ash-400"
          )}
        >
          {isCurrent ? "trenutna" : "→"}
        </span>
      </button>
    </li>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: "mint" | "violet";
}

function FilterChip({ label, active, onClick, tone = "mint" }: FilterChipProps) {
  const activeStyle =
    tone === "mint"
      ? "border-mint bg-mint text-charcoal-deep"
      : "border-violet bg-violet text-ash-50";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? activeStyle
          : "border-charcoal-line bg-charcoal-deep text-ash-400 hover:border-ash-200 hover:text-ash-200"
      )}
    >
      {label}
    </button>
  );
}
