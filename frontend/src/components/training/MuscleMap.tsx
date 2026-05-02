"use client";

import type { MuscleGroup } from "@/data/exercises";
import { MUSCLE_LABEL } from "@/data/exercises";
import { cn } from "@/lib/cn";

/**
 * Anatomical muscle map — front + back views.
 *
 * Stylistic target: clinical anatomy chart (Fitbod / Strong / Hevy style).
 * Athletic 7-head proportions, smooth bezier silhouette, anatomically
 * positioned muscle overlays. No motion. Active muscles get a clean mint
 * gradient + subtle highlight stroke; secondary get a violet tint; idle
 * muscles render as faint outlines so the chart still reads as anatomy.
 *
 * Coordinate system (all paths use viewBox 0 0 240 400, center x = 120):
 *   Head:        cy = 44, rx = 24, ry = 28
 *   Shoulders:   y = 94    (neck-torso junction at center)
 *   Deltoid pk:  y = 130, outer edge x = 46 / x = 194
 *   Chest line:  y = 152
 *   Waist:       y = 220   (narrowest)
 *   Hip flare:   y = 254   (widest)
 *   Crotch:      y = 274
 *   Knee:        y = 322
 *   Ankle:       y = 384
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

      <div className="grid grid-cols-2 gap-2">
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
  const id = (suffix: string) => `mm-${suffix}-${side}`;
  return (
    <div className="relative flex justify-center">
      <span className="absolute left-1 top-1 z-10 text-[9px] uppercase tracking-widest text-ash-600">
        {side === "front" ? "front" : "back"}
      </span>
      <svg
        viewBox="0 0 240 400"
        className="h-80 w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={id("idle")} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#262626" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id={id("primary")} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#A6F0CE" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#7CE3B7" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#56B894" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id={id("secondary")} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#A892E8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6B54B0" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        <BodySilhouette idleFill={`url(#${id("idle")})`} />
        {side === "front" ? <FrontLandmarks /> : <BackLandmarks />}
        {side === "front" ? (
          <FrontMuscles intensityFor={intensityFor} idPrefix={id} />
        ) : (
          <BackMuscles intensityFor={intensityFor} idPrefix={id} />
        )}
      </svg>
    </div>
  );
}

const STROKE = "#3A3A3A";

/* ── Body silhouette (head, torso, arms, legs as separate paths) ─────────── */

function BodySilhouette({ idleFill }: { idleFill: string }) {
  return (
    <g
      fill={idleFill}
      stroke={STROKE}
      strokeWidth={1}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* Head + neck */}
      <path
        d="M 120,16
           C 138,16 152,32 152,52
           C 152,68 144,80 134,86
           L 134,94
           L 106,94
           L 106,86
           C 96,80 88,68 88,52
           C 88,32 102,16 120,16 Z"
      />

      {/* Torso (shoulders → chest → waist → hips) */}
      <path
        d="M 80,94
           C 60,98 48,112 46,134
           C 46,160 50,184 60,206
           C 64,216 70,224 80,228
           C 84,240 80,254 80,266
           C 80,272 84,278 90,278
           L 150,278
           C 156,278 160,272 160,266
           C 160,254 156,240 160,228
           C 170,224 176,216 180,206
           C 190,184 194,160 194,134
           C 192,112 180,98 160,94
           L 80,94 Z"
      />

      {/* Left upper arm */}
      <path
        d="M 60,116
           C 50,124 44,140 42,160
           L 38,210
           C 38,222 46,228 54,224
           C 58,212 60,196 62,180
           L 64,150
           C 66,134 64,122 60,116 Z"
      />

      {/* Left forearm + hand */}
      <path
        d="M 40,222
           C 34,250 28,280 28,306
           C 28,318 36,322 46,320
           C 50,294 54,266 56,238
           L 56,222 Z"
      />

      {/* Right upper arm */}
      <path
        d="M 180,116
           C 190,124 196,140 198,160
           L 202,210
           C 202,222 194,228 186,224
           C 182,212 180,196 178,180
           L 176,150
           C 174,134 176,122 180,116 Z"
      />

      {/* Right forearm + hand */}
      <path
        d="M 200,222
           C 206,250 212,280 212,306
           C 212,318 204,322 194,320
           C 190,294 186,266 184,238
           L 184,222 Z"
      />

      {/* Left thigh */}
      <path
        d="M 86,280
           C 80,302 76,318 78,330
           L 116,330
           L 116,280
           L 86,280 Z"
      />

      {/* Left calf + foot */}
      <path
        d="M 84,334
           C 82,354 82,372 86,384
           L 90,388
           L 112,388
           L 116,384
           C 116,372 116,354 114,334
           L 84,334 Z"
      />

      {/* Right thigh */}
      <path
        d="M 154,280
           C 160,302 164,318 162,330
           L 124,330
           L 124,280
           L 154,280 Z"
      />

      {/* Right calf + foot */}
      <path
        d="M 156,334
           C 158,354 158,372 154,384
           L 150,388
           L 128,388
           L 124,384
           C 124,372 124,354 126,334
           L 156,334 Z"
      />
    </g>
  );
}

/* ── Internal anatomical landmarks (very subtle) ─────────────────────────── */

function FrontLandmarks() {
  return (
    <g
      fill="none"
      stroke="#454545"
      strokeOpacity="0.45"
      strokeWidth={0.6}
      strokeLinecap="round"
    >
      {/* Clavicles */}
      <path d="M 96,98 Q 110,104 120,104 Q 130,104 144,98" />
      {/* Sternum */}
      <path d="M 120,104 L 120,156" />
      {/* Lower chest line */}
      <path d="M 96,152 Q 120,158 144,152" />
      {/* Linea alba */}
      <path d="M 120,156 L 120,250" strokeOpacity="0.3" />
      {/* Iliac crest */}
      <path d="M 86,250 Q 120,254 154,250" strokeOpacity="0.3" />
      {/* Patella hint */}
      <ellipse cx={102} cy={328} rx={8} ry={3} strokeOpacity="0.25" />
      <ellipse cx={138} cy={328} rx={8} ry={3} strokeOpacity="0.25" />
    </g>
  );
}

function BackLandmarks() {
  return (
    <g
      fill="none"
      stroke="#454545"
      strokeOpacity="0.45"
      strokeWidth={0.6}
      strokeLinecap="round"
    >
      {/* Spine */}
      <path d="M 120,98 L 120,254" strokeOpacity="0.4" />
      {/* Scapula left hint */}
      <path d="M 96,108 Q 100,128 112,144" strokeOpacity="0.3" />
      {/* Scapula right hint */}
      <path d="M 144,108 Q 140,128 128,144" strokeOpacity="0.3" />
      {/* Iliac crest */}
      <path d="M 86,254 Q 120,258 154,254" strokeOpacity="0.3" />
      {/* Knee crease */}
      <path d="M 86,328 Q 102,330 116,328" strokeOpacity="0.25" />
      <path d="M 124,328 Q 138,330 154,328" strokeOpacity="0.25" />
    </g>
  );
}

/* ── Muscle overlays — front ─────────────────────────────────────────────── */

interface MuscleProps {
  intensityFor: (m: MuscleGroup) => Intensity;
  idPrefix: (suffix: string) => string;
}

function FrontMuscles({ intensityFor, idPrefix }: MuscleProps) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* PECTORALIS MAJOR — left (fan from sternum out to armpit) */}
      <Muscle
        intensity={intensityFor("chest")}
        idPrefix={idPrefix}
        d="M 118,100
           C 108,102 96,108 88,124
           C 84,138 86,150 96,156
           C 106,158 114,156 118,152
           L 118,100 Z"
      />
      {/* PECTORALIS MAJOR — right */}
      <Muscle
        intensity={intensityFor("chest")}
        idPrefix={idPrefix}
        d="M 122,100
           C 132,102 144,108 152,124
           C 156,138 154,150 144,156
           C 134,158 126,156 122,152
           L 122,100 Z"
      />

      {/* ANTERIOR DELTOID — left (inner shoulder cap, near clavicle) */}
      <Muscle
        intensity={intensityFor("shoulders_front")}
        idPrefix={idPrefix}
        d="M 84,98
           C 76,102 68,114 66,128
           C 74,128 82,122 86,114
           C 90,108 88,100 84,98 Z"
      />
      {/* ANTERIOR DELTOID — right */}
      <Muscle
        intensity={intensityFor("shoulders_front")}
        idPrefix={idPrefix}
        d="M 156,98
           C 164,102 172,114 174,128
           C 166,128 158,122 154,114
           C 150,108 152,100 156,98 Z"
      />

      {/* LATERAL DELTOID — left (outer shoulder cap, side of upper arm) */}
      <Muscle
        intensity={intensityFor("shoulders_side")}
        idPrefix={idPrefix}
        d="M 50,128
           C 44,142 44,160 48,176
           C 54,176 60,170 62,162
           C 64,150 62,138 58,128
           L 50,128 Z"
      />
      {/* LATERAL DELTOID — right */}
      <Muscle
        intensity={intensityFor("shoulders_side")}
        idPrefix={idPrefix}
        d="M 190,128
           C 196,142 196,160 192,176
           C 186,176 180,170 178,162
           C 176,150 178,138 182,128
           L 190,128 Z"
      />

      {/* BICEPS — left (front of upper arm, oval) */}
      <Muscle
        intensity={intensityFor("biceps")}
        idPrefix={idPrefix}
        d="M 48,150
           C 44,172 44,196 48,212
           C 52,214 56,212 58,206
           L 60,180
           C 62,164 62,150 60,142
           C 56,140 50,144 48,150 Z"
      />
      {/* BICEPS — right */}
      <Muscle
        intensity={intensityFor("biceps")}
        idPrefix={idPrefix}
        d="M 192,150
           C 196,172 196,196 192,212
           C 188,214 184,212 182,206
           L 180,180
           C 178,164 178,150 180,142
           C 184,140 190,144 192,150 Z"
      />

      {/* FOREARMS — left (flexor mass, front of forearm) */}
      <Muscle
        intensity={intensityFor("forearms")}
        idPrefix={idPrefix}
        d="M 36,232
           C 32,254 30,278 32,300
           C 34,310 40,312 44,310
           C 48,290 52,266 54,242
           L 54,230 Z"
      />
      {/* FOREARMS — right */}
      <Muscle
        intensity={intensityFor("forearms")}
        idPrefix={idPrefix}
        d="M 204,232
           C 208,254 210,278 208,300
           C 206,310 200,312 196,310
           C 192,290 188,266 186,242
           L 186,230 Z"
      />

      {/* RECTUS ABDOMINIS — long shield, sternum to pubis */}
      <Muscle
        intensity={intensityFor("abs")}
        idPrefix={idPrefix}
        d="M 106,158
           C 104,180 104,206 108,232
           C 112,248 116,256 120,258
           C 124,256 128,248 132,232
           C 136,206 136,180 134,158
           C 128,156 112,156 106,158 Z"
      />
      {/* Tendinous intersections — only when active (the "6-pack" lines) */}
      {intensityFor("abs") === "primary" && (
        <g
          fill="none"
          stroke="#1F1F1F"
          strokeOpacity="0.6"
          strokeWidth={0.7}
          strokeLinecap="round"
        >
          <path d="M 120,158 L 120,256" />
          <path d="M 108,180 Q 120,178 132,180" />
          <path d="M 107,202 Q 120,200 133,202" />
          <path d="M 108,222 Q 120,220 132,222" />
          <path d="M 112,240 Q 120,238 128,240" />
        </g>
      )}

      {/* OBLIQUES — left (triangular patch on side of abs) */}
      <Muscle
        intensity={intensityFor("obliques")}
        idPrefix={idPrefix}
        d="M 90,164
           C 86,194 86,222 92,244
           C 98,246 102,244 104,240
           C 102,222 102,194 104,164
           C 100,160 92,160 90,164 Z"
      />
      {/* OBLIQUES — right */}
      <Muscle
        intensity={intensityFor("obliques")}
        idPrefix={idPrefix}
        d="M 150,164
           C 154,194 154,222 148,244
           C 142,246 138,244 136,240
           C 138,222 138,194 136,164
           C 140,160 148,160 150,164 Z"
      />

      {/* QUADRICEPS — left (rectus femoris + vastus lateralis sweep) */}
      <Muscle
        intensity={intensityFor("quads")}
        idPrefix={idPrefix}
        d="M 88,288
           C 82,304 78,318 80,326
           L 110,326
           L 112,288
           C 108,284 92,284 88,288 Z"
      />
      {/* QUADRICEPS — right */}
      <Muscle
        intensity={intensityFor("quads")}
        idPrefix={idPrefix}
        d="M 152,288
           C 158,304 162,318 160,326
           L 130,326
           L 128,288
           C 132,284 148,284 152,288 Z"
      />
      {/* Quad split (rectus femoris hint) — when active */}
      {intensityFor("quads") === "primary" && (
        <g
          fill="none"
          stroke="#1F1F1F"
          strokeOpacity="0.5"
          strokeWidth={0.7}
        >
          <path d="M 96,290 Q 100,310 104,324" />
          <path d="M 144,290 Q 140,310 136,324" />
        </g>
      )}

      {/* ADDUCTORS — left (inner thigh strip) */}
      <Muscle
        intensity={intensityFor("adductors")}
        idPrefix={idPrefix}
        d="M 114,288
           L 114,326
           L 119,326
           L 119,288 Z"
      />
      {/* ADDUCTORS — right */}
      <Muscle
        intensity={intensityFor("adductors")}
        idPrefix={idPrefix}
        d="M 126,288
           L 126,326
           L 121,326
           L 121,288 Z"
      />

      {/* CALVES (front: tibialis anterior — narrow strip on shin) */}
      <Muscle
        intensity={intensityFor("calves")}
        idPrefix={idPrefix}
        d="M 96,340
           C 94,356 92,374 94,384
           L 102,384
           L 104,344
           L 96,340 Z"
      />
      <Muscle
        intensity={intensityFor("calves")}
        idPrefix={idPrefix}
        d="M 144,340
           C 146,356 148,374 146,384
           L 138,384
           L 136,344
           L 144,340 Z"
      />
    </g>
  );
}

/* ── Muscle overlays — back ──────────────────────────────────────────────── */

function BackMuscles({ intensityFor, idPrefix }: MuscleProps) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* TRAPEZIUS — diamond covering upper back */}
      <Muscle
        intensity={intensityFor("traps")}
        idPrefix={idPrefix}
        d="M 106,94
           C 100,98 96,108 96,124
           C 102,128 110,130 116,128
           L 120,116
           L 124,128
           C 130,130 138,128 144,124
           C 144,108 140,98 134,94
           C 130,98 124,102 120,108
           C 116,102 110,98 106,94 Z"
      />

      {/* POSTERIOR DELTOID — left */}
      <Muscle
        intensity={intensityFor("shoulders_rear")}
        idPrefix={idPrefix}
        d="M 84,98
           C 76,102 68,114 66,128
           C 74,128 82,122 86,114
           C 90,108 88,100 84,98 Z"
      />
      {/* POSTERIOR DELTOID — right */}
      <Muscle
        intensity={intensityFor("shoulders_rear")}
        idPrefix={idPrefix}
        d="M 156,98
           C 164,102 172,114 174,128
           C 166,128 158,122 154,114
           C 150,108 152,100 156,98 Z"
      />

      {/* TRICEPS — left (back of upper arm, horseshoe shape near elbow) */}
      <Muscle
        intensity={intensityFor("triceps")}
        idPrefix={idPrefix}
        d="M 50,148
           C 44,172 44,198 50,214
           C 54,216 58,212 60,206
           L 62,180
           C 64,164 62,148 58,140
           C 54,138 50,142 50,148 Z"
      />
      {/* TRICEPS — right */}
      <Muscle
        intensity={intensityFor("triceps")}
        idPrefix={idPrefix}
        d="M 190,148
           C 196,172 196,198 190,214
           C 186,216 182,212 180,206
           L 178,180
           C 176,164 178,148 182,140
           C 186,138 190,142 190,148 Z"
      />

      {/* FOREARMS — left (extensors, back) */}
      <Muscle
        intensity={intensityFor("forearms")}
        idPrefix={idPrefix}
        d="M 36,232
           C 32,254 30,278 32,300
           C 34,310 40,312 44,310
           C 48,290 52,266 54,242
           L 54,230 Z"
      />
      {/* FOREARMS — right */}
      <Muscle
        intensity={intensityFor("forearms")}
        idPrefix={idPrefix}
        d="M 204,232
           C 208,254 210,278 208,300
           C 206,310 200,312 196,310
           C 192,290 188,266 186,242
           L 186,230 Z"
      />

      {/* LATISSIMUS DORSI — left wing */}
      <Muscle
        intensity={intensityFor("lats")}
        idPrefix={idPrefix}
        d="M 86,128
           C 78,144 70,170 70,200
           C 76,222 92,232 110,228
           L 116,210
           C 114,182 108,150 100,134
           C 96,124 90,124 86,128 Z"
      />
      {/* LATISSIMUS DORSI — right */}
      <Muscle
        intensity={intensityFor("lats")}
        idPrefix={idPrefix}
        d="M 154,128
           C 162,144 170,170 170,200
           C 164,222 148,232 130,228
           L 124,210
           C 126,182 132,150 140,134
           C 144,124 150,124 154,128 Z"
      />

      {/* ERECTOR SPINAE — two columns flanking spine in lumbar region */}
      <Muscle
        intensity={intensityFor("lower_back")}
        idPrefix={idPrefix}
        d="M 110,210
           C 108,222 108,236 110,252
           L 118,252
           L 118,210 Z"
      />
      <Muscle
        intensity={intensityFor("lower_back")}
        idPrefix={idPrefix}
        d="M 130,210
           C 132,222 132,236 130,252
           L 122,252
           L 122,210 Z"
      />

      {/* GLUTEUS MAXIMUS — left */}
      <Muscle
        intensity={intensityFor("glutes")}
        idPrefix={idPrefix}
        d="M 86,254
           C 78,262 74,276 78,290
           C 86,294 100,294 112,288
           L 118,272
           L 118,254
           C 110,252 92,252 86,254 Z"
      />
      {/* GLUTEUS MAXIMUS — right */}
      <Muscle
        intensity={intensityFor("glutes")}
        idPrefix={idPrefix}
        d="M 154,254
           C 162,262 166,276 162,290
           C 154,294 140,294 128,288
           L 122,272
           L 122,254
           C 130,252 148,252 154,254 Z"
      />

      {/* HAMSTRINGS — left (back of thigh) */}
      <Muscle
        intensity={intensityFor("hamstrings")}
        idPrefix={idPrefix}
        d="M 88,294
           C 82,308 80,320 82,328
           L 114,328
           L 114,290
           C 108,288 94,290 88,294 Z"
      />
      {/* HAMSTRINGS — right */}
      <Muscle
        intensity={intensityFor("hamstrings")}
        idPrefix={idPrefix}
        d="M 152,294
           C 158,308 160,320 158,328
           L 126,328
           L 126,290
           C 132,288 146,290 152,294 Z"
      />

      {/* GASTROCNEMIUS (calves, back) — diamond shape */}
      <Muscle
        intensity={intensityFor("calves")}
        idPrefix={idPrefix}
        d="M 86,338
           C 82,358 82,376 88,384
           L 100,384
           L 102,344
           L 86,338 Z"
      />
      <Muscle
        intensity={intensityFor("calves")}
        idPrefix={idPrefix}
        d="M 154,338
           C 158,358 158,376 152,384
           L 140,384
           L 138,344
           L 154,338 Z"
      />
    </g>
  );
}

/* ── Muscle path renderer ────────────────────────────────────────────────── */

interface MusclePathProps {
  intensity: Intensity;
  idPrefix: (suffix: string) => string;
  d: string;
}

function Muscle({ intensity, idPrefix, d }: MusclePathProps) {
  if (intensity === "idle") {
    return (
      <path
        d={d}
        fill="none"
        stroke="#3F3F3F"
        strokeOpacity="0.45"
        strokeWidth={0.7}
      />
    );
  }
  if (intensity === "secondary") {
    return (
      <path
        d={d}
        fill={`url(#${idPrefix("secondary")})`}
        stroke="#8A6FD9"
        strokeOpacity="0.55"
        strokeWidth={0.8}
      />
    );
  }
  return (
    <>
      <path
        d={d}
        fill={`url(#${idPrefix("primary")})`}
        stroke="#7CE3B7"
        strokeOpacity="0.85"
        strokeWidth={0.9}
      />
      {/* highlight stroke for subtle 3D feel */}
      <path
        d={d}
        fill="none"
        stroke="#D1F5E2"
        strokeOpacity="0.3"
        strokeWidth={0.5}
      />
    </>
  );
}
