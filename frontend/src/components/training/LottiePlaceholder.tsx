"use client";

import type { MotionPattern, MuscleGroup } from "@/data/exercises";
import { MUSCLE_LABEL } from "@/data/exercises";
import { cn } from "@/lib/cn";

/**
 * Privremeni placeholder za 3D Lottie animaciju.
 *
 * Stilski cilj: minimalistička, smirena anatomska ilustracija — glatke bezier
 * krivulje, blagi vertikalni gradijent za dubinu, mekani glow na aktivnim
 * mišićima. Ton: medicinski/wellness, ne kreten iz sale.
 *
 * Animacije (CSS keyframes u globals.css, .nf-motion-*) drže `data-anim`
 * grupe u pokretu. Aktivni mišići pulsiraju mintom (data-active="true").
 *
 * Kad pravi 3D Lottie JSON-i budu spremni, cijela ova komponenta se
 * zamijeni @lottiefiles/react-lottie-player Player-om.
 */

interface LottiePlaceholderProps {
  muscles: MuscleGroup[];
  motion: MotionPattern;
  exerciseName: string;
  className?: string;
}

const ACTIVE_FILL = "fill-[url(#nf-active)]";
const IDLE_FILL = "fill-[url(#nf-idle)]";
const STROKE = "stroke-ash-600/35";

export function LottiePlaceholder({
  muscles,
  motion,
  exerciseName,
  className,
}: LottiePlaceholderProps) {
  const isActive = (m: MuscleGroup) =>
    muscles.includes(m) || muscles.includes("full_body");

  const muscleClass = (m: MuscleGroup) =>
    cn(isActive(m) ? ACTIVE_FILL : IDLE_FILL, STROKE);

  // Active muscle group labels for the chip row (hide "full_body" if it is
  // accompanied by a more specific group).
  const visibleLabels = muscles
    .filter((m) => m !== "full_body" || muscles.length === 1)
    .map((m) => MUSCLE_LABEL[m]);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-2xl border border-charcoal-line bg-gradient-to-b from-charcoal-soft to-charcoal-deep",
        className
      )}
      role="img"
      aria-label={`Vizualni prikaz vježbe: ${exerciseName}`}
    >
      {/* Subtle ambient grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      {/* Active muscle chips */}
      <div className="z-10 flex w-full flex-wrap justify-center gap-1.5 px-4 pt-3">
        {visibleLabels.map((label) => (
          <span
            key={label}
            className="rounded-full border border-mint/30 bg-mint/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-mint"
          >
            {label}
          </span>
        ))}
      </div>

      <svg
        viewBox="0 0 220 380"
        className={cn(
          "nf-svg relative z-10 h-72 w-auto py-2",
          `nf-motion-${motion}`
        )}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Idle body fill — vertical depth gradient */}
          <linearGradient id="nf-idle" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#3A3A3A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1F1F1F" stopOpacity="0.95" />
          </linearGradient>

          {/* Active muscle fill — mint with vertical falloff */}
          <linearGradient id="nf-active" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#A6F0CE" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#56B894" stopOpacity="0.65" />
          </linearGradient>

          {/* Soft glow filter for active muscles */}
          <filter id="nf-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Floor shadow */}
          <radialGradient id="nf-floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Floor shadow */}
        <ellipse cx={110} cy={368} rx={55} ry={6} fill="url(#nf-floor)" />

        <g strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round">
          {/* ── HEAD + NECK ───────────────────────────────────────────── */}
          <g data-anim="head" style={{ ["--origin" as string]: "50% 100%" }}>
            <ellipse
              cx={110}
              cy={38}
              rx={20}
              ry={24}
              className={cn(IDLE_FILL, STROKE)}
            />
            {/* Neck */}
            <path
              d="M 100,60 Q 110,68 120,60 L 120,72 Q 110,74 100,72 Z"
              className={cn(IDLE_FILL, STROKE)}
            />
          </g>

          {/* ── LEFT ARM ─────────────────────────────────────────────── */}
          <g
            data-anim="upperarm-l"
            style={{ ["--origin" as string]: "75% 0%" }}
          >
            {/* Upper arm (biceps/triceps) */}
            <path
              d="M 70,76
                 Q 58,78 56,92
                 L 52,160
                 Q 56,166 64,166
                 L 72,166
                 Q 76,160 76,150
                 L 78,92
                 Q 78,78 70,76 Z"
              className={muscleClass("arms")}
              data-active={isActive("arms")}
            />
            <g data-anim="forearm-l" style={{ ["--origin" as string]: "50% 0%" }}>
              {/* Forearm + hand */}
              <path
                d="M 56,166
                   Q 52,170 52,180
                   L 48,238
                   Q 50,250 58,252
                   L 70,252
                   Q 76,248 76,240
                   L 76,180
                   Q 76,170 72,166 Z"
                className={cn(IDLE_FILL, STROKE)}
              />
            </g>
          </g>

          {/* ── RIGHT ARM ────────────────────────────────────────────── */}
          <g
            data-anim="upperarm-r"
            style={{ ["--origin" as string]: "25% 0%" }}
          >
            <path
              d="M 150,76
                 Q 162,78 164,92
                 L 168,160
                 Q 164,166 156,166
                 L 148,166
                 Q 144,160 144,150
                 L 142,92
                 Q 142,78 150,76 Z"
              className={muscleClass("arms")}
              data-active={isActive("arms")}
            />
            <g data-anim="forearm-r" style={{ ["--origin" as string]: "50% 0%" }}>
              <path
                d="M 164,166
                   Q 168,170 168,180
                   L 172,238
                   Q 170,250 162,252
                   L 150,252
                   Q 144,248 144,240
                   L 144,180
                   Q 144,170 148,166 Z"
                className={cn(IDLE_FILL, STROKE)}
              />
            </g>
          </g>

          {/* ── TORSO (animates as a whole for hinge/squat/flexion/breathe) */}
          <g data-anim="torso">
            {/* Trunk silhouette — smooth curves, broader shoulders, narrow waist, hip flare */}
            <path
              d="M 78,72
                 C 70,72 68,86 70,100
                 C 72,118 80,124 86,128
                 C 88,154 88,168 84,180
                 C 80,196 76,202 76,212
                 L 144,212
                 C 144,202 140,196 136,180
                 C 132,168 132,154 134,128
                 C 140,124 148,118 150,100
                 C 152,86 150,72 142,72 Z"
              className={cn(IDLE_FILL, STROKE)}
            />

            {/* Shoulders (anterior deltoid) — soft caps */}
            <path
              d="M 78,72 C 68,72 64,86 66,100 Q 76,98 84,90 Z"
              className={muscleClass("shoulders")}
              data-active={isActive("shoulders")}
              filter={isActive("shoulders") ? "url(#nf-glow)" : undefined}
            />
            <path
              d="M 142,72 C 152,72 156,86 154,100 Q 144,98 136,90 Z"
              className={muscleClass("shoulders")}
              data-active={isActive("shoulders")}
              filter={isActive("shoulders") ? "url(#nf-glow)" : undefined}
            />

            {/* Chest (pectoralis) — single smooth shield, NOT rectangles */}
            <path
              d="M 84,86
                 Q 110,80 136,86
                 Q 140,108 130,124
                 Q 110,130 90,124
                 Q 80,108 84,86 Z"
              className={muscleClass("chest")}
              data-active={isActive("chest")}
              filter={isActive("chest") ? "url(#nf-glow)" : undefined}
            />
            {/* Pectoral midline */}
            <path
              d="M 110,84 L 110,128"
              fill="none"
              className="stroke-ash-600/40"
              strokeWidth={1}
            />

            {/* Abs (rectus abdominis) — anatomical shield with subtle linea alba */}
            <path
              d="M 92,134
                 Q 110,130 128,134
                 L 126,200
                 Q 110,206 94,200 Z"
              className={muscleClass("core")}
              data-active={isActive("core")}
              filter={isActive("core") ? "url(#nf-glow)" : undefined}
            />
            {/* Linea alba */}
            <path
              d="M 110,132 L 110,202"
              fill="none"
              className="stroke-ash-600/30"
              strokeWidth={0.8}
            />
            {/* Subtle horizontal tendinous lines (only when active) */}
            {isActive("core") && (
              <g
                fill="none"
                className="stroke-mint/30"
                strokeWidth={0.8}
              >
                <path d="M 96,150 Q 110,148 124,150" />
                <path d="M 96,168 Q 110,166 124,168" />
                <path d="M 96,186 Q 110,184 124,186" />
              </g>
            )}

            {/* Back marker — subtle indicator on upper trunk (front view) */}
            {isActive("back") && (
              <g data-active="true" filter="url(#nf-glow)">
                <ellipse
                  cx={110}
                  cy={154}
                  rx={26}
                  ry={6}
                  className="fill-mint/35"
                />
                <text
                  x={110}
                  y={158}
                  textAnchor="middle"
                  className="fill-mint text-[8px] font-semibold tracking-widest"
                  fontFamily="system-ui"
                >
                  LEĐA
                </text>
              </g>
            )}
          </g>

          {/* ── LEFT THIGH + CALF ─────────────────────────────────────── */}
          <g data-anim="thigh-l" style={{ ["--origin" as string]: "50% 0%" }}>
            {/* Thigh */}
            <path
              d="M 80,212
                 Q 74,220 74,236
                 L 78,288
                 Q 84,294 94,294
                 L 104,294
                 Q 108,290 108,280
                 L 108,216
                 Z"
              className={muscleClass("quads")}
              data-active={isActive("quads")}
              filter={isActive("quads") ? "url(#nf-glow)" : undefined}
            />
            {/* Hamstring marker — small dot on rear-side hint */}
            {isActive("hamstrings") && (
              <circle
                cx={86}
                cy={258}
                r={3}
                className="fill-mint/70 stroke-mint"
                data-active="true"
                filter="url(#nf-glow)"
              />
            )}
            <g data-anim="calf-l" style={{ ["--origin" as string]: "50% 0%" }}>
              {/* Calf + foot */}
              <path
                d="M 80,294
                   Q 78,300 78,312
                   L 80,346
                   Q 84,352 92,352
                   L 102,352
                   Q 106,346 106,334
                   L 106,302
                   Q 102,294 98,294 Z"
                className={muscleClass("calves")}
                data-active={isActive("calves")}
                filter={isActive("calves") ? "url(#nf-glow)" : undefined}
              />
              {/* Foot hint */}
              <path
                d="M 78,352 Q 76,358 80,360 L 106,360 Q 110,358 108,352 Z"
                className={cn(IDLE_FILL, STROKE)}
              />
            </g>
          </g>

          {/* ── RIGHT THIGH + CALF ────────────────────────────────────── */}
          <g data-anim="thigh-r" style={{ ["--origin" as string]: "50% 0%" }}>
            <path
              d="M 140,212
                 Q 146,220 146,236
                 L 142,288
                 Q 136,294 126,294
                 L 116,294
                 Q 112,290 112,280
                 L 112,216
                 Z"
              className={muscleClass("quads")}
              data-active={isActive("quads")}
              filter={isActive("quads") ? "url(#nf-glow)" : undefined}
            />
            {isActive("hamstrings") && (
              <circle
                cx={134}
                cy={258}
                r={3}
                className="fill-mint/70 stroke-mint"
                data-active="true"
                filter="url(#nf-glow)"
              />
            )}
            <g data-anim="calf-r" style={{ ["--origin" as string]: "50% 0%" }}>
              <path
                d="M 140,294
                   Q 142,300 142,312
                   L 140,346
                   Q 136,352 128,352
                   L 118,352
                   Q 114,346 114,334
                   L 114,302
                   Q 118,294 122,294 Z"
                className={muscleClass("calves")}
                data-active={isActive("calves")}
                filter={isActive("calves") ? "url(#nf-glow)" : undefined}
              />
              <path
                d="M 142,352 Q 144,358 140,360 L 114,360 Q 110,358 112,352 Z"
                className={cn(IDLE_FILL, STROKE)}
              />
            </g>
          </g>
        </g>
      </svg>

      {/* Top-edge soft mint highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-mint/[0.04] to-transparent" />
    </div>
  );
}
