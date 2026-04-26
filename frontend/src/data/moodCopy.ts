/**
 * Copy za "Neovlašteni" UI ton — empatičan, ironičan, buntovnički.
 * NE koristiti za upute za vježbe. Upute ostaju strogo kineziološke.
 */

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export type WorkoutRecommendation =
  | "mobility"
  | "light_cardio"
  | "balanced"
  | "strength"
  | "heavy_strength";

export interface MoodResponse {
  level: EnergyLevel;
  label: string;
  headline: string;
  message: string;
  recommendation: WorkoutRecommendation;
  ctaLabel: string;
  accent: "mint" | "violet";
}

export const MOOD_COPY: Record<EnergyLevel, MoodResponse> = {
  1: {
    level: 1,
    label: "Mrtav puhao",
    headline: "OK. Danas ne ratujemo.",
    message:
      "Nisam ovlašten da ti budem psiholog, ali evo ti lagano istezanje da dođeš k sebi. Bez kilaže, bez ogledala, bez ega.",
    recommendation: "mobility",
    ctaLabel: "Lagana mobilnost (10 min)",
    accent: "violet",
  },
  2: {
    level: 2,
    label: "Tinjam",
    headline: "Manji plamen, isti rezultat.",
    message:
      "Ne forsiramo. Hodanje, par krugova disanja, malo zglobova. Sutra je novi dan, a teretana neće pobjeći.",
    recommendation: "light_cardio",
    ctaLabel: "Lagani cardio + mobilnost",
    accent: "violet",
  },
  3: {
    level: 3,
    label: "U sredini",
    headline: "Solidno. Idemo umjereno.",
    message:
      "Bez heroja. Balansiran trening, srednje opterećenje, fokus na tehniku. To se zove pametno, ne kukavički.",
    recommendation: "balanced",
    ctaLabel: "Balansirani trening (30 min)",
    accent: "mint",
  },
  4: {
    level: 4,
    label: "Ima goriva",
    headline: "Dobro. Vrijeme za posao.",
    message:
      "Imaš energije — iskoristi je pametno. Snaga, kompleksne vježbe, ali ne moraš nikome ništa dokazati.",
    recommendation: "strength",
    ctaLabel: "Trening snage (45 min)",
    accent: "mint",
  },
  5: {
    level: 5,
    label: "Pun pogon",
    headline: "Vidim te. Samo bez gluposti.",
    message:
      "Energija je tu, ali ego ostaje doma. Težak trening — uz čistu tehniku. Ozljeda te vraća dva mjeseca unatrag.",
    recommendation: "heavy_strength",
    ctaLabel: "Težak trening (60 min)",
    accent: "mint",
  },
};

export function getMoodResponse(level: number): MoodResponse {
  const clamped = Math.min(5, Math.max(1, Math.round(level))) as EnergyLevel;
  return MOOD_COPY[clamped];
}
