"use client";

import { cn } from "@/lib/cn";
import type { MoodResponse } from "@/data/moodCopy";

interface MoodCardProps {
  mood: MoodResponse;
  onConfirm: () => void;
}

export function MoodCard({ mood, onConfirm }: MoodCardProps) {
  const accentBorder =
    mood.accent === "mint" ? "border-mint/40" : "border-violet/40";
  const accentGlow =
    mood.accent === "mint" ? "shadow-glow-mint" : "shadow-glow-violet";
  const accentText = mood.accent === "mint" ? "text-mint" : "text-violet-glow";
  const ctaBg =
    mood.accent === "mint"
      ? "bg-mint text-charcoal-deep hover:bg-mint-glow"
      : "bg-violet text-ash-50 hover:bg-violet-glow";

  return (
    <article
      key={mood.level}
      className={cn(
        "animate-fade-in flex flex-col gap-4 rounded-2xl border bg-charcoal-soft p-5",
        accentBorder,
        accentGlow
      )}
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-xs uppercase tracking-widest", accentText)}>
          {mood.label}
        </span>
        <span className="text-xs text-ash-400">Razina {mood.level} / 5</span>
      </div>

      <h2 className="text-xl font-semibold leading-snug text-ash-50">
        {mood.headline}
      </h2>

      <p className="text-sm leading-relaxed text-ash-200">{mood.message}</p>

      <button
        type="button"
        onClick={onConfirm}
        className={cn(
          "mt-2 rounded-xl px-4 py-3 text-sm font-medium transition",
          ctaBg
        )}
      >
        {mood.ctaLabel}
      </button>
    </article>
  );
}
