"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { MuscleGroup } from "@/data/exercises";
import { MUSCLE_LABEL } from "@/data/exercises";
import { cn } from "@/lib/cn";

/**
 * Glossy white anatomical mannequin — Three.js / R3F.
 *
 * Inspirirano fitness-store mannequin estetikom (glossy white, anatomski
 * relief). Tijelo je sastavljeno od velikog broja primitive shape-ova
 * pozicioniranih anatomski s muscle relief bulges (pec dome, deltoid
 * caps, bicep peaks, ab boxes, quad sweeps, calf gastrocnemius).
 *
 * NAPOMENA: Pristup primitivima ima strop. Za pravu sculpted muskulaturu
 * trebao bi GLB model (Quaternius / Mixamo / RPM) — ovo je zadnja iteracija
 * prije takvog poteza.
 */

interface MuscleMap3DProps {
  primary: MuscleGroup[];
  secondary?: MuscleGroup[];
  exerciseName: string;
  className?: string;
}

type Intensity = "primary" | "secondary" | "idle";

const SKIN_COLOR = "#EFEFEF";
const SKIN_DARK_COLOR = "#D8D8D8";
const PRIMARY_COLOR = "#7CE3B7";
const PRIMARY_EMISSIVE = "#56B894";
const SECONDARY_COLOR = "#8A6FD9";
const SECONDARY_EMISSIVE = "#5A4690";

export function MuscleMap3D({
  primary,
  secondary = [],
  exerciseName,
  className,
}: MuscleMap3DProps) {
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
      aria-label={`Anatomski 3D prikaz mišića za vježbu: ${exerciseName}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.25em] text-ash-400">
          Anatomski 3D prikaz
        </span>
        <span className="text-[10px] uppercase tracking-widest text-ash-600">
          povuci za rotaciju
        </span>
      </div>

      <div className="relative h-[28rem] w-full">
        <Canvas
          camera={{ position: [0, 0.55, 2.5], fov: 32 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true }}
          shadows
        >
          <Lighting />
          <Suspense fallback={null}>
            <BodyRig intensityFor={intensityFor} />
            <ContactShadows
              position={[0, -0.95, 0]}
              opacity={0.55}
              scale={3}
              blur={2.5}
              far={1.5}
            />
          </Suspense>
          <OrbitControls
            autoRotate
            autoRotateSpeed={1.4}
            enablePan={false}
            enableZoom={false}
            target={[0, 0.45, 0]}
            minPolarAngle={Math.PI / 2 - 0.25}
            maxPolarAngle={Math.PI / 2 + 0.25}
          />
        </Canvas>
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

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      {/* Key light — top right */}
      <directionalLight position={[3, 5, 4]} intensity={1.4} color="#FFFFFF" />
      {/* Fill light — top left */}
      <directionalLight
        position={[-3, 3, 2]}
        intensity={0.7}
        color="#A6F0CE"
      />
      {/* Rim light — back, silhouette */}
      <directionalLight position={[0, 2, -4]} intensity={0.9} color="#FFFFFF" />
      {/* Front fill */}
      <pointLight position={[0, 0.8, 3]} intensity={0.6} color="#FFFFFF" />
      {/* Violet accent */}
      <pointLight position={[2, 0, 1]} intensity={0.3} color="#A892E8" />
    </>
  );
}

interface BodyProps {
  intensityFor: (m: MuscleGroup) => Intensity;
}

function BodyRig({ intensityFor }: BodyProps) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.008;
  });
  return (
    <group ref={groupRef}>
      <BaseBody />
      <MuscleReliefAlwaysOn />
      <MuscleHighlights intensityFor={intensityFor} />
    </group>
  );
}

/* ── Materials ───────────────────────────────────────────────────────────── */

function useSkinMaterial(dark = false): THREE.MeshPhysicalMaterial {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: dark ? SKIN_DARK_COLOR : SKIN_COLOR,
        roughness: 0.22,
        metalness: 0.05,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
      }),
    [dark]
  );
}

/* ── Skeleton/base body — glossy white mannequin ─────────────────────────── */

function BaseBody() {
  const skin = useSkinMaterial();
  const skinDark = useSkinMaterial(true);

  return (
    <group>
      {/* Head — slightly elongated sphere */}
      <mesh
        position={[0, 1.55, 0]}
        material={skin}
        scale={[0.95, 1.1, 1]}
        castShadow
      >
        <sphereGeometry args={[0.16, 32, 32]} />
      </mesh>

      {/* Jaw hint */}
      <mesh position={[0, 1.46, 0.08]} material={skin} scale={[0.9, 0.4, 0.6]} castShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.36, 0]} material={skinDark} castShadow>
        <cylinderGeometry args={[0.065, 0.085, 0.13, 18]} />
      </mesh>

      {/* Trapezius / upper-shoulder yoke */}
      <mesh
        position={[0, 1.3, -0.02]}
        material={skin}
        scale={[1.4, 0.5, 0.9]}
        castShadow
      >
        <sphereGeometry args={[0.16, 24, 24]} />
      </mesh>

      {/* Upper torso (chest area) — broader, flattened front-back */}
      <mesh
        position={[0, 1.12, 0]}
        material={skin}
        scale={[1.6, 1.05, 0.85]}
        castShadow
      >
        <sphereGeometry args={[0.18, 32, 32]} />
      </mesh>

      {/* Mid torso (rib cage to waist) */}
      <mesh
        position={[0, 0.92, 0]}
        material={skin}
        scale={[1.35, 1.0, 0.85]}
        castShadow
      >
        <sphereGeometry args={[0.17, 24, 24]} />
      </mesh>

      {/* Lower torso (waist) — narrowest */}
      <mesh
        position={[0, 0.74, 0]}
        material={skin}
        scale={[1.1, 0.9, 0.85]}
        castShadow
      >
        <sphereGeometry args={[0.16, 24, 24]} />
      </mesh>

      {/* Pelvis */}
      <mesh
        position={[0, 0.57, 0]}
        material={skin}
        scale={[1.5, 0.9, 0.95]}
        castShadow
      >
        <sphereGeometry args={[0.15, 24, 24]} />
      </mesh>

      {/* Shoulder balls */}
      {[-1, 1].map((s) => (
        <mesh
          key={`sh${s}`}
          position={[0.27 * s, 1.27, 0]}
          material={skin}
          scale={[1, 1, 1]}
          castShadow
        >
          <sphereGeometry args={[0.1, 24, 24]} />
        </mesh>
      ))}

      {/* Upper arms — tapered capsules */}
      {[-1, 1].map((s) => (
        <group key={`ua${s}`}>
          <mesh
            position={[0.31 * s, 1.05, 0]}
            material={skin}
            scale={[1, 1, 1]}
            castShadow
          >
            <capsuleGeometry args={[0.06, 0.3, 8, 18]} />
          </mesh>
        </group>
      ))}

      {/* Elbows */}
      {[-1, 1].map((s) => (
        <mesh
          key={`el${s}`}
          position={[0.32 * s, 0.74, 0]}
          material={skinDark}
          castShadow
        >
          <sphereGeometry args={[0.058, 18, 18]} />
        </mesh>
      ))}

      {/* Forearms — slight taper, bulkier near elbow */}
      {[-1, 1].map((s) => (
        <mesh
          key={`fa${s}`}
          position={[0.335 * s, 0.5, 0]}
          material={skin}
          scale={[1, 1, 1]}
          castShadow
        >
          <capsuleGeometry args={[0.054, 0.32, 8, 18]} />
        </mesh>
      ))}

      {/* Hands */}
      {[-1, 1].map((s) => (
        <mesh
          key={`hd${s}`}
          position={[0.345 * s, 0.27, 0]}
          material={skinDark}
          scale={[0.9, 1.4, 0.55]}
          castShadow
        >
          <sphereGeometry args={[0.06, 18, 18]} />
        </mesh>
      ))}

      {/* Hip joints */}
      {[-1, 1].map((s) => (
        <mesh
          key={`hp${s}`}
          position={[0.11 * s, 0.46, 0]}
          material={skin}
          castShadow
        >
          <sphereGeometry args={[0.1, 22, 22]} />
        </mesh>
      ))}

      {/* Thighs — capsule tapered toward knee */}
      {[-1, 1].map((s) => (
        <mesh
          key={`th${s}`}
          position={[0.13 * s, 0.18, 0]}
          material={skin}
          scale={[1.1, 1, 0.95]}
          castShadow
        >
          <capsuleGeometry args={[0.085, 0.42, 10, 20]} />
        </mesh>
      ))}

      {/* Knees */}
      {[-1, 1].map((s) => (
        <mesh
          key={`kn${s}`}
          position={[0.13 * s, -0.12, 0]}
          material={skinDark}
          castShadow
        >
          <sphereGeometry args={[0.075, 20, 20]} />
        </mesh>
      ))}

      {/* Calves */}
      {[-1, 1].map((s) => (
        <mesh
          key={`cl${s}`}
          position={[0.135 * s, -0.42, 0]}
          material={skin}
          scale={[1, 1, 1]}
          castShadow
        >
          <capsuleGeometry args={[0.07, 0.36, 8, 18]} />
        </mesh>
      ))}

      {/* Ankles */}
      {[-1, 1].map((s) => (
        <mesh
          key={`an${s}`}
          position={[0.135 * s, -0.72, 0]}
          material={skinDark}
          castShadow
        >
          <sphereGeometry args={[0.058, 16, 16]} />
        </mesh>
      ))}

      {/* Feet */}
      {[-1, 1].map((s) => (
        <mesh
          key={`ft${s}`}
          position={[0.135 * s, -0.8, 0.07]}
          material={skinDark}
          scale={[1.3, 0.55, 2.4]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <boxGeometry args={[0.08, 0.05, 0.08]} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Always-on muscle relief (sculpted bulges baked into base mannequin) ─── */

function MuscleReliefAlwaysOn() {
  const skin = useSkinMaterial();
  const skinDark = useSkinMaterial(true);

  return (
    <group>
      {/* PECTORAL DOMES — one per side, sticking out from chest */}
      {[-1, 1].map((s) => (
        <mesh
          key={`pec${s}`}
          position={[0.075 * s, 1.18, 0.135]}
          material={skin}
          scale={[1.05, 1, 0.5]}
          castShadow
        >
          <sphereGeometry args={[0.105, 24, 24]} />
        </mesh>
      ))}

      {/* SERRATUS / lower-pec hint */}
      {[-1, 1].map((s) => (
        <mesh
          key={`ser${s}`}
          position={[0.16 * s, 1.04, 0.1]}
          material={skinDark}
          scale={[0.5, 0.3, 0.3]}
          castShadow
        >
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
      ))}

      {/* AB DEFINITION — 6-pack as 3 horizontal pairs of slight bumps */}
      {[
        { y: 1.0, w: 0.04, h: 0.035 },
        { y: 0.94, w: 0.04, h: 0.035 },
        { y: 0.88, w: 0.04, h: 0.03 },
      ].map((row, i) =>
        [-1, 1].map((s) => (
          <mesh
            key={`ab${i}${s}`}
            position={[0.038 * s, row.y, 0.165]}
            material={skin}
            scale={[row.w, row.h, 0.012]}
            castShadow
          >
            <boxGeometry args={[1.2, 1.2, 1]} />
          </mesh>
        ))
      )}
      {/* Linea alba — thin dark vertical groove */}
      <mesh position={[0, 0.94, 0.18]} material={skinDark} scale={[0.005, 0.13, 0.005]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* DELTOID 3 HEADS — small bumps around shoulder ball */}
      {[-1, 1].map((s) => (
        <group key={`delt${s}`}>
          {/* anterior */}
          <mesh
            position={[0.23 * s, 1.27, 0.07]}
            material={skin}
            scale={[0.55, 0.55, 0.55]}
            castShadow
          >
            <sphereGeometry args={[0.085, 16, 16]} />
          </mesh>
          {/* lateral (side bulge) */}
          <mesh
            position={[0.32 * s, 1.27, 0]}
            material={skin}
            scale={[0.5, 0.6, 0.55]}
            castShadow
          >
            <sphereGeometry args={[0.085, 16, 16]} />
          </mesh>
          {/* posterior */}
          <mesh
            position={[0.23 * s, 1.27, -0.07]}
            material={skin}
            scale={[0.55, 0.55, 0.55]}
            castShadow
          >
            <sphereGeometry args={[0.085, 16, 16]} />
          </mesh>
        </group>
      ))}

      {/* BICEPS PEAK — front of upper arm */}
      {[-1, 1].map((s) => (
        <mesh
          key={`bip${s}`}
          position={[0.305 * s, 1.08, 0.04]}
          material={skin}
          scale={[0.55, 1.1, 0.55]}
          castShadow
        >
          <sphereGeometry args={[0.05, 16, 16]} />
        </mesh>
      ))}

      {/* TRICEPS HORSESHOE — back of upper arm */}
      {[-1, 1].map((s) => (
        <mesh
          key={`trip${s}`}
          position={[0.305 * s, 1.05, -0.045]}
          material={skin}
          scale={[0.55, 1.1, 0.55]}
          castShadow
        >
          <sphereGeometry args={[0.05, 16, 16]} />
        </mesh>
      ))}

      {/* FOREARM FLEXOR mass — bulkier upper portion */}
      {[-1, 1].map((s) => (
        <mesh
          key={`fmf${s}`}
          position={[0.335 * s, 0.62, 0]}
          material={skin}
          scale={[1, 0.7, 1]}
          castShadow
        >
          <sphereGeometry args={[0.06, 16, 16]} />
        </mesh>
      ))}

      {/* TRAPEZIUS DIAMOND — back, behind shoulders */}
      <mesh
        position={[0, 1.27, -0.07]}
        material={skin}
        scale={[1.5, 0.7, 0.4]}
        castShadow
      >
        <sphereGeometry args={[0.13, 24, 24]} />
      </mesh>

      {/* LATS — wing taper from upper to lower back */}
      {[-1, 1].map((s) => (
        <mesh
          key={`lat${s}`}
          position={[0.18 * s, 1.0, -0.08]}
          material={skin}
          scale={[0.55, 1.6, 0.45]}
          castShadow
        >
          <sphereGeometry args={[0.08, 18, 18]} />
        </mesh>
      ))}

      {/* ERECTOR SPINAE — two columns */}
      {[-1, 1].map((s) => (
        <mesh
          key={`er${s}`}
          position={[0.04 * s, 0.82, -0.13]}
          material={skin}
          scale={[0.18, 1.3, 0.2]}
          castShadow
        >
          <boxGeometry args={[0.12, 0.12, 0.12]} />
        </mesh>
      ))}

      {/* GLUTEUS MAX — round, prominent on back-bottom */}
      {[-1, 1].map((s) => (
        <mesh
          key={`gl${s}`}
          position={[0.085 * s, 0.43, -0.13]}
          material={skin}
          scale={[1.1, 1.2, 0.85]}
          castShadow
        >
          <sphereGeometry args={[0.105, 22, 22]} />
        </mesh>
      ))}

      {/* QUADRICEPS — vastus lateralis (outer) + medialis (inner) + RF (center) */}
      {[-1, 1].map((s) => (
        <group key={`q${s}`}>
          {/* Vastus lateralis (outer) */}
          <mesh
            position={[0.18 * s, 0.2, 0.065]}
            material={skin}
            scale={[0.4, 1.5, 0.4]}
            castShadow
          >
            <sphereGeometry args={[0.06, 16, 16]} />
          </mesh>
          {/* Rectus femoris (center) */}
          <mesh
            position={[0.13 * s, 0.18, 0.085]}
            material={skin}
            scale={[0.5, 1.7, 0.45]}
            castShadow
          >
            <sphereGeometry args={[0.055, 16, 16]} />
          </mesh>
          {/* Vastus medialis (inner near knee — "teardrop") */}
          <mesh
            position={[0.085 * s, 0.0, 0.07]}
            material={skin}
            scale={[0.5, 0.6, 0.5]}
            castShadow
          >
            <sphereGeometry args={[0.06, 16, 16]} />
          </mesh>
        </group>
      ))}

      {/* HAMSTRINGS — back of thigh, two heads */}
      {[-1, 1].map((s) => (
        <mesh
          key={`ham${s}`}
          position={[0.13 * s, 0.18, -0.085]}
          material={skin}
          scale={[0.5, 1.5, 0.45]}
          castShadow
        >
          <sphereGeometry args={[0.06, 16, 16]} />
        </mesh>
      ))}

      {/* CALVES — gastrocnemius two-head bulge */}
      {[-1, 1].map((s) => (
        <group key={`ca${s}`}>
          {/* Outer head */}
          <mesh
            position={[0.16 * s, -0.32, -0.06]}
            material={skin}
            scale={[0.4, 0.9, 0.5]}
            castShadow
          >
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
          {/* Inner head */}
          <mesh
            position={[0.115 * s, -0.32, -0.065]}
            material={skin}
            scale={[0.4, 0.85, 0.5]}
            castShadow
          >
            <sphereGeometry args={[0.07, 16, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Active-muscle highlights ────────────────────────────────────────────── */

interface MuscleHighlight {
  groups: MuscleGroup[];
  position: [number, number, number];
  scale: [number, number, number];
}

const HIGHLIGHTS: MuscleHighlight[] = [
  // Pectorals — overlay on top of pectoral domes
  { groups: ["chest"], position: [-0.075, 1.18, 0.16], scale: [0.11, 0.1, 0.025] },
  { groups: ["chest"], position: [0.075, 1.18, 0.16], scale: [0.11, 0.1, 0.025] },

  // Anterior deltoid
  { groups: ["shoulders_front"], position: [-0.23, 1.27, 0.085], scale: [0.05, 0.05, 0.05] },
  { groups: ["shoulders_front"], position: [0.23, 1.27, 0.085], scale: [0.05, 0.05, 0.05] },

  // Lateral deltoid
  { groups: ["shoulders_side"], position: [-0.335, 1.27, 0], scale: [0.045, 0.06, 0.06] },
  { groups: ["shoulders_side"], position: [0.335, 1.27, 0], scale: [0.045, 0.06, 0.06] },

  // Posterior deltoid
  { groups: ["shoulders_rear"], position: [-0.23, 1.27, -0.085], scale: [0.05, 0.05, 0.05] },
  { groups: ["shoulders_rear"], position: [0.23, 1.27, -0.085], scale: [0.05, 0.05, 0.05] },

  // Biceps
  { groups: ["biceps"], position: [-0.31, 1.08, 0.07], scale: [0.04, 0.13, 0.04] },
  { groups: ["biceps"], position: [0.31, 1.08, 0.07], scale: [0.04, 0.13, 0.04] },

  // Triceps
  { groups: ["triceps"], position: [-0.31, 1.05, -0.07], scale: [0.04, 0.13, 0.04] },
  { groups: ["triceps"], position: [0.31, 1.05, -0.07], scale: [0.04, 0.13, 0.04] },

  // Forearms (cover all sides)
  { groups: ["forearms"], position: [-0.34, 0.5, 0.04], scale: [0.04, 0.18, 0.04] },
  { groups: ["forearms"], position: [-0.34, 0.5, -0.04], scale: [0.04, 0.18, 0.04] },
  { groups: ["forearms"], position: [0.34, 0.5, 0.04], scale: [0.04, 0.18, 0.04] },
  { groups: ["forearms"], position: [0.34, 0.5, -0.04], scale: [0.04, 0.18, 0.04] },

  // Abs
  { groups: ["abs"], position: [0, 0.94, 0.18], scale: [0.07, 0.20, 0.018] },

  // Obliques
  { groups: ["obliques"], position: [-0.13, 0.92, 0.10], scale: [0.04, 0.16, 0.05] },
  { groups: ["obliques"], position: [0.13, 0.92, 0.10], scale: [0.04, 0.16, 0.05] },

  // Trapezius
  { groups: ["traps"], position: [0, 1.28, -0.13], scale: [0.18, 0.07, 0.04] },

  // Lats
  { groups: ["lats"], position: [-0.18, 1.0, -0.13], scale: [0.05, 0.20, 0.04] },
  { groups: ["lats"], position: [0.18, 1.0, -0.13], scale: [0.05, 0.20, 0.04] },

  // Lower back
  { groups: ["lower_back"], position: [0, 0.78, -0.16], scale: [0.07, 0.13, 0.03] },

  // Glutes
  { groups: ["glutes"], position: [-0.085, 0.43, -0.18], scale: [0.10, 0.12, 0.04] },
  { groups: ["glutes"], position: [0.085, 0.43, -0.18], scale: [0.10, 0.12, 0.04] },

  // Quads (front)
  { groups: ["quads"], position: [-0.13, 0.18, 0.13], scale: [0.075, 0.22, 0.025] },
  { groups: ["quads"], position: [0.13, 0.18, 0.13], scale: [0.075, 0.22, 0.025] },

  // Hamstrings (back)
  { groups: ["hamstrings"], position: [-0.13, 0.18, -0.13], scale: [0.075, 0.22, 0.025] },
  { groups: ["hamstrings"], position: [0.13, 0.18, -0.13], scale: [0.075, 0.22, 0.025] },

  // Adductors (inner thigh)
  { groups: ["adductors"], position: [-0.04, 0.18, 0], scale: [0.025, 0.20, 0.07] },
  { groups: ["adductors"], position: [0.04, 0.18, 0], scale: [0.025, 0.20, 0.07] },

  // Calves (back)
  { groups: ["calves"], position: [-0.13, -0.36, -0.13], scale: [0.06, 0.18, 0.025] },
  { groups: ["calves"], position: [0.13, -0.36, -0.13], scale: [0.06, 0.18, 0.025] },
];

function MuscleHighlights({ intensityFor }: BodyProps) {
  return (
    <group>
      {HIGHLIGHTS.map((h, i) => {
        const intensity = h.groups
          .map(intensityFor)
          .sort((a, b) => rank(b) - rank(a))[0];
        if (intensity === "idle") return null;
        return (
          <MuscleMesh
            key={i}
            position={h.position}
            scale={h.scale}
            intensity={intensity}
          />
        );
      })}
    </group>
  );
}

function rank(i: Intensity): number {
  if (i === "primary") return 2;
  if (i === "secondary") return 1;
  return 0;
}

interface MuscleMeshProps {
  position: [number, number, number];
  scale: [number, number, number];
  intensity: Intensity;
}

function MuscleMesh({ position, scale, intensity }: MuscleMeshProps) {
  const isPrimary = intensity === "primary";
  const color = isPrimary ? PRIMARY_COLOR : SECONDARY_COLOR;
  const emissive = isPrimary ? PRIMARY_EMISSIVE : SECONDARY_EMISSIVE;
  const emissiveIntensity = isPrimary ? 0.85 : 0.4;

  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.35}
        metalness={0.2}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}
