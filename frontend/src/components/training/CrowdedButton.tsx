"use client";

import { cn } from "@/lib/cn";

interface CrowdedButtonProps {
  /** True if user has already swapped to the alternative — show "vrati original" */
  swapped: boolean;
  alternativeName: string;
  onToggle: () => void;
}

export function CrowdedButton({
  swapped,
  alternativeName,
  onToggle,
}: CrowdedButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group flex w-full items-center justify-between gap-3 rounded-2xl border bg-charcoal-soft p-4 text-left transition",
        swapped
          ? "border-violet/40 hover:border-violet hover:shadow-glow-violet"
          : "border-charcoal-line hover:border-mint hover:shadow-glow-mint"
      )}
      aria-pressed={swapped}
    >
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-widest text-ash-400">
          {swapped ? "Vrati original" : "Gužva je"}
        </span>
        <span className="text-sm font-medium text-ash-50">
          {swapped
            ? "Misliš da si dovoljno hrabar?"
            : `Predlažem: ${alternativeName}`}
        </span>
      </div>
      <span
        aria-hidden
        className={cn(
          "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
          swapped
            ? "border-violet text-violet-glow group-hover:bg-violet group-hover:text-ash-50"
            : "border-mint text-mint group-hover:bg-mint group-hover:text-charcoal-deep"
        )}
      >
        ⇄ Zamijeni
      </span>
    </button>
  );
}
