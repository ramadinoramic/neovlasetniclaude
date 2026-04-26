"use client";

import { cn } from "@/lib/cn";

interface EnergySliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const TICKS = [1, 2, 3, 4, 5];

export function EnergySlider({
  value,
  onChange,
  min = 1,
  max = 5,
}: EnergySliderProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Razina energije"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="nf-slider"
      />
      <div className="flex justify-between px-1">
        {TICKS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            aria-label={`Postavi razinu ${t}`}
            className={cn(
              "h-7 w-7 rounded-full text-xs font-medium transition",
              t === value
                ? "bg-mint text-charcoal-deep shadow-glow-mint"
                : "bg-charcoal-soft text-ash-400 hover:text-ash-200"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[11px] uppercase tracking-widest text-ash-400">
        <span>Mrtav puhao</span>
        <span>Pun pogon</span>
      </div>
    </div>
  );
}
