"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface LoggedSet {
  reps: string;
  weightKg: number;
  rpe?: number;
  done: boolean;
}

interface SetLoggerProps {
  exerciseId: string;
  defaultSets: number;
  defaultReps: string;
  restSec: number;
  rpe?: number;
  bodyweight?: boolean;
}

const STORAGE_PREFIX = "nf:sets:";

function loadSets(
  exerciseId: string,
  defaultSets: number,
  defaultReps: string
): LoggedSet[] {
  if (typeof window === "undefined") {
    return Array.from({ length: defaultSets }, () => ({
      reps: defaultReps,
      weightKg: 0,
      done: false,
    }));
  }
  const raw = window.localStorage.getItem(STORAGE_PREFIX + exerciseId);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as LoggedSet[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fall through
    }
  }
  return Array.from({ length: defaultSets }, () => ({
    reps: defaultReps,
    weightKg: 0,
    done: false,
  }));
}

export function SetLogger({
  exerciseId,
  defaultSets,
  defaultReps,
  restSec,
  rpe,
  bodyweight = false,
}: SetLoggerProps) {
  const [sets, setSets] = useState<LoggedSet[]>(() =>
    loadSets(exerciseId, defaultSets, defaultReps)
  );

  useEffect(() => {
    setSets(loadSets(exerciseId, defaultSets, defaultReps));
  }, [exerciseId, defaultSets, defaultReps]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_PREFIX + exerciseId,
      JSON.stringify(sets)
    );
  }, [exerciseId, sets]);

  const updateSet = (idx: number, patch: Partial<LoggedSet>) => {
    setSets((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };
  const addSet = () =>
    setSets((prev) => [
      ...prev,
      {
        reps: prev[prev.length - 1]?.reps ?? defaultReps,
        weightKg: prev[prev.length - 1]?.weightKg ?? 0,
        done: false,
      },
    ]);
  const removeSet = (idx: number) =>
    setSets((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  return (
    <section
      aria-label="Unos serija"
      className="rounded-2xl border border-charcoal-line bg-charcoal-soft p-5"
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.25em] text-ash-400">
          Serije
        </h3>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-ash-600">
          <span>
            {sets.filter((s) => s.done).length} / {sets.length}
          </span>
          {restSec > 0 && (
            <>
              <span>·</span>
              <span>Pauza {restSec}s</span>
            </>
          )}
          {rpe !== undefined && (
            <>
              <span>·</span>
              <span className="text-mint">RPE {rpe}</span>
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-2 px-1 pb-2 text-[10px] uppercase tracking-widest text-ash-400">
        <div className="col-span-1">#</div>
        <div className={cn(bodyweight ? "col-span-7" : "col-span-4")}>
          Ponavljanja
        </div>
        {!bodyweight && <div className="col-span-3">Kg</div>}
        <div className="col-span-2">RPE</div>
        <div className="col-span-2 text-right">✓</div>
      </div>

      <ul className="flex flex-col gap-2">
        {sets.map((s, idx) => (
          <li
            key={idx}
            className={cn(
              "grid grid-cols-12 items-center gap-2 rounded-xl border px-2 py-2 transition",
              s.done
                ? "border-mint/40 bg-mint/5"
                : "border-charcoal-line bg-charcoal-deep/40"
            )}
          >
            <div className="col-span-1 text-sm text-ash-400">{idx + 1}</div>
            <div className={cn(bodyweight ? "col-span-7" : "col-span-4")}>
              <input
                type="text"
                inputMode="numeric"
                value={s.reps}
                onChange={(e) => updateSet(idx, { reps: e.target.value })}
                className="w-full rounded-lg border border-charcoal-line bg-charcoal-deep px-2 py-2 text-sm text-ash-50 outline-none focus:border-mint"
              />
            </div>
            {!bodyweight && (
              <div className="col-span-3">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.5}
                  value={s.weightKg}
                  onChange={(e) =>
                    updateSet(idx, { weightKg: Number(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-charcoal-line bg-charcoal-deep px-2 py-2 text-sm text-ash-50 outline-none focus:border-mint"
                />
              </div>
            )}
            <div className="col-span-2">
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={10}
                value={s.rpe ?? ""}
                placeholder={rpe ? String(rpe) : "—"}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  updateSet(idx, {
                    rpe: Number.isFinite(v) && v > 0 ? v : undefined,
                  });
                }}
                className="w-full rounded-lg border border-charcoal-line bg-charcoal-deep px-2 py-2 text-sm text-ash-50 outline-none focus:border-mint"
              />
            </div>
            <div className="col-span-2 flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => updateSet(idx, { done: !s.done })}
                aria-label={s.done ? "Označi kao neodrađeno" : "Označi kao odrađeno"}
                className={cn(
                  "h-8 w-8 rounded-lg border text-sm transition",
                  s.done
                    ? "border-mint bg-mint text-charcoal-deep"
                    : "border-charcoal-line bg-charcoal-deep text-ash-400 hover:border-mint hover:text-mint"
                )}
              >
                ✓
              </button>
              {sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(idx)}
                  aria-label="Ukloni seriju"
                  className="h-8 w-6 rounded-lg text-ash-600 hover:text-ash-200"
                >
                  ×
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={addSet}
        className="mt-3 w-full rounded-xl border border-dashed border-charcoal-line py-2 text-xs uppercase tracking-widest text-ash-400 transition hover:border-mint hover:text-mint"
      >
        + Dodaj seriju
      </button>
    </section>
  );
}
