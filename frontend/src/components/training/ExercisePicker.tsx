"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ALL_EXERCISES,
  EQUIPMENT_LABEL,
  MUSCLE_LABEL,
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

const MUSCLE_FILTERS: MuscleGroup[] = [
  "chest",
  "back",
  "shoulders",
  "arms",
  "core",
  "glutes",
  "quads",
  "hamstrings",
];

const EQUIPMENT_FILTERS: Exercise["equipment"][] = [
  "bodyweight",
  "barbell",
  "dumbbell",
  "mat",
];

export function ExercisePicker({
  open,
  currentExerciseId,
  onClose,
  onPick,
}: ExercisePickerProps) {
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | null>(null);
  const [equipFilter, setEquipFilter] = useState<Exercise["equipment"] | null>(
    null
  );

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Esc
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
      if (
        muscleFilter &&
        !ex.primaryMuscles.includes(muscleFilter) &&
        !ex.primaryMuscles.includes("full_body")
      ) {
        return false;
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
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Zatvori"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal-deep/80 backdrop-blur-sm"
      />

      {/* Sheet */}
      <div className="relative flex max-h-[85vh] w-full max-w-screen-sm flex-col rounded-t-3xl border border-charcoal-line bg-charcoal-soft shadow-2xl animate-fade-in">
        {/* Grab handle */}
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-charcoal-line" />
        </div>

        {/* Header */}
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

        {/* Filters */}
        <div className="flex flex-col gap-2 border-b border-charcoal-line px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <FilterChip
              label="Sve mišiće"
              active={muscleFilter === null}
              onClick={() => setMuscleFilter(null)}
            />
            {MUSCLE_FILTERS.map((m) => (
              <FilterChip
                key={m}
                label={MUSCLE_LABEL[m]}
                active={muscleFilter === m}
                onClick={() => setMuscleFilter(m)}
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

        {/* List */}
        <ul className="flex-1 overflow-y-auto px-5 py-3">
          {filtered.length === 0 ? (
            <li className="py-10 text-center text-sm text-ash-400">
              Ništa ne paše tim filterima. Probaj manje filtera.
            </li>
          ) : (
            filtered.map((ex) => {
              const isCurrent = ex.id === currentExerciseId;
              return (
                <li key={ex.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick(ex.id);
                      onClose();
                    }}
                    disabled={isCurrent}
                    className={cn(
                      "mb-2 flex w-full items-center justify-between gap-3 rounded-xl border bg-charcoal-deep/40 p-3 text-left transition",
                      isCurrent
                        ? "border-mint/40 opacity-50"
                        : "border-charcoal-line hover:border-mint hover:shadow-glow-mint"
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-ash-50">
                        {ex.name}
                      </span>
                      <span className="flex flex-wrap gap-1 text-[10px] uppercase tracking-widest text-ash-400">
                        <span>{EQUIPMENT_LABEL[ex.equipment]}</span>
                        <span>·</span>
                        <span>
                          {ex.primaryMuscles
                            .slice(0, 3)
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
            })
          )}
        </ul>

        {/* Safe area */}
        <div className="h-[env(safe-area-inset-bottom,0)]" />
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: "mint" | "violet";
}

function FilterChip({
  label,
  active,
  onClick,
  tone = "mint",
}: FilterChipProps) {
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
