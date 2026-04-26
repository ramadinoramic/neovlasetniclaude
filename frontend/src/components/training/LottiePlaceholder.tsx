"use client";

import type { MuscleGroup } from "@/data/exercises";
import { cn } from "@/lib/cn";

/**
 * Privremeni placeholder za 3D Lottie animaciju.
 * Renderira neutralnu prozirnu siluetu (front view) s označenim
 * primarnim mišićima u mint boji. Bez bildanih proporcija.
 *
 * Kada Lottie JSON datoteke budu spremne, ova komponenta se zamijeni
 * @lottiefiles/react-lottie-player Player-om, a `lottieFile` će se učitavati.
 */

interface LottiePlaceholderProps {
  muscles: MuscleGroup[];
  /** Display name — only for accessibility. */
  exerciseName: string;
  className?: string;
}

const ACTIVE = "fill-mint/45 stroke-mint";
const IDLE = "fill-charcoal-line/40 stroke-ash-600/60";

export function LottiePlaceholder({
  muscles,
  exerciseName,
  className,
}: LottiePlaceholderProps) {
  const isActive = (m: MuscleGroup) =>
    muscles.includes(m) || muscles.includes("full_body");

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl border border-charcoal-line bg-gradient-to-b from-charcoal-soft to-charcoal-deep p-6",
        className
      )}
      role="img"
      aria-label={`Vizualni prikaz vježbe: ${exerciseName}`}
    >
      <span className="absolute left-3 top-3 rounded-full border border-charcoal-line bg-charcoal-deep/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-ash-400">
        3D · placeholder
      </span>

      <svg
        viewBox="0 0 200 360"
        className="h-72 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle outline — translucent body */}
        <g strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round">
          {/* Head */}
          <circle
            cx={100}
            cy={32}
            r={20}
            className="fill-charcoal-line/40 stroke-ash-600/60"
          />
          {/* Neck */}
          <path
            d="M92 50 L92 62 L108 62 L108 50 Z"
            className="fill-charcoal-line/40 stroke-ash-600/60"
          />

          {/* Torso outline */}
          <path
            d="M70 64 Q60 72 60 96 L60 158 Q60 172 68 178 L132 178 Q140 172 140 158 L140 96 Q140 72 130 64 Z"
            className="fill-charcoal-line/30 stroke-ash-600/60"
          />

          {/* Chest */}
          <path
            d="M74 78 Q86 70 100 70 Q114 70 126 78 L126 110 Q113 118 100 118 Q87 118 74 110 Z"
            className={cn(isActive("chest") ? ACTIVE : IDLE)}
            strokeWidth={1.5}
          />
          {/* Shoulders (deltoids) */}
          <path
            d="M58 72 Q52 86 56 100 Q66 96 72 86 Z"
            className={cn(isActive("shoulders") ? ACTIVE : IDLE)}
          />
          <path
            d="M142 72 Q148 86 144 100 Q134 96 128 86 Z"
            className={cn(isActive("shoulders") ? ACTIVE : IDLE)}
          />

          {/* Arms (biceps/triceps grouped) */}
          <path
            d="M48 96 L42 158 L52 162 L60 100 Z"
            className={cn(isActive("arms") ? ACTIVE : IDLE)}
          />
          <path
            d="M152 96 L158 158 L148 162 L140 100 Z"
            className={cn(isActive("arms") ? ACTIVE : IDLE)}
          />
          {/* Forearms */}
          <path
            d="M40 162 L36 212 L48 214 L52 164 Z"
            className="fill-charcoal-line/30 stroke-ash-600/60"
          />
          <path
            d="M160 162 L164 212 L152 214 L148 164 Z"
            className="fill-charcoal-line/30 stroke-ash-600/60"
          />

          {/* Core (abs) */}
          <path
            d="M82 122 L118 122 L116 170 L84 170 Z"
            className={cn(isActive("core") ? ACTIVE : IDLE)}
          />

          {/* Back marker (since this is front view, we show a subtle hint dot) */}
          {isActive("back") && (
            <g>
              <circle
                cx={100}
                cy={132}
                r={5}
                className="fill-mint/70 stroke-mint"
              />
              <text
                x={108}
                y={136}
                className="fill-mint text-[8px]"
                fontFamily="system-ui"
              >
                back
              </text>
            </g>
          )}

          {/* Hips / glutes hint */}
          <path
            d="M68 178 L132 178 L136 200 L64 200 Z"
            className={cn(isActive("glutes") ? ACTIVE : IDLE)}
          />

          {/* Quads */}
          <path
            d="M68 200 L60 280 L88 282 L94 202 Z"
            className={cn(isActive("quads") ? ACTIVE : IDLE)}
          />
          <path
            d="M132 200 L140 280 L112 282 L106 202 Z"
            className={cn(isActive("quads") ? ACTIVE : IDLE)}
          />

          {/* Hamstrings hint marker */}
          {isActive("hamstrings") && (
            <>
              <circle cx={78} cy={240} r={4} className="fill-mint/70 stroke-mint" />
              <circle cx={122} cy={240} r={4} className="fill-mint/70 stroke-mint" />
            </>
          )}

          {/* Calves */}
          <path
            d="M64 282 L60 340 L84 340 L86 284 Z"
            className={cn(isActive("calves") ? ACTIVE : IDLE)}
          />
          <path
            d="M136 282 L140 340 L116 340 L114 284 Z"
            className={cn(isActive("calves") ? ACTIVE : IDLE)}
          />
        </g>
      </svg>

      {/* Soft mint glow when any muscle is active */}
      <div className="pointer-events-none absolute inset-0 bg-mint/[0.03] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
    </div>
  );
}
