/**
 * Exercise dataset.
 *
 * Tone rules (STRICT):
 * - `instructions` are KINESIOLOGY — clinical, precise, no irony, no banter.
 *   They must be safe to follow as-is. Do NOT add motivational phrasing here.
 * - UI copy ("Gužva je", "Završio sam"...) lives in components, not here.
 *
 * Each exercise links to an `alternativeId` — the bodyweight / less-equipment
 * variant we offer when the user taps "Gužva je".
 */

export type WorkoutMode =
  | "mobility"
  | "light_cardio"
  | "balanced"
  | "strength"
  | "heavy_strength";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "core"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves"
  | "full_body";

export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: MuscleGroup[];
  equipment: "bodyweight" | "barbell" | "dumbbell" | "machine" | "bench" | "mat";
  /** Path to Lottie JSON (placeholder for now — files not yet shipped). */
  lottieFile: string;
  /** Strictly clinical, kinesiologically precise. */
  instructions: string[];
  /** Suggested rep/set scheme — for the SetLogger default values. */
  defaultSets: number;
  defaultReps: number;
  /** ID of the alternative exercise when gym is crowded. */
  alternativeId: string;
  /** Drives the SVG animation in LottiePlaceholder. */
  motion: MotionPattern;
}

/**
 * Motion patterns drive the placeholder animation.
 * - press:    push movement (bench press, push-up) — arms extend/retract
 * - squat:    bilateral knee/hip flexion (back squat, goblet squat)
 * - hinge:    posterior chain hip hinge (deadlift, RDL)
 * - row:      pull movement (db row, inverted row)
 * - flexion:  spine flexion/extension (cat–cow, dead bug)
 * - walk:     alternating leg sway (brisk walk)
 * - hold:     isometric, subtle breathing (plank, WGS)
 * - still:    no motion, only active-muscle pulse
 */
export type MotionPattern =
  | "press"
  | "squat"
  | "hinge"
  | "row"
  | "flexion"
  | "walk"
  | "hold"
  | "still";

export const EXERCISES: Record<string, Exercise> = {
  // ─── Strength / Heavy strength ─────────────────────────────────────────────
  bench_press: {
    id: "bench_press",
    name: "Bench press s ravnom šipkom",
    primaryMuscles: ["chest", "shoulders", "arms"],
    equipment: "barbell",
    lottieFile: "/lottie/bench_press.json",
    instructions: [
      "Klupa ravna. Stopala čvrsto na podu, šira od kukova.",
      "Lopatice retrahirane i depresirane, fiksirane uz klupu kroz cijelo izvođenje.",
      "Hvat širi od ramena za otprilike jedan dlan; zapešća u neutralnom položaju (iznad lakata).",
      "Šipku skidate s nosača s ravnim laktovima i vodite je iznad ramena.",
      "Spuštanje kontrolirano (2 s), dodir prsa u razini ksifoidnog nastavka.",
      "Lakti pod kutom približno 45° u odnosu na trup — ne razvlačiti vani, ne stiskati uz tijelo.",
      "Izdah na koncentričnoj fazi (potisak prema gore).",
    ],
    defaultSets: 4,
    defaultReps: 6,
    alternativeId: "push_up",
    motion: "press",
  },
  push_up: {
    id: "push_up",
    name: "Sklekovi",
    primaryMuscles: ["chest", "shoulders", "arms", "core"],
    equipment: "bodyweight",
    lottieFile: "/lottie/push_up.json",
    instructions: [
      "Tijelo u ravnoj liniji od glave do peta. Glutealna i trbušna muskulatura aktivirane.",
      "Šake u širini ramena, prsti usmjereni prema naprijed.",
      "Lakti pod kutom 30–45° u odnosu na trup.",
      "Spuštanje kontrolirano (2 s) do dodira prsa s podlogom ili 2 cm iznad.",
      "Lopatice se prirodno protrahiraju na vrhu — ne fiksirati ih.",
      "Glava u neutralnom položaju kralježnice; pogled prema podu.",
    ],
    defaultSets: 4,
    defaultReps: 12,
    alternativeId: "bench_press",
    motion: "press",
  },

  back_squat: {
    id: "back_squat",
    name: "Čučanj sa šipkom (back squat)",
    primaryMuscles: ["quads", "glutes", "core"],
    equipment: "barbell",
    lottieFile: "/lottie/back_squat.json",
    instructions: [
      "Šipka leži na gornjem dijelu trapeziusa (high-bar) — ne na vratu.",
      "Stopala u širini ramena, prsti blago rotirani prema van (10–20°).",
      "Trbušna i leđna muskulatura napete prije skidanja šipke s nosača.",
      "Spuštanje pokretom kuka i koljena istovremeno, kralježnica u neutralu.",
      "Dubina: zglob kuka ide ispod razine koljena (ako mobilnost dopušta), bez gubitka neutralne kralježnice.",
      "Koljena prate smjer prstiju — ne kolabirati prema unutra.",
      "Izdah na koncentričnoj fazi (ustajanje).",
    ],
    defaultSets: 4,
    defaultReps: 6,
    alternativeId: "goblet_squat",
    motion: "squat",
  },
  goblet_squat: {
    id: "goblet_squat",
    name: "Goblet čučanj",
    primaryMuscles: ["quads", "glutes", "core"],
    equipment: "dumbbell",
    lottieFile: "/lottie/goblet_squat.json",
    instructions: [
      "Bučica vertikalno ispred prsa, oba dlana podupiru gornji utor.",
      "Stopala u širini ramena, prsti blago vani.",
      "Lakti unutar koljena tijekom spuštanja.",
      "Spuštanje do dubine u kojoj zadržavate neutralnu kralježnicu.",
      "Težina ravnomjerno raspoređena na cijelo stopalo (ne na prste).",
    ],
    defaultSets: 3,
    defaultReps: 10,
    alternativeId: "back_squat",
    motion: "squat",
  },

  deadlift: {
    id: "deadlift",
    name: "Mrtvo dizanje (konvencionalno)",
    primaryMuscles: ["back", "glutes", "hamstrings", "core"],
    equipment: "barbell",
    lottieFile: "/lottie/deadlift.json",
    instructions: [
      "Šipka iznad sredine stopala, udaljenost potkoljenice od šipke 2–3 cm.",
      "Hvat širine ramena, ruke ravne; lopatice direktno iznad šipke u startnoj poziciji.",
      "Kralježnica u neutralu od križa do vrata; prsa otvorena, pogled u pod 2 m ispred.",
      "Pokret kreće potiskom poda (legs drive), šipka klizi uz potkoljenicu i bedro.",
      "Bokovi i ramena se podižu istovremeno — bokovi ne smiju 'odjuriti' prije ramena.",
      "Završna pozicija: puna ekstenzija kuka, bez hiperekstenzije lumbalnog dijela.",
      "Spuštanje kontrolirano, isti put — bok unatrag, šipka uz noge.",
    ],
    defaultSets: 3,
    defaultReps: 5,
    alternativeId: "romanian_deadlift_db",
    motion: "hinge",
  },
  romanian_deadlift_db: {
    id: "romanian_deadlift_db",
    name: "Rumunjsko mrtvo dizanje s bučicama",
    primaryMuscles: ["hamstrings", "glutes", "back"],
    equipment: "dumbbell",
    lottieFile: "/lottie/rdl_db.json",
    instructions: [
      "Bučice ispred bedara, dlanovi okrenuti prema tijelu.",
      "Koljena lagano savijena (15–20°) i fiksirana — kut se NE mijenja tijekom pokreta.",
      "Pokret kreće potiskom kukova unatrag (hip hinge); kralježnica u neutralu.",
      "Spuštanje do osjećaja istezanja u stražnjoj loži (obično sredina potkoljenice ili koljeno).",
      "Bučice klize uz prednju stranu nogu, ne udaljavati ih od tijela.",
      "Povratak kontrahirajući glutealnu muskulaturu, bez hiperekstenzije lumbalno.",
    ],
    defaultSets: 3,
    defaultReps: 10,
    alternativeId: "deadlift",
    motion: "hinge",
  },

  // ─── Balanced ──────────────────────────────────────────────────────────────
  db_row: {
    id: "db_row",
    name: "Jednoručno veslanje s bučicom",
    primaryMuscles: ["back", "arms"],
    equipment: "dumbbell",
    lottieFile: "/lottie/db_row.json",
    instructions: [
      "Jedno koljeno i istostrana šaka oslonjeni na klupu; oslonjena strana neutralna.",
      "Druga noga čvrsto na podu, lagano savijena.",
      "Trup paralelan s podom, kralježnica u neutralu.",
      "Bučica visi iz ramena s ispruženom rukom; lopatica u protrakciji na startu.",
      "Povlačenje uz tijelo prema kuku, lakat klizi uz rebra.",
      "Završna pozicija: lopatica retrahirana, lakat iznad razine trupa.",
      "Spuštanje kontrolirano (2 s) do pune ekstenzije.",
    ],
    defaultSets: 3,
    defaultReps: 10,
    alternativeId: "inverted_row",
    motion: "row",
  },
  inverted_row: {
    id: "inverted_row",
    name: "Obrnuto veslanje (TRX / niska šipka)",
    primaryMuscles: ["back", "arms", "core"],
    equipment: "bodyweight",
    lottieFile: "/lottie/inverted_row.json",
    instructions: [
      "Šipka u visini struka; vješate se ispod nje s ispruženim rukama.",
      "Tijelo u ravnoj liniji, peta na podu, glutealna i trbušna muskulatura aktivirane.",
      "Hvat širi od ramena, dlanovi prema gore ili neutralno.",
      "Povlačenje prsima prema šipki, lakti pod kutom 45° prema trupu.",
      "Lopatice retrahirane na vrhu pokreta.",
      "Spuštanje kontrolirano do pune ekstenzije lakta.",
    ],
    defaultSets: 3,
    defaultReps: 10,
    alternativeId: "db_row",
    motion: "row",
  },

  // ─── Light cardio / Mobility ───────────────────────────────────────────────
  cat_cow: {
    id: "cat_cow",
    name: "Mačka–krava (mobilnost kralježnice)",
    primaryMuscles: ["core", "back"],
    equipment: "mat",
    lottieFile: "/lottie/cat_cow.json",
    instructions: [
      "Pozicija na sve četiri: šake direktno ispod ramena, koljena ispod kukova.",
      "Stopala u širini kukova, prsti opušteni.",
      "Udah: pomak u ekstenziju — trbuh prema podu, prsa naprijed, pogled blago prema gore.",
      "Izdah: pomak u fleksiju — leđa zaokružena, brada prema prsima, pupak prema kralježnici.",
      "Pokret se zaustavlja u rasponu bez boli; rasponi se mijenjaju segmentno.",
    ],
    defaultSets: 2,
    defaultReps: 10,
    alternativeId: "world_greatest_stretch",
    motion: "flexion",
  },
  world_greatest_stretch: {
    id: "world_greatest_stretch",
    name: "World's Greatest Stretch",
    primaryMuscles: ["full_body"],
    equipment: "mat",
    lottieFile: "/lottie/wgs.json",
    instructions: [
      "Iz uspravnog stava, zakorak naprijed u duboki low-lunge (npr. desnom).",
      "Istostrana šaka (desna) postavlja se uz unutarnju stranu prednjeg stopala.",
      "Suprotnom rukom (lijevom) rotirate trup i otvarate prsa prema gore.",
      "Pogled prati ruku; vrat u liniji s kralježnicom.",
      "Zadržavanje 2–3 s, povratak u low-lunge, izmjena strane.",
    ],
    defaultSets: 2,
    defaultReps: 6,
    alternativeId: "cat_cow",
    motion: "hold",
  },

  brisk_walk: {
    id: "brisk_walk",
    name: "Brzo hodanje (Zone 2)",
    primaryMuscles: ["full_body"],
    equipment: "bodyweight",
    lottieFile: "/lottie/brisk_walk.json",
    instructions: [
      "Tempo: razgovor moguć, pjevanje nije (RPE 4–5 / 10).",
      "Držanje uspravno, ramena spuštena, pogled 5–10 m ispred.",
      "Ruke prirodno klate uz tijelo, lakti pod kutom 90°.",
      "Disanje nosom kad god je moguće, izdah produžen.",
      "Trajanje: 20–30 minuta kontinuirano.",
    ],
    defaultSets: 1,
    defaultReps: 1,
    alternativeId: "cat_cow",
    motion: "walk",
  },

  plank: {
    id: "plank",
    name: "Daska (plank)",
    primaryMuscles: ["core", "shoulders"],
    equipment: "mat",
    lottieFile: "/lottie/plank.json",
    instructions: [
      "Podlaktice na podu, lakti direktno ispod ramena, šake u liniji s podlakticom.",
      "Tijelo u ravnoj liniji od glave do peta — bez propuštanja kukova ili podizanja stražnjice.",
      "Glutealna i trbušna muskulatura aktivirane; rebra povučena prema kukovima.",
      "Vrat neutralan, pogled prema podu između šaka.",
      "Disanje normalno — bez zadržavanja zraka.",
    ],
    defaultSets: 3,
    defaultReps: 1,
    alternativeId: "dead_bug",
    motion: "hold",
  },
  dead_bug: {
    id: "dead_bug",
    name: "Dead bug",
    primaryMuscles: ["core"],
    equipment: "mat",
    lottieFile: "/lottie/dead_bug.json",
    instructions: [
      "Leđa na podu, križni dio u kontaktu s podlogom kroz cijelo izvođenje.",
      "Kukovi i koljena pod kutom 90°, ruke ispružene prema stropu iznad ramena.",
      "Suprotna ruka i noga ekstendiraju se istovremeno do 5 cm iznad poda.",
      "Križni dio ostaje u kontaktu s podlogom — ako se odiže, smanjite raspon.",
      "Povratak kontrolirano u start, izmjena strane.",
    ],
    defaultSets: 3,
    defaultReps: 8,
    alternativeId: "plank",
    motion: "flexion",
  },
};

/** Default workout (3 vježbe) po modu. */
export const WORKOUT_TRACKS: Record<WorkoutMode, string[]> = {
  mobility: ["cat_cow", "world_greatest_stretch", "dead_bug"],
  light_cardio: ["brisk_walk", "cat_cow", "plank"],
  balanced: ["goblet_squat", "db_row", "plank"],
  strength: ["bench_press", "db_row", "goblet_squat"],
  heavy_strength: ["back_squat", "bench_press", "deadlift"],
};

export const MODE_LABEL: Record<WorkoutMode, string> = {
  mobility: "Lagana mobilnost",
  light_cardio: "Lagani cardio + mobilnost",
  balanced: "Balansirani trening",
  strength: "Trening snage",
  heavy_strength: "Težak trening",
};

export function getExercise(id: string): Exercise {
  const ex = EXERCISES[id];
  if (!ex) throw new Error(`Unknown exercise: ${id}`);
  return ex;
}

export function getTrack(mode: WorkoutMode): Exercise[] {
  return WORKOUT_TRACKS[mode].map(getExercise);
}

export const ALL_EXERCISES: Exercise[] = Object.values(EXERCISES);

export const MUSCLE_LABEL: Record<MuscleGroup, string> = {
  chest: "Prsa",
  back: "Leđa",
  shoulders: "Ramena",
  arms: "Ruke",
  core: "Trbuh",
  glutes: "Glutei",
  quads: "Kvadricepsi",
  hamstrings: "Stražnja loža",
  calves: "Listovi",
  full_body: "Cijelo tijelo",
};

export const EQUIPMENT_LABEL: Record<Exercise["equipment"], string> = {
  bodyweight: "Bez opreme",
  barbell: "Šipka",
  dumbbell: "Bučice",
  machine: "Sprava",
  bench: "Klupa",
  mat: "Strunjača",
};
