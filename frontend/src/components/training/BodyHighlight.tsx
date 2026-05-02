"use client";

import { useState } from "react";
import type { MuscleGroup } from "@/data/exercises";
import { MUSCLE_LABEL } from "@/data/exercises";
import { cn } from "@/lib/cn";

/**
 * Body highlight overlay.
 *
 * Renderira dvije slike (front + back) iz /public/anatomy/ i overlaja
 * pozicionirane glow zone preko mišića koji su trenutno aktivni.
 *
 * Ako slike ne postoje, fallback je minimalan SVG silueta placeholder.
 *
 * Koordinate u ZONES su u % od slike — dimenzionirane za standardnu
 * anatomy chart sliku (portrait, T-pose, body ispunjava ~85% canvas-a).
 * Ako tvoja slika ima drugačije proporcije, dotjeraj % vrijednosti.
 */

interface BodyHighlightProps {
  primary: MuscleGroup[];
  secondary?: MuscleGroup[];
  exerciseName: string;
  className?: string;
}

type Side = "front" | "back";
type Intensity = "primary" | "secondary";

interface Zone {
  side: Side;
  /** % from top of image */
  top: number;
  /** % from left of image */
  left: number;
  /** Width as % of image */
  w: number;
  /** Height as % of image */
  h: number;
}

/**
 * Anatomical zones (% coordinates).
 * Calibrated for `front.png` and `back.png` from /public/anatomy/
 * (1254×1254 square, body fills ~95% of frame vertically, head at top
 * y≈5%, feet at y≈96%, shoulder line y≈17%).
 */
const ZONES: Partial<Record<MuscleGroup, Zone[]>> = {
  // ── FRONT ───────────────────────────────────────────────────────────────
  chest: [
    { side: "front", top: 21, left: 35, w: 14, h: 11 },
    { side: "front", top: 21, left: 51, w: 14, h: 11 },
  ],
  shoulders_front: [
    { side: "front", top: 17, left: 24, w: 12, h: 9 },
    { side: "front", top: 17, left: 64, w: 12, h: 9 },
  ],
  shoulders_side: [
    { side: "front", top: 19, left: 17, w: 8, h: 10 },
    { side: "front", top: 19, left: 75, w: 8, h: 10 },
  ],
  biceps: [
    { side: "front", top: 26, left: 17, w: 9, h: 13 },
    { side: "front", top: 26, left: 74, w: 9, h: 13 },
  ],
  forearms: [
    { side: "front", top: 38, left: 11, w: 9, h: 14 },
    { side: "front", top: 38, left: 80, w: 9, h: 14 },
    { side: "back", top: 38, left: 11, w: 9, h: 14 },
    { side: "back", top: 38, left: 80, w: 9, h: 14 },
  ],
  abs: [{ side: "front", top: 32, left: 41, w: 18, h: 16 }],
  obliques: [
    { side: "front", top: 32, left: 33, w: 8, h: 15 },
    { side: "front", top: 32, left: 59, w: 8, h: 15 },
  ],
  quads: [
    { side: "front", top: 55, left: 30, w: 18, h: 17 },
    { side: "front", top: 55, left: 52, w: 18, h: 17 },
  ],
  adductors: [
    { side: "front", top: 56, left: 44, w: 6, h: 16 },
    { side: "front", top: 56, left: 50, w: 6, h: 16 },
  ],
  // ── BACK ────────────────────────────────────────────────────────────────
  traps: [{ side: "back", top: 17, left: 36, w: 28, h: 11 }],
  shoulders_rear: [
    { side: "back", top: 17, left: 24, w: 12, h: 9 },
    { side: "back", top: 17, left: 64, w: 12, h: 9 },
  ],
  triceps: [
    { side: "back", top: 26, left: 17, w: 9, h: 13 },
    { side: "back", top: 26, left: 74, w: 9, h: 13 },
  ],
  lats: [
    { side: "back", top: 26, left: 27, w: 13, h: 16 },
    { side: "back", top: 26, left: 60, w: 13, h: 16 },
  ],
  lower_back: [{ side: "back", top: 37, left: 40, w: 20, h: 9 }],
  glutes: [
    { side: "back", top: 46, left: 30, w: 18, h: 13 },
    { side: "back", top: 46, left: 52, w: 18, h: 13 },
  ],
  hamstrings: [
    { side: "back", top: 58, left: 30, w: 18, h: 14 },
    { side: "back", top: 58, left: 52, w: 18, h: 14 },
  ],
  // ── BOTH SIDES ──────────────────────────────────────────────────────────
  calves: [
    { side: "front", top: 75, left: 33, w: 12, h: 14 },
    { side: "front", top: 75, left: 55, w: 12, h: 14 },
    { side: "back", top: 75, left: 33, w: 12, h: 14 },
    { side: "back", top: 75, left: 55, w: 12, h: 14 },
  ],
};

const FULL_BODY_ZONES: Zone[] = [
  { side: "front", top: 8, left: 22, w: 56, h: 88 },
  { side: "back", top: 8, left: 22, w: 56, h: 88 },
];

export function BodyHighlight({
  primary,
  secondary = [],
  exerciseName,
  className,
}: BodyHighlightProps) {
  const labelChips = primary
    .filter((m) => m !== "full_body" || primary.length === 1)
    .map((m) => MUSCLE_LABEL[m]);

  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-charcoal-line bg-gradient-to-b from-charcoal-soft to-charcoal-deep p-4",
        className
      )}
      role="img"
      aria-label={`Anatomski prikaz mišića za vježbu: ${exerciseName}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.25em] text-ash-400">
          Anatomski prikaz
        </span>
        <span className="text-[10px] uppercase tracking-widest text-ash-600">
          Front · Back
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <BodySide side="front" primary={primary} secondary={secondary} />
        <BodySide side="back" primary={primary} secondary={secondary} />
      </div>

      {labelChips.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {labelChips.map((label) => (
            <span
              key={label}
              className="rounded-full border border-mint/30 bg-mint/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-mint"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface BodySideProps {
  side: Side;
  primary: MuscleGroup[];
  secondary: MuscleGroup[];
}

function BodySide({ side, primary, secondary }: BodySideProps) {
  const [imgFailed, setImgFailed] = useState(false);

  // Collect zones for this side
  const zones: { zone: Zone; intensity: Intensity }[] = [];
  for (const muscle of primary) {
    if (muscle === "full_body") {
      FULL_BODY_ZONES.filter((z) => z.side === side).forEach((z) =>
        zones.push({ zone: z, intensity: "primary" })
      );
      continue;
    }
    (ZONES[muscle] ?? [])
      .filter((z) => z.side === side)
      .forEach((z) => zones.push({ zone: z, intensity: "primary" }));
  }
  for (const muscle of secondary) {
    if (muscle === "full_body") continue;
    (ZONES[muscle] ?? [])
      .filter((z) => z.side === side)
      .forEach((z) => zones.push({ zone: z, intensity: "secondary" }));
  }

  return (
    <div className="relative flex justify-center">
      <span className="absolute left-1 top-1 z-20 text-[9px] uppercase tracking-widest text-ash-600">
        {side}
      </span>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-charcoal-deep/60">
        {!imgFailed ? (
          <img
            src={`/anatomy/${side}.png`}
            alt={`Anatomy ${side} view`}
            className="absolute inset-0 h-full w-full object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <SilhouetteFallback side={side} />
        )}

        {/* Highlight zones */}
        {zones.map(({ zone, intensity }, i) => (
          <div
            key={i}
            className="pointer-events-none absolute rounded-full mix-blend-screen"
            style={{
              top: `${zone.top}%`,
              left: `${zone.left}%`,
              width: `${zone.w}%`,
              height: `${zone.h}%`,
              background:
                intensity === "primary"
                  ? "radial-gradient(ellipse at center, rgba(124,227,183,0.85) 0%, rgba(124,227,183,0.45) 45%, transparent 80%)"
                  : "radial-gradient(ellipse at center, rgba(168,146,232,0.65) 0%, rgba(168,146,232,0.3) 45%, transparent 80%)",
              filter: "blur(4px)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Minimalna placeholder silueta. Renderira se kad slika nedostaje
 * (`/public/anatomy/{front,back}.png` nisu dropani).
 */
function SilhouetteFallback({ side }: { side: Side }) {
  return (
    <svg
      viewBox="0 0 200 300"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`silhouette-${side}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#3A3A3A" />
          <stop offset="100%" stopColor="#202020" />
        </linearGradient>
      </defs>
      {/* Simple body outline */}
      <path
        d="M 100,12
           C 88,12 78,22 78,38
           C 78,50 84,58 92,62
           L 92,72
           C 78,74 64,82 60,98
           L 56,158
           C 56,168 64,172 72,170
           L 76,128
           L 80,128
           L 76,170
           L 72,250
           C 72,260 78,266 86,264
           L 96,180
           L 100,180
           L 100,266
           L 104,266
           L 104,180
           L 108,180
           L 118,264
           C 126,266 132,260 132,250
           L 128,170
           L 124,128
           L 128,128
           L 132,170
           C 140,172 148,168 148,158
           L 144,98
           C 140,82 126,74 112,72
           L 112,62
           C 120,58 126,50 126,38
           C 126,22 116,12 104,12 Z"
        fill={`url(#silhouette-${side})`}
        stroke="#444"
        strokeWidth={0.8}
      />
      <text
        x="100"
        y="290"
        textAnchor="middle"
        className="fill-ash-600 text-[8px]"
        fontFamily="system-ui"
      >
        dropni /public/anatomy/{side}.png
      </text>
    </svg>
  );
}
