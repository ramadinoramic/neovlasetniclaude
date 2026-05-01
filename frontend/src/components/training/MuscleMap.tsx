"use client";

import type { MuscleGroup } from "@/data/exercises";
import { MUSCLE_LABEL } from "@/data/exercises";
import { cn } from "@/lib/cn";

/**
 * Anatomical muscle map — front + back views.
 *
 * Replaces the cartoon LottiePlaceholder. Style: clean medical chart, calm,
 * no animations. Active muscles get a bright mint glow; secondary muscles
 * a subtle violet tint; the rest is barely visible.
 */

interface MuscleMapProps {
  primary: MuscleGroup[];
  secondary?: MuscleGroup[];
  exerciseName: string;
  className?: string;
}

type Intensity = "primary" | "secondary" | "idle";

export function MuscleMap({
  primary,
  secondary = [],
  exerciseName,
  className,
}: MuscleMapProps) {
  const intensityFor = (m: MuscleGroup): Intensity => {
    if (primary.includes(m) || primary.includes("full_body")) return "primary";
    if (secondary.includes(m) || secondary.includes("full_body"))
      return "secondary";
    return "idle";
  };

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

      <div className="grid grid-cols-2 gap-3">
        <BodyView side="front" intensityFor={intensityFor} />
        <BodyView side="back" intensityFor={intensityFor} />
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

interface BodyViewProps {
  side: "front" | "back";
  intensityFor: (m: MuscleGroup) => Intensity;
}

function BodyView({ side, intensityFor }: BodyViewProps) {
  return (
    <div className="relative flex justify-center">
      <span className="absolute left-1 top-1 z-10 text-[9px] uppercase tracking-widest text-ash-600">
        {side === "front" ? "front" : "back"}
      </span>
      <svg
        viewBox="0 0 200 380"
        className="h-72 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`mm-idle-${side}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#2E2E2E" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1F1F1F" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id={`mm-primary-${side}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#A6F0CE" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#56B894" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id={`mm-secondary-${side}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#A892E8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#6B54B0" stopOpacity="0.35" />
          </linearGradient>
          <filter
            id={`mm-glow-${side}`}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Body silhouette (outline) */}
        <BodyOutline side={side} />

        {/* Muscle overlays */}
        {side === "front" ? (
          <FrontMuscles intensityFor={intensityFor} />
        ) : (
          <BackMuscles intensityFor={intensityFor} />
        )}
      </svg>
    </div>
  );
}

const OUTLINE_CLASS = "stroke-ash-600/60";

function BodyOutline({ side }: { side: "front" | "back" }) {
  // Same silhouette for both views — neutral, anatomically reasonable.
  return (
    <g
      fill={`url(#mm-idle-${side})`}
      strokeWidth={1}
      className={OUTLINE_CLASS}
      strokeLinejoin="round"
    >
      {/* Head */}
      <ellipse cx={100} cy={32} rx={20} ry={24} />
      {/* Neck */}
      <path d="M 90,52 Q 100,60 110,52 L 110,68 Q 100,70 90,68 Z" />
      {/* Torso */}
      <path
        d="M 70,68
           C 56,68 52,84 56,104
           C 60,120 70,124 76,128
           C 80,154 80,170 76,182
           C 72,198 68,206 68,214
           L 132,214
           C 132,206 128,198 124,182
           C 120,170 120,154 124,128
           C 130,124 140,120 144,104
           C 148,84 144,68 130,68 Z"
      />
      {/* Left arm (upper) */}
      <path
        d="M 56,72
           Q 44,76 42,92
           L 38,164
           Q 40,176 50,178
           L 62,178
           Q 70,172 70,160
           L 70,80
           Q 68,72 56,72 Z"
      />
      {/* Left forearm + hand */}
      <path
        d="M 42,178
           Q 38,184 38,196
           L 36,254
           Q 40,266 50,266
           L 62,266
           Q 68,260 68,250
           L 68,184
           Q 64,178 60,178 Z"
      />
      {/* Right arm (mirror) */}
      <path
        d="M 144,72
           Q 156,76 158,92
           L 162,164
           Q 160,176 150,178
           L 138,178
           Q 130,172 130,160
           L 130,80
           Q 132,72 144,72 Z"
      />
      <path
        d="M 158,178
           Q 162,184 162,196
           L 164,254
           Q 160,266 150,266
           L 138,266
           Q 132,260 132,250
           L 132,184
           Q 136,178 140,178 Z"
      />
      {/* Left thigh */}
      <path
        d="M 72,214
           Q 64,222 64,238
           L 70,300
           Q 76,308 88,308
           L 100,308
           Q 102,302 102,290
           L 102,216 Z"
      />
      {/* Right thigh (mirror) */}
      <path
        d="M 128,214
           Q 136,222 136,238
           L 130,300
           Q 124,308 112,308
           L 100,308
           Q 98,302 98,290
           L 98,216 Z"
      />
      {/* Left calf */}
      <path
        d="M 74,308
           Q 70,316 70,328
           L 72,358
           Q 78,368 88,368
           L 100,368
           Q 102,362 102,350
           L 102,310 Z"
      />
      {/* Right calf */}
      <path
        d="M 126,308
           Q 130,316 130,328
           L 128,358
           Q 122,368 112,368
           L 100,368
           Q 98,362 98,350
           L 98,310 Z"
      />
    </g>
  );
}

interface MuscleProps {
  intensityFor: (m: MuscleGroup) => Intensity;
}

function FrontMuscles({ intensityFor }: MuscleProps) {
  return (
    <g strokeLinejoin="round" strokeWidth={0.8}>
      {/* Pectorals (chest) */}
      <Muscle
        side="front"
        muscle="chest"
        intensity={intensityFor("chest")}
        d="M 78,80 Q 100,74 122,80 Q 124,108 110,120 Q 96,120 78,108 Z"
      />
      <Muscle
        side="front"
        muscle="chest"
        intensity={intensityFor("chest")}
        d="M 78,80 Q 86,76 96,80 Q 96,118 80,114 Q 76,98 78,80 Z"
        partial
      />
      {/* Anterior deltoids */}
      <Muscle
        side="front"
        muscle="shoulders_front"
        intensity={intensityFor("shoulders_front")}
        d="M 56,72 Q 50,84 54,98 Q 64,96 72,86 Z"
      />
      <Muscle
        side="front"
        muscle="shoulders_front"
        intensity={intensityFor("shoulders_front")}
        d="M 144,72 Q 150,84 146,98 Q 136,96 128,86 Z"
      />
      {/* Side deltoids hint */}
      <Muscle
        side="front"
        muscle="shoulders_side"
        intensity={intensityFor("shoulders_side")}
        d="M 44,90 Q 42,104 50,108 L 52,98 Z"
      />
      <Muscle
        side="front"
        muscle="shoulders_side"
        intensity={intensityFor("shoulders_side")}
        d="M 156,90 Q 158,104 150,108 L 148,98 Z"
      />
      {/* Biceps */}
      <Muscle
        side="front"
        muscle="biceps"
        intensity={intensityFor("biceps")}
        d="M 48,108 Q 44,140 50,168 L 60,168 Q 64,140 60,108 Z"
      />
      <Muscle
        side="front"
        muscle="biceps"
        intensity={intensityFor("biceps")}
        d="M 152,108 Q 156,140 150,168 L 140,168 Q 136,140 140,108 Z"
      />
      {/* Forearms (front) */}
      <Muscle
        side="front"
        muscle="forearms"
        intensity={intensityFor("forearms")}
        d="M 42,184 L 40,240 Q 46,250 56,248 L 60,188 Z"
      />
      <Muscle
        side="front"
        muscle="forearms"
        intensity={intensityFor("forearms")}
        d="M 158,184 L 160,240 Q 154,250 144,248 L 140,188 Z"
      />
      {/* Abs */}
      <Muscle
        side="front"
        muscle="abs"
        intensity={intensityFor("abs")}
        d="M 86,128 Q 100,124 114,128 L 113,206 Q 100,212 87,206 Z"
      />
      {/* Linea alba + tendinous lines (decorative when active) */}
      {intensityFor("abs") === "primary" && (
        <g
          fill="none"
          stroke="#1A1A1A"
          strokeOpacity="0.6"
          strokeWidth={0.8}
        >
          <path d="M 100,128 L 100,206" />
          <path d="M 88,148 Q 100,146 112,148" />
          <path d="M 88,168 Q 100,166 112,168" />
          <path d="M 88,188 Q 100,186 112,188" />
        </g>
      )}
      {/* Obliques */}
      <Muscle
        side="front"
        muscle="obliques"
        intensity={intensityFor("obliques")}
        d="M 78,134 Q 76,170 84,200 L 86,200 Q 82,168 84,134 Z"
      />
      <Muscle
        side="front"
        muscle="obliques"
        intensity={intensityFor("obliques")}
        d="M 122,134 Q 124,170 116,200 L 114,200 Q 118,168 116,134 Z"
      />
      {/* Quads (front of thigh) */}
      <Muscle
        side="front"
        muscle="quads"
        intensity={intensityFor("quads")}
        d="M 76,222 Q 70,260 78,300 L 100,302 L 100,222 Z"
      />
      <Muscle
        side="front"
        muscle="quads"
        intensity={intensityFor("quads")}
        d="M 124,222 Q 130,260 122,300 L 100,302 L 100,222 Z"
      />
      {/* Adductors (inner thigh) */}
      <Muscle
        side="front"
        muscle="adductors"
        intensity={intensityFor("adductors")}
        d="M 96,224 Q 94,260 96,298 L 100,298 L 100,224 Z"
      />
      <Muscle
        side="front"
        muscle="adductors"
        intensity={intensityFor("adductors")}
        d="M 104,224 Q 106,260 104,298 L 100,298 L 100,224 Z"
      />
      {/* Calves (front shows tibialis anterior — narrow strip) */}
      <Muscle
        side="front"
        muscle="calves"
        intensity={intensityFor("calves")}
        d="M 78,318 L 80,358 L 92,358 L 90,318 Z"
      />
      <Muscle
        side="front"
        muscle="calves"
        intensity={intensityFor("calves")}
        d="M 122,318 L 120,358 L 108,358 L 110,318 Z"
      />
    </g>
  );
}

function BackMuscles({ intensityFor }: MuscleProps) {
  return (
    <g strokeLinejoin="round" strokeWidth={0.8}>
      {/* Traps */}
      <Muscle
        side="back"
        muscle="traps"
        intensity={intensityFor("traps")}
        d="M 78,72 Q 100,66 122,72 Q 116,98 100,108 Q 84,98 78,72 Z"
      />
      {/* Rear deltoids */}
      <Muscle
        side="back"
        muscle="shoulders_rear"
        intensity={intensityFor("shoulders_rear")}
        d="M 56,72 Q 48,86 54,100 Q 64,98 72,88 Z"
      />
      <Muscle
        side="back"
        muscle="shoulders_rear"
        intensity={intensityFor("shoulders_rear")}
        d="M 144,72 Q 152,86 146,100 Q 136,98 128,88 Z"
      />
      {/* Lats — large wing shapes */}
      <Muscle
        side="back"
        muscle="lats"
        intensity={intensityFor("lats")}
        d="M 78,108 Q 64,122 72,160 Q 84,158 92,138 Z"
      />
      <Muscle
        side="back"
        muscle="lats"
        intensity={intensityFor("lats")}
        d="M 122,108 Q 136,122 128,160 Q 116,158 108,138 Z"
      />
      {/* Erector spinae (lower back) */}
      <Muscle
        side="back"
        muscle="lower_back"
        intensity={intensityFor("lower_back")}
        d="M 90,140 L 92,206 Q 100,210 108,206 L 110,140 Q 100,138 90,140 Z"
      />
      {/* Triceps (back of upper arm) */}
      <Muscle
        side="back"
        muscle="triceps"
        intensity={intensityFor("triceps")}
        d="M 50,108 Q 44,140 52,168 L 60,168 Q 62,140 58,108 Z"
      />
      <Muscle
        side="back"
        muscle="triceps"
        intensity={intensityFor("triceps")}
        d="M 150,108 Q 156,140 148,168 L 140,168 Q 138,140 142,108 Z"
      />
      {/* Forearms (back) */}
      <Muscle
        side="back"
        muscle="forearms"
        intensity={intensityFor("forearms")}
        d="M 42,184 L 42,240 Q 46,250 56,248 L 60,188 Z"
      />
      <Muscle
        side="back"
        muscle="forearms"
        intensity={intensityFor("forearms")}
        d="M 158,184 L 158,240 Q 154,250 144,248 L 140,188 Z"
      />
      {/* Glutes */}
      <Muscle
        side="back"
        muscle="glutes"
        intensity={intensityFor("glutes")}
        d="M 72,216 Q 64,232 76,250 Q 92,248 100,232 L 100,216 Z"
      />
      <Muscle
        side="back"
        muscle="glutes"
        intensity={intensityFor("glutes")}
        d="M 128,216 Q 136,232 124,250 Q 108,248 100,232 L 100,216 Z"
      />
      {/* Hamstrings (back of thigh) */}
      <Muscle
        side="back"
        muscle="hamstrings"
        intensity={intensityFor("hamstrings")}
        d="M 76,254 Q 70,278 78,304 L 100,304 L 100,254 Z"
      />
      <Muscle
        side="back"
        muscle="hamstrings"
        intensity={intensityFor("hamstrings")}
        d="M 124,254 Q 130,278 122,304 L 100,304 L 100,254 Z"
      />
      {/* Calves (gastrocnemius — back of lower leg) */}
      <Muscle
        side="back"
        muscle="calves"
        intensity={intensityFor("calves")}
        d="M 76,316 Q 70,338 78,356 L 100,356 L 100,316 Z"
      />
      <Muscle
        side="back"
        muscle="calves"
        intensity={intensityFor("calves")}
        d="M 124,316 Q 130,338 122,356 L 100,356 L 100,316 Z"
      />
    </g>
  );
}

interface MuscleSegmentProps {
  side: "front" | "back";
  muscle: MuscleGroup;
  intensity: Intensity;
  d: string;
  partial?: boolean;
}

function Muscle({ side, intensity, d, partial }: MuscleSegmentProps) {
  if (intensity === "idle") {
    return (
      <path
        d={d}
        fill="none"
        stroke="#3A3A3A"
        strokeWidth={0.8}
        opacity={partial ? 0.25 : 0.45}
      />
    );
  }
  const fill =
    intensity === "primary"
      ? `url(#mm-primary-${side})`
      : `url(#mm-secondary-${side})`;
  const stroke = intensity === "primary" ? "#7CE3B7" : "#8A6FD9";
  const filter =
    intensity === "primary" ? `url(#mm-glow-${side})` : undefined;
  return (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeOpacity={0.6}
      strokeWidth={0.8}
      filter={filter}
      opacity={partial ? 0.7 : 1}
    />
  );
}
