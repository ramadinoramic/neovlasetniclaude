"use client";

import type { MotionPattern, MuscleGroup } from "@/data/exercises";
import { cn } from "@/lib/cn";

/**
 * Privremeni placeholder za 3D Lottie animaciju.
 * Renderira neutralnu prozirnu siluetu (front view) sa segmentima koji se
 * pomiču po tipu pokreta (`motion`). Aktivni mišići se boje mintom i pulsiraju.
 *
 * Animacije žive u globals.css (.nf-motion-*). Kad Lottie JSON-i budu spremni,
 * cijela komponenta se zamijeni @lottiefiles/react-lottie-player Player-om.
 */

interface LottiePlaceholderProps {
  muscles: MuscleGroup[];
  motion: MotionPattern;
  exerciseName: string;
  className?: string;
}

const ACTIVE_FILL = "fill-mint/55 stroke-mint";
const IDLE_FILL = "fill-charcoal-line/40 stroke-ash-600/60";

export function LottiePlaceholder({
  muscles,
  motion,
  exerciseName,
  className,
}: LottiePlaceholderProps) {
  const isActive = (m: MuscleGroup) =>
    muscles.includes(m) || muscles.includes("full_body");

  const muscleClass = (m: MuscleGroup) =>
    cn(isActive(m) ? ACTIVE_FILL : IDLE_FILL);

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
        demo · animirano
      </span>

      <svg
        viewBox="0 0 200 360"
        className={cn("nf-svg h-72 w-auto", `nf-motion-${motion}`)}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round">
          {/* ── HEAD ──────────────────────────────────────────────────── */}
          <g data-anim="head" style={{ ["--origin" as string]: "50% 100%" }}>
            <circle
              cx={100}
              cy={32}
              r={18}
              className="fill-charcoal-line/50 stroke-ash-600/70"
            />
            <path
              d="M92 48 Q100 56 108 48 L108 60 L92 60 Z"
              className="fill-charcoal-line/50 stroke-ash-600/70"
            />
          </g>

          {/* ── TORSO (animates as a whole for hinge/squat/flexion/breathe) ── */}
          <g data-anim="torso">
            {/* Outline of trunk */}
            <path
              d="M72 62 Q60 70 60 96 L60 158 Q60 174 70 180 L130 180 Q140 174 140 158 L140 96 Q140 70 128 62 Z"
              className="fill-charcoal-line/30 stroke-ash-600/60"
            />

            {/* Chest (pectoralis) */}
            <path
              d="M76 72 Q88 64 100 64 Q112 64 124 72 L124 108 Q112 116 100 116 Q88 116 76 108 Z"
              className={muscleClass("chest")}
              data-active={isActive("chest")}
            />

            {/* Abs (rectus abdominis) — three subtle bands */}
            <g
              className={muscleClass("core")}
              data-active={isActive("core")}
            >
              <rect x={84} y={120} width={32} height={14} rx={3} />
              <rect x={84} y={138} width={32} height={14} rx={3} />
              <rect x={84} y={156} width={32} height={14} rx={3} />
            </g>

            {/* Shoulders (anterior deltoid) */}
            <path
              d="M58 70 Q52 84 56 100 Q66 96 72 86 Z"
              className={muscleClass("shoulders")}
              data-active={isActive("shoulders")}
            />
            <path
              d="M142 70 Q148 84 144 100 Q134 96 128 86 Z"
              className={muscleClass("shoulders")}
              data-active={isActive("shoulders")}
            />

            {/* Back-hint (since we're front view, indicate active back with a marker) */}
            {isActive("back") && (
              <g
                className="fill-mint/70 stroke-mint"
                data-active="true"
              >
                <circle cx={100} cy={140} r={4} />
                <text
                  x={108}
                  y={144}
                  className="fill-mint text-[8px]"
                  fontFamily="system-ui"
                  fontWeight="600"
                >
                  back
                </text>
              </g>
            )}
          </g>

          {/* ── ARMS — left ──────────────────────────────────────────── */}
          <g
            data-anim="upperarm-l"
            style={{ ["--origin" as string]: "50% 0%" }}
          >
            <path
              d="M48 90 L42 156 L56 158 L62 96 Z"
              className={muscleClass("arms")}
              data-active={isActive("arms")}
            />
            <g data-anim="forearm-l">
              <path
                d="M40 158 L36 218 L52 220 L56 160 Z"
                className="fill-charcoal-line/35 stroke-ash-600/60"
              />
            </g>
          </g>

          {/* ── ARMS — right ─────────────────────────────────────────── */}
          <g
            data-anim="upperarm-r"
            style={{ ["--origin" as string]: "50% 0%" }}
          >
            <path
              d="M152 90 L158 156 L144 158 L138 96 Z"
              className={muscleClass("arms")}
              data-active={isActive("arms")}
            />
            <g data-anim="forearm-r">
              <path
                d="M160 158 L164 218 L148 220 L144 160 Z"
                className="fill-charcoal-line/35 stroke-ash-600/60"
              />
            </g>
          </g>

          {/* ── HIPS / GLUTES ────────────────────────────────────────── */}
          <path
            d="M68 180 L132 180 L138 204 L62 204 Z"
            className={muscleClass("glutes")}
            data-active={isActive("glutes")}
          />

          {/* ── THIGHS — left ────────────────────────────────────────── */}
          <g
            data-anim="thigh-l"
            style={{ ["--origin" as string]: "50% 0%" }}
          >
            <path
              d="M68 204 L60 282 L88 284 L94 206 Z"
              className={muscleClass("quads")}
              data-active={isActive("quads")}
            />
            {/* Hamstring marker (rear muscle, hint dot) */}
            {isActive("hamstrings") && (
              <circle
                cx={78}
                cy={244}
                r={4}
                className="fill-mint/70 stroke-mint"
                data-active="true"
              />
            )}
          </g>

          {/* ── THIGHS — right ───────────────────────────────────────── */}
          <g
            data-anim="thigh-r"
            style={{ ["--origin" as string]: "50% 0%" }}
          >
            <path
              d="M132 204 L140 282 L112 284 L106 206 Z"
              className={muscleClass("quads")}
              data-active={isActive("quads")}
            />
            {isActive("hamstrings") && (
              <circle
                cx={122}
                cy={244}
                r={4}
                className="fill-mint/70 stroke-mint"
                data-active="true"
              />
            )}
          </g>

          {/* ── CALVES ────────────────────────────────────────────────── */}
          <path
            d="M64 286 L60 342 L84 342 L86 288 Z"
            className={muscleClass("calves")}
            data-active={isActive("calves")}
          />
          <path
            d="M136 286 L140 342 L116 342 L114 288 Z"
            className={muscleClass("calves")}
            data-active={isActive("calves")}
          />
        </g>
      </svg>

      {/* Soft mint glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-mint/[0.03] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
    </div>
  );
}
