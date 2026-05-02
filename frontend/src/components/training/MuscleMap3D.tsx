"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { MuscleGroup } from "@/data/exercises";
import { MUSCLE_LABEL } from "@/data/exercises";
import { cn } from "@/lib/cn";

/**
 * Pravi 3D anatomski model — Three.js kroz react-three-fiber.
 *
 * Tijelo je sastavljeno od primitive shape-ova (sfere, kapsule, kutije)
 * pozicioniranih anatomski. Svaka mišićna skupina je zaseban mesh koji se
 * boji prema intenzitetu (primary mint glow, secondary violet, idle gray).
 *
 * Auto-rotira polako kako bi se vidjeli i prednji i stražnji mišići bez
 * potrebe za manualnom interakcijom; korisnik može i dragom rotirati.
 */

interface MuscleMap3DProps {
  primary: MuscleGroup[];
  secondary?: MuscleGroup[];
  exerciseName: string;
  className?: string;
}

type Intensity = "primary" | "secondary" | "idle";

// Visual constants
const SKIN = "#3D3D3D";
const SKIN_DARK = "#2A2A2A";
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

      <div className="relative h-96 w-full">
        <Canvas
          camera={{ position: [0, 0.6, 3.4], fov: 32 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true }}
        >
          <Lighting />
          <Suspense fallback={null}>
            <BodyRig intensityFor={intensityFor} />
          </Suspense>
          <OrbitControls
            autoRotate
            autoRotateSpeed={1.4}
            enablePan={false}
            enableZoom={false}
            target={[0, 0.55, 0]}
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
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.0} color="#FFFFFF" />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.35}
        color="#A6F0CE"
      />
      <pointLight position={[0, 1, 3]} intensity={0.4} color="#A892E8" />
    </>
  );
}

interface BodyProps {
  intensityFor: (m: MuscleGroup) => Intensity;
}

function BodyRig({ intensityFor }: BodyProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle "breathing" idle animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.01;
  });

  return (
    <group ref={groupRef}>
      <BaseBody />
      <Muscles intensityFor={intensityFor} />
    </group>
  );
}

/* ── Skeleton/base body — always visible, gray ───────────────────────────── */

function BaseBody() {
  const skinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: SKIN,
        roughness: 0.65,
        metalness: 0.08,
      }),
    []
  );
  const skinDarkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: SKIN_DARK,
        roughness: 0.7,
        metalness: 0.05,
      }),
    []
  );

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.62, 0]} material={skinMat}>
        <sphereGeometry args={[0.16, 32, 32]} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.43, 0]} material={skinDarkMat}>
        <cylinderGeometry args={[0.06, 0.075, 0.1, 16]} />
      </mesh>

      {/* Torso (chest + abs combined) — capsule for smooth shape */}
      <mesh position={[0, 1.12, 0]} material={skinMat} scale={[1.25, 1, 0.7]}>
        <capsuleGeometry args={[0.16, 0.32, 8, 24]} />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, 0.62, 0]} material={skinMat} scale={[1.05, 1, 0.85]}>
        <capsuleGeometry args={[0.14, 0.05, 6, 18]} />
      </mesh>

      {/* Shoulder joints */}
      <mesh position={[-0.24, 1.36, 0]} material={skinMat}>
        <sphereGeometry args={[0.085, 24, 24]} />
      </mesh>
      <mesh position={[0.24, 1.36, 0]} material={skinMat}>
        <sphereGeometry args={[0.085, 24, 24]} />
      </mesh>

      {/* Upper arms */}
      <mesh position={[-0.28, 1.1, 0]} material={skinDarkMat}>
        <capsuleGeometry args={[0.055, 0.32, 6, 16]} />
      </mesh>
      <mesh position={[0.28, 1.1, 0]} material={skinDarkMat}>
        <capsuleGeometry args={[0.055, 0.32, 6, 16]} />
      </mesh>

      {/* Elbows */}
      <mesh position={[-0.29, 0.78, 0]} material={skinDarkMat}>
        <sphereGeometry args={[0.055, 16, 16]} />
      </mesh>
      <mesh position={[0.29, 0.78, 0]} material={skinDarkMat}>
        <sphereGeometry args={[0.055, 16, 16]} />
      </mesh>

      {/* Forearms */}
      <mesh position={[-0.31, 0.55, 0]} material={skinDarkMat}>
        <capsuleGeometry args={[0.05, 0.32, 6, 16]} />
      </mesh>
      <mesh position={[0.31, 0.55, 0]} material={skinDarkMat}>
        <capsuleGeometry args={[0.05, 0.32, 6, 16]} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.32, 0.32, 0]} material={skinDarkMat} scale={[1, 1.3, 0.55]}>
        <sphereGeometry args={[0.055, 16, 16]} />
      </mesh>
      <mesh position={[0.32, 0.32, 0]} material={skinDarkMat} scale={[1, 1.3, 0.55]}>
        <sphereGeometry args={[0.055, 16, 16]} />
      </mesh>

      {/* Hip joints */}
      <mesh position={[-0.1, 0.5, 0]} material={skinMat}>
        <sphereGeometry args={[0.085, 20, 20]} />
      </mesh>
      <mesh position={[0.1, 0.5, 0]} material={skinMat}>
        <sphereGeometry args={[0.085, 20, 20]} />
      </mesh>

      {/* Thighs */}
      <mesh position={[-0.12, 0.2, 0]} material={skinMat}>
        <capsuleGeometry args={[0.085, 0.42, 8, 18]} />
      </mesh>
      <mesh position={[0.12, 0.2, 0]} material={skinMat}>
        <capsuleGeometry args={[0.085, 0.42, 8, 18]} />
      </mesh>

      {/* Knees */}
      <mesh position={[-0.12, -0.1, 0]} material={skinDarkMat}>
        <sphereGeometry args={[0.075, 18, 18]} />
      </mesh>
      <mesh position={[0.12, -0.1, 0]} material={skinDarkMat}>
        <sphereGeometry args={[0.075, 18, 18]} />
      </mesh>

      {/* Calves */}
      <mesh position={[-0.13, -0.4, 0]} material={skinDarkMat}>
        <capsuleGeometry args={[0.07, 0.36, 8, 16]} />
      </mesh>
      <mesh position={[0.13, -0.4, 0]} material={skinDarkMat}>
        <capsuleGeometry args={[0.07, 0.36, 8, 16]} />
      </mesh>

      {/* Ankles */}
      <mesh position={[-0.13, -0.7, 0]} material={skinDarkMat}>
        <sphereGeometry args={[0.06, 14, 14]} />
      </mesh>
      <mesh position={[0.13, -0.7, 0]} material={skinDarkMat}>
        <sphereGeometry args={[0.06, 14, 14]} />
      </mesh>

      {/* Feet */}
      <mesh
        position={[-0.13, -0.78, 0.07]}
        material={skinDarkMat}
        scale={[1.4, 0.55, 2.2]}
      >
        <boxGeometry args={[0.08, 0.05, 0.08]} />
      </mesh>
      <mesh
        position={[0.13, -0.78, 0.07]}
        material={skinDarkMat}
        scale={[1.4, 0.55, 2.2]}
      >
        <boxGeometry args={[0.08, 0.05, 0.08]} />
      </mesh>
    </group>
  );
}

/* ── Muscle highlights — colored when active ─────────────────────────────── */

interface MuscleHighlight {
  groups: MuscleGroup[];
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  shape?: "sphere" | "box" | "capsule";
}

const HIGHLIGHTS: MuscleHighlight[] = [
  // Pectorals
  { groups: ["chest"], position: [-0.085, 1.22, 0.16], scale: [0.11, 0.11, 0.05] },
  { groups: ["chest"], position: [0.085, 1.22, 0.16], scale: [0.11, 0.11, 0.05] },

  // Anterior deltoids
  { groups: ["shoulders_front"], position: [-0.22, 1.4, 0.06], scale: [0.07, 0.06, 0.06] },
  { groups: ["shoulders_front"], position: [0.22, 1.4, 0.06], scale: [0.07, 0.06, 0.06] },

  // Lateral deltoids (visible from side)
  { groups: ["shoulders_side"], position: [-0.295, 1.38, 0], scale: [0.05, 0.07, 0.07] },
  { groups: ["shoulders_side"], position: [0.295, 1.38, 0], scale: [0.05, 0.07, 0.07] },

  // Posterior deltoids
  { groups: ["shoulders_rear"], position: [-0.22, 1.4, -0.06], scale: [0.07, 0.06, 0.06] },
  { groups: ["shoulders_rear"], position: [0.22, 1.4, -0.06], scale: [0.07, 0.06, 0.06] },

  // Biceps (front of upper arm)
  { groups: ["biceps"], position: [-0.28, 1.12, 0.05], scale: [0.04, 0.13, 0.04] },
  { groups: ["biceps"], position: [0.28, 1.12, 0.05], scale: [0.04, 0.13, 0.04] },

  // Triceps (back of upper arm)
  { groups: ["triceps"], position: [-0.28, 1.12, -0.05], scale: [0.04, 0.13, 0.04] },
  { groups: ["triceps"], position: [0.28, 1.12, -0.05], scale: [0.04, 0.13, 0.04] },

  // Forearms (visible all around)
  { groups: ["forearms"], position: [-0.31, 0.55, 0.04], scale: [0.04, 0.16, 0.04] },
  { groups: ["forearms"], position: [-0.31, 0.55, -0.04], scale: [0.04, 0.16, 0.04] },
  { groups: ["forearms"], position: [0.31, 0.55, 0.04], scale: [0.04, 0.16, 0.04] },
  { groups: ["forearms"], position: [0.31, 0.55, -0.04], scale: [0.04, 0.16, 0.04] },

  // Rectus abdominis
  { groups: ["abs"], position: [0, 0.95, 0.16], scale: [0.07, 0.20, 0.04], shape: "box" },

  // Obliques
  { groups: ["obliques"], position: [-0.13, 0.95, 0.10], scale: [0.04, 0.16, 0.06] },
  { groups: ["obliques"], position: [0.13, 0.95, 0.10], scale: [0.04, 0.16, 0.06] },

  // Trapezius (top of back, around neck)
  { groups: ["traps"], position: [0, 1.38, -0.08], scale: [0.18, 0.07, 0.06] },

  // Latissimus dorsi (sides of back)
  { groups: ["lats"], position: [-0.17, 1.05, -0.10], scale: [0.05, 0.20, 0.06] },
  { groups: ["lats"], position: [0.17, 1.05, -0.10], scale: [0.05, 0.20, 0.06] },

  // Lower back (erector spinae)
  { groups: ["lower_back"], position: [0, 0.78, -0.13], scale: [0.07, 0.13, 0.04] },

  // Glutes
  { groups: ["glutes"], position: [-0.085, 0.5, -0.13], scale: [0.10, 0.12, 0.07] },
  { groups: ["glutes"], position: [0.085, 0.5, -0.13], scale: [0.10, 0.12, 0.07] },

  // Quadriceps (front of thigh)
  { groups: ["quads"], position: [-0.115, 0.22, 0.085], scale: [0.075, 0.22, 0.04] },
  { groups: ["quads"], position: [0.115, 0.22, 0.085], scale: [0.075, 0.22, 0.04] },

  // Hamstrings (back of thigh)
  { groups: ["hamstrings"], position: [-0.115, 0.22, -0.085], scale: [0.075, 0.22, 0.04] },
  { groups: ["hamstrings"], position: [0.115, 0.22, -0.085], scale: [0.075, 0.22, 0.04] },

  // Adductors (inner thigh)
  { groups: ["adductors"], position: [-0.04, 0.22, 0], scale: [0.025, 0.20, 0.07] },
  { groups: ["adductors"], position: [0.04, 0.22, 0], scale: [0.025, 0.20, 0.07] },

  // Calves (back of lower leg)
  { groups: ["calves"], position: [-0.13, -0.38, -0.07], scale: [0.06, 0.18, 0.05] },
  { groups: ["calves"], position: [0.13, -0.38, -0.07], scale: [0.06, 0.18, 0.05] },
];

function Muscles({ intensityFor }: BodyProps) {
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
            rotation={h.rotation}
            shape={h.shape ?? "sphere"}
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
  rotation?: [number, number, number];
  shape: "sphere" | "box" | "capsule";
  intensity: Intensity;
}

function MuscleMesh({
  position,
  scale,
  rotation,
  shape,
  intensity,
}: MuscleMeshProps) {
  const isPrimary = intensity === "primary";
  const color = isPrimary ? PRIMARY_COLOR : SECONDARY_COLOR;
  const emissive = isPrimary ? PRIMARY_EMISSIVE : SECONDARY_EMISSIVE;
  const emissiveIntensity = isPrimary ? 0.7 : 0.35;

  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      {shape === "box" ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : shape === "capsule" ? (
        <capsuleGeometry args={[0.5, 0.5, 6, 12]} />
      ) : (
        <sphereGeometry args={[1, 16, 16]} />
      )}
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.45}
        metalness={0.15}
      />
    </mesh>
  );
}
