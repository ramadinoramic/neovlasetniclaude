/**
 * Exercise dataset.
 *
 * Tone rules (STRICT):
 * - `cues` are KINESIOLOGY — clinical, precise. No banter.
 * - UI copy lives in components, not here.
 */

export type WorkoutMode =
  | "mobility"
  | "light_cardio"
  | "balanced"
  | "strength"
  | "heavy_strength";

export type MuscleGroup =
  | "chest"
  | "shoulders_front"
  | "shoulders_side"
  | "shoulders_rear"
  | "biceps"
  | "triceps"
  | "forearms"
  | "abs"
  | "obliques"
  | "lats"
  | "traps"
  | "lower_back"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "adductors"
  | "calves"
  | "full_body";

export type Equipment =
  | "bodyweight"
  | "barbell"
  | "dumbbell"
  | "kettlebell"
  | "machine"
  | "bench"
  | "mat";

export type Level = "beginner" | "intermediate" | "advanced";

export type MotionPattern =
  | "press"
  | "squat"
  | "hinge"
  | "row"
  | "flexion"
  | "walk"
  | "hold"
  | "still";

export type MovementPattern =
  | "push_horizontal"
  | "push_vertical"
  | "pull_horizontal"
  | "pull_vertical"
  | "squat"
  | "hinge"
  | "lunge"
  | "core"
  | "carry"
  | "conditioning"
  | "mobility";

export interface Exercise {
  id: string;
  name: string;
  movementPattern: MovementPattern;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  level: Level;
  motion: MotionPattern;
  instructions: string[];
  defaultSets: number;
  defaultReps: string;
  restSec: number;
  alternativeId: string;
  videoUrl?: string;
}

export const EXERCISES: Record<string, Exercise> = {
  // ─── PUSH HORIZONTAL ───────────────────────────────────────────────────────
  bench_press: {
    id: "bench_press",
    name: "Bench press s ravnom šipkom",
    movementPattern: "push_horizontal",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["shoulders_front", "triceps"],
    equipment: "barbell",
    level: "intermediate",
    motion: "press",
    instructions: [
      "Klupa ravna. Stopala čvrsto na podu, šira od kukova.",
      "Lopatice retrahirane i depresirane, fiksirane uz klupu.",
      "Hvat širi od ramena, zapešća iznad lakata.",
      "Spuštanje 2 s; dodir prsa u razini ksifoidnog nastavka.",
      "Lakti pod ~45° u odnosu na trup; izdah u potisku.",
    ],
    defaultSets: 4,
    defaultReps: "5",
    restSec: 180,
    alternativeId: "push_up",
  },
  push_up: {
    id: "push_up",
    name: "Sklekovi",
    movementPattern: "push_horizontal",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["shoulders_front", "triceps", "abs"],
    equipment: "bodyweight",
    level: "beginner",
    motion: "press",
    instructions: [
      "Tijelo u ravnoj liniji od glave do peta; glutealna i trbušna napete.",
      "Šake u širini ramena, prsti naprijed.",
      "Lakti pod 30–45° u odnosu na trup.",
      "Spuštanje 2 s do dodira prsa s podlogom.",
      "Vrat neutralan; pogled prema podu između šaka.",
    ],
    defaultSets: 4,
    defaultReps: "10–15",
    restSec: 75,
    alternativeId: "incline_db_press",
  },
  incline_db_press: {
    id: "incline_db_press",
    name: "Bench press s bučicama, kosa klupa",
    movementPattern: "push_horizontal",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["shoulders_front", "triceps"],
    equipment: "dumbbell",
    level: "intermediate",
    motion: "press",
    instructions: [
      "Klupa pod kutom 30°; stopala čvrsto na podu.",
      "Bučice u visini ramena, zapešća iznad lakata, dlanovi prema naprijed.",
      "Lopatice retrahirane i depresirane.",
      "Spuštanje 2 s do razine prsa; potisak ravno gore, ne unutra.",
    ],
    defaultSets: 3,
    defaultReps: "8–10",
    restSec: 90,
    alternativeId: "push_up",
  },

  // ─── PUSH VERTICAL ─────────────────────────────────────────────────────────
  overhead_press: {
    id: "overhead_press",
    name: "Vojnički potisak (overhead press)",
    movementPattern: "push_vertical",
    primaryMuscles: ["shoulders_front"],
    secondaryMuscles: ["triceps", "shoulders_side", "abs"],
    equipment: "barbell",
    level: "intermediate",
    motion: "press",
    instructions: [
      "Šipka na prednjim deltoidima; hvat širine ramena.",
      "Trbuh i glutealni zategnuti; rebra povučena prema kukovima.",
      "Potisak ravno iznad glave; glava se izvlači naprijed kad šipka prođe.",
      "Završno: šipka iznad sredine stopala, lakti puna ekstenzija.",
    ],
    defaultSets: 4,
    defaultReps: "5",
    restSec: 150,
    alternativeId: "shoulder_press_db",
  },
  shoulder_press_db: {
    id: "shoulder_press_db",
    name: "Potisak iznad glave s bučicama",
    movementPattern: "push_vertical",
    primaryMuscles: ["shoulders_front"],
    secondaryMuscles: ["shoulders_side", "triceps"],
    equipment: "dumbbell",
    level: "beginner",
    motion: "press",
    instructions: [
      "Sjedeći ili stojeći; bučice u visini ramena, dlanovi naprijed.",
      "Lopatice retrahirane; lumbalni dio neutralno.",
      "Potisak gore u liniji ramena; bučice se ne sudaraju.",
      "Spuštanje kontrolirano do startne pozicije.",
    ],
    defaultSets: 3,
    defaultReps: "8–10",
    restSec: 90,
    alternativeId: "overhead_press",
  },
  side_lateral_raise: {
    id: "side_lateral_raise",
    name: "Bočno odručenje s bučicama",
    movementPattern: "push_vertical",
    primaryMuscles: ["shoulders_side"],
    secondaryMuscles: ["traps"],
    equipment: "dumbbell",
    level: "beginner",
    motion: "still",
    instructions: [
      "Stoj uspravno; bučice uz tijelo, lakti blago savijeni.",
      "Podizanje u stranu do visine ramena; ne više.",
      "Vrh lakta vodi pokret, ne šaka.",
      "Spuštanje 3 s, kontrolirano.",
    ],
    defaultSets: 3,
    defaultReps: "12–15",
    restSec: 60,
    alternativeId: "shoulder_press_db",
  },

  // ─── PULL HORIZONTAL ───────────────────────────────────────────────────────
  barbell_row: {
    id: "barbell_row",
    name: "Veslanje sa šipkom u pretklonu",
    movementPattern: "pull_horizontal",
    primaryMuscles: ["lats"],
    secondaryMuscles: ["traps", "biceps", "lower_back", "shoulders_rear"],
    equipment: "barbell",
    level: "intermediate",
    motion: "row",
    instructions: [
      "Hip hinge do trupa ~45° prema podu; kralježnica neutralna.",
      "Hvat širine ramena; ruke ravne.",
      "Povlačenje šipke prema donjim rebrima; lakti uz tijelo.",
      "Lopatice retrahirane na vrhu; spuštanje kontrolirano 2 s.",
    ],
    defaultSets: 4,
    defaultReps: "6–8",
    restSec: 120,
    alternativeId: "db_row",
  },
  db_row: {
    id: "db_row",
    name: "Jednoručno veslanje s bučicom",
    movementPattern: "pull_horizontal",
    primaryMuscles: ["lats"],
    secondaryMuscles: ["traps", "biceps", "shoulders_rear"],
    equipment: "dumbbell",
    level: "beginner",
    motion: "row",
    instructions: [
      "Jedno koljeno i istostrana šaka oslonjeni na klupu.",
      "Trup paralelan s podom, kralježnica neutralna.",
      "Povlačenje uz tijelo prema kuku; lakat klizi uz rebra.",
      "Lopatica retrahirana na vrhu; spuštanje 2 s.",
    ],
    defaultSets: 3,
    defaultReps: "10",
    restSec: 75,
    alternativeId: "inverted_row",
  },
  inverted_row: {
    id: "inverted_row",
    name: "Obrnuto veslanje (TRX / niska šipka)",
    movementPattern: "pull_horizontal",
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "abs", "shoulders_rear"],
    equipment: "bodyweight",
    level: "beginner",
    motion: "row",
    instructions: [
      "Šipka u visini struka; vješate se s ispruženim rukama.",
      "Tijelo u ravnoj liniji; peta na podu.",
      "Povlačenje prsima prema šipki; lakti pod ~45°.",
      "Lopatice retrahirane na vrhu; spuštanje do pune ekstenzije.",
    ],
    defaultSets: 3,
    defaultReps: "10–12",
    restSec: 75,
    alternativeId: "db_row",
  },
  pullup: {
    id: "pullup",
    name: "Zgib (pullup)",
    movementPattern: "pull_vertical",
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "traps", "shoulders_rear"],
    equipment: "bodyweight",
    level: "advanced",
    motion: "row",
    instructions: [
      "Hvat širi od ramena, dlanovi naprijed.",
      "Iz pune ekstenzije, retrakcija lopatica prvo, zatim povlačenje.",
      "Brada iznad šipke; lakti se vode prema dolje i unatrag.",
      "Spuštanje 2 s; bez ljuljanja.",
    ],
    defaultSets: 4,
    defaultReps: "5–8",
    restSec: 150,
    alternativeId: "inverted_row",
  },

  // ─── ARMS (isolation) ──────────────────────────────────────────────────────
  bicep_curl: {
    id: "bicep_curl",
    name: "Pregib s bučicama (biceps curl)",
    movementPattern: "pull_horizontal",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    equipment: "dumbbell",
    level: "beginner",
    motion: "row",
    instructions: [
      "Stoj uspravno; bučice uz tijelo, dlanovi prema naprijed.",
      "Lakti fiksirani uz trup — ne pomicati ih naprijed.",
      "Pregib do potpune kontrakcije bicepsa.",
      "Spuštanje 2 s do pune ekstenzije.",
    ],
    defaultSets: 3,
    defaultReps: "10–12",
    restSec: 60,
    alternativeId: "inverted_row",
  },
  tricep_pushdown: {
    id: "tricep_pushdown",
    name: "Triceps potisak na koloturi",
    movementPattern: "push_horizontal",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["forearms"],
    equipment: "machine",
    level: "beginner",
    motion: "press",
    instructions: [
      "Stoj okrenut prema koloturi; lakti uz tijelo, fiksirani.",
      "Hvat širine ramena; početni kut lakta ~90°.",
      "Ekstenzija lakta do pune kontrakcije tricepsa.",
      "Povratak kontrolirano 2 s.",
    ],
    defaultSets: 3,
    defaultReps: "10–15",
    restSec: 60,
    alternativeId: "push_up",
  },

  // ─── SQUAT ─────────────────────────────────────────────────────────────────
  back_squat: {
    id: "back_squat",
    name: "Čučanj sa šipkom (back squat)",
    movementPattern: "squat",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "lower_back", "abs", "adductors"],
    equipment: "barbell",
    level: "intermediate",
    motion: "squat",
    instructions: [
      "Šipka na gornjem trapeziusu (high-bar) — ne na vratu.",
      "Stopala u širini ramena, prsti blago vani (10–20°).",
      "Trbuh i leđa napeti prije skidanja; spuštanje istovremeno kuka i koljena.",
      "Dubina: zglob kuka ispod razine koljena ako mobilnost dopušta.",
      "Koljena prate smjer prstiju; izdah u ustajanju.",
    ],
    defaultSets: 4,
    defaultReps: "5",
    restSec: 180,
    alternativeId: "goblet_squat",
  },
  front_squat: {
    id: "front_squat",
    name: "Prednji čučanj (front squat)",
    movementPattern: "squat",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["abs", "glutes", "lower_back"],
    equipment: "barbell",
    level: "advanced",
    motion: "squat",
    instructions: [
      "Šipka na prednjim deltoidima; lakti visoko, prsti ispod šipke.",
      "Trup uspravan; trbušna i leđna muskulatura aktivirane.",
      "Spuštanje pravo dolje; koljena prate stopala.",
      "Dubina ispod paralele bez gubitka neutralne kralježnice.",
    ],
    defaultSets: 4,
    defaultReps: "5",
    restSec: 180,
    alternativeId: "back_squat",
  },
  goblet_squat: {
    id: "goblet_squat",
    name: "Goblet čučanj",
    movementPattern: "squat",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "abs", "adductors"],
    equipment: "dumbbell",
    level: "beginner",
    motion: "squat",
    instructions: [
      "Bučica vertikalno ispred prsa; oba dlana podupiru utor.",
      "Stopala u širini ramena; prsti blago vani.",
      "Lakti unutar koljena tijekom spuštanja.",
      "Spuštanje do dubine s neutralnom kralježnicom.",
    ],
    defaultSets: 3,
    defaultReps: "10",
    restSec: 75,
    alternativeId: "back_squat",
  },
  bulgarian_split_squat: {
    id: "bulgarian_split_squat",
    name: "Bugarski split čučanj",
    movementPattern: "lunge",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings", "adductors"],
    equipment: "dumbbell",
    level: "intermediate",
    motion: "squat",
    instructions: [
      "Stražnje stopalo na klupi (rist na podlozi).",
      "Prednje stopalo dovoljno daleko da koljeno ne prelazi prste pri spuštanju.",
      "Trup uspravan; spuštanje stražnjeg koljena prema podu.",
      "Težina prednje pete; potisak iz cijelog stopala.",
    ],
    defaultSets: 3,
    defaultReps: "8 / nogu",
    restSec: 90,
    alternativeId: "goblet_squat",
  },

  // ─── HINGE ─────────────────────────────────────────────────────────────────
  deadlift: {
    id: "deadlift",
    name: "Mrtvo dizanje (konvencionalno)",
    movementPattern: "hinge",
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back", "lats", "traps", "forearms"],
    equipment: "barbell",
    level: "advanced",
    motion: "hinge",
    instructions: [
      "Šipka iznad sredine stopala; potkoljenica 2–3 cm od šipke.",
      "Hvat širine ramena, ruke ravne; lopatice iznad šipke.",
      "Kralježnica neutralna; prsa otvorena, pogled u pod 2 m ispred.",
      "Pokret kreće potiskom poda; bokovi i ramena se podižu istovremeno.",
      "Završno: puna ekstenzija kuka, bez hiperekstenzije lumbalno.",
    ],
    defaultSets: 3,
    defaultReps: "5",
    restSec: 180,
    alternativeId: "romanian_deadlift_db",
  },
  romanian_deadlift_db: {
    id: "romanian_deadlift_db",
    name: "Rumunjsko mrtvo dizanje s bučicama",
    movementPattern: "hinge",
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["glutes", "lower_back"],
    equipment: "dumbbell",
    level: "beginner",
    motion: "hinge",
    instructions: [
      "Bučice ispred bedara; dlanovi prema tijelu.",
      "Koljena lagano savijena (15–20°), kut se NE mijenja.",
      "Hip hinge unatrag; kralježnica neutralna.",
      "Spuštanje do osjećaja istezanja stražnje lože.",
      "Povratak kontrahirajući glutealnu muskulaturu.",
    ],
    defaultSets: 3,
    defaultReps: "10",
    restSec: 90,
    alternativeId: "deadlift",
  },
  hip_thrust: {
    id: "hip_thrust",
    name: "Glute bridge / hip thrust",
    movementPattern: "hinge",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "abs"],
    equipment: "barbell",
    level: "intermediate",
    motion: "hinge",
    instructions: [
      "Gornji dio leđa na klupi; stopala čvrsto na podu, koljena 90°.",
      "Šipka u kuku (s podlogom radi udobnosti).",
      "Potisak kukova prema gore; završno tijelo ravno od koljena do ramena.",
      "Maksimalna kontrakcija glutealne muskulature na vrhu.",
      "Spuštanje 2 s; bez prebacivanja težine na lumbalni dio.",
    ],
    defaultSets: 3,
    defaultReps: "10",
    restSec: 90,
    alternativeId: "romanian_deadlift_db",
  },
  kb_swing: {
    id: "kb_swing",
    name: "Kettlebell swing (russian)",
    movementPattern: "hinge",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "abs", "lower_back", "shoulders_front"],
    equipment: "kettlebell",
    level: "intermediate",
    motion: "hinge",
    instructions: [
      "Stopala šira od ramena; kettlebell ispred stopala.",
      "Hip hinge; kettlebell se 'baca' između nogu, podlaktice udare u prepone.",
      "Eksplozivna ekstenzija kuka — pokret dolazi iz glutei, ne iz ruku.",
      "Vrh: kettlebell u visini ramena, ruke ravne, glutei stisnuti.",
    ],
    defaultSets: 4,
    defaultReps: "15",
    restSec: 60,
    alternativeId: "romanian_deadlift_db",
  },

  // ─── LUNGE / UNILATERAL ────────────────────────────────────────────────────
  walking_lunge: {
    id: "walking_lunge",
    name: "Hodajući iskorak (walking lunge)",
    movementPattern: "lunge",
    primaryMuscles: ["quads"],
    secondaryMuscles: ["glutes", "hamstrings", "adductors"],
    equipment: "dumbbell",
    level: "beginner",
    motion: "walk",
    instructions: [
      "Bučice uz tijelo; ramena spuštena, lopatice retrahirane.",
      "Iskorak naprijed; spuštanje stražnjeg koljena prema podu.",
      "Prednje koljeno iznad gležnja, ne preko prstiju.",
      "Potisak iz pete prednjeg stopala u sljedeći korak.",
    ],
    defaultSets: 3,
    defaultReps: "10 / nogu",
    restSec: 75,
    alternativeId: "bulgarian_split_squat",
  },

  // ─── CORE ──────────────────────────────────────────────────────────────────
  plank: {
    id: "plank",
    name: "Daska (plank)",
    movementPattern: "core",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["obliques", "shoulders_front", "glutes"],
    equipment: "mat",
    level: "beginner",
    motion: "hold",
    instructions: [
      "Podlaktice na podu; lakti ispod ramena.",
      "Tijelo u ravnoj liniji od glave do peta.",
      "Glutealna i trbušna muskulatura aktivirane; rebra prema kukovima.",
      "Vrat neutralan; disanje normalno.",
    ],
    defaultSets: 3,
    defaultReps: "30–60 s",
    restSec: 60,
    alternativeId: "dead_bug",
  },
  side_plank: {
    id: "side_plank",
    name: "Bočna daska (side plank)",
    movementPattern: "core",
    primaryMuscles: ["obliques"],
    secondaryMuscles: ["abs", "shoulders_side", "glutes"],
    equipment: "mat",
    level: "beginner",
    motion: "hold",
    instructions: [
      "Lakat ispod ramena; noge ispružene, gornja iznad donje.",
      "Kuk podignut tako da tijelo formira pravac glava–stopala.",
      "Slobodna ruka uz tijelo ili u zrak.",
      "Rebra prema kukovima; vrat neutralan.",
    ],
    defaultSets: 3,
    defaultReps: "30 s / strana",
    restSec: 45,
    alternativeId: "plank",
  },
  dead_bug: {
    id: "dead_bug",
    name: "Dead bug",
    movementPattern: "core",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["obliques"],
    equipment: "mat",
    level: "beginner",
    motion: "flexion",
    instructions: [
      "Leđa na podu; križni dio u kontaktu s podlogom kroz cijelo izvođenje.",
      "Kukovi i koljena pod 90°; ruke ispružene prema stropu.",
      "Suprotna ruka i noga ekstendiraju se istovremeno do 5 cm iznad poda.",
      "Križni dio NE smije se odizati; ako se odiže, smanji raspon.",
    ],
    defaultSets: 3,
    defaultReps: "8 / strana",
    restSec: 45,
    alternativeId: "plank",
  },
  pallof_press: {
    id: "pallof_press",
    name: "Pallof press (anti-rotacija)",
    movementPattern: "core",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["obliques", "shoulders_front"],
    equipment: "machine",
    level: "beginner",
    motion: "still",
    instructions: [
      "Stoj bočno u odnosu na koloturu; ručka u sredini prsa.",
      "Stopala u širini kukova; trbušna i glutealna napeta.",
      "Potisak ručke ravno naprijed; trup NE smije rotirati prema koloturi.",
      "Zadrži 2 s u ekstenziji, vrati u prsa.",
    ],
    defaultSets: 3,
    defaultReps: "10 / strana",
    restSec: 60,
    alternativeId: "dead_bug",
  },

  // ─── CARRY / CONDITIONING ──────────────────────────────────────────────────
  farmers_carry: {
    id: "farmers_carry",
    name: "Farmer's carry",
    movementPattern: "carry",
    primaryMuscles: ["forearms"],
    secondaryMuscles: ["traps", "abs", "obliques", "glutes"],
    equipment: "dumbbell",
    level: "beginner",
    motion: "walk",
    instructions: [
      "Bučice uz tijelo; ramena spuštena i unatrag.",
      "Trbušna napeta; držanje uspravno.",
      "Hod normalnom dužinom koraka, peta–prst.",
      "Disanje ritmično; bez pomicanja kukova.",
    ],
    defaultSets: 3,
    defaultReps: "30 m",
    restSec: 60,
    alternativeId: "plank",
  },
  jump_rope: {
    id: "jump_rope",
    name: "Preskakanje vijače",
    movementPattern: "conditioning",
    primaryMuscles: ["calves"],
    secondaryMuscles: ["shoulders_front", "abs", "forearms"],
    equipment: "bodyweight",
    level: "beginner",
    motion: "walk",
    instructions: [
      "Lakti uz tijelo; pokret iz zapešća, ne ramena.",
      "Skok 2–3 cm s prednjeg dijela stopala.",
      "Koljena lagano savijena, opružena kičma.",
      "Pogled naprijed, ne prema podu.",
    ],
    defaultSets: 4,
    defaultReps: "60 s",
    restSec: 45,
    alternativeId: "brisk_walk",
  },
  brisk_walk: {
    id: "brisk_walk",
    name: "Brzo hodanje (Zone 2)",
    movementPattern: "conditioning",
    primaryMuscles: ["full_body"],
    secondaryMuscles: ["calves", "quads", "glutes"],
    equipment: "bodyweight",
    level: "beginner",
    motion: "walk",
    instructions: [
      "Tempo: razgovor moguć, pjevanje nije (RPE 4–5 / 10).",
      "Držanje uspravno, ramena spuštena, pogled 5–10 m ispred.",
      "Lakti pod ~90°; ruke prirodno klate.",
      "Disanje nosom kad god je moguće.",
    ],
    defaultSets: 1,
    defaultReps: "20–30 min",
    restSec: 0,
    alternativeId: "jump_rope",
  },

  // ─── MOBILITY ──────────────────────────────────────────────────────────────
  cat_cow: {
    id: "cat_cow",
    name: "Mačka–krava (mobilnost kralježnice)",
    movementPattern: "mobility",
    primaryMuscles: ["lower_back"],
    secondaryMuscles: ["abs", "traps"],
    equipment: "mat",
    level: "beginner",
    motion: "flexion",
    instructions: [
      "Pozicija na sve četiri; šake ispod ramena, koljena ispod kukova.",
      "Udah: ekstenzija — trbuh prema podu, prsa naprijed.",
      "Izdah: fleksija — leđa zaokružena, brada prema prsima.",
      "Pokret zaustaviti u rasponu bez boli.",
    ],
    defaultSets: 2,
    defaultReps: "10",
    restSec: 30,
    alternativeId: "world_greatest_stretch",
  },
  world_greatest_stretch: {
    id: "world_greatest_stretch",
    name: "World's Greatest Stretch",
    movementPattern: "mobility",
    primaryMuscles: ["full_body"],
    secondaryMuscles: ["adductors", "shoulders_front", "lower_back"],
    equipment: "mat",
    level: "beginner",
    motion: "hold",
    instructions: [
      "Iz uspravnog stava, zakorak u duboki low-lunge.",
      "Istostrana šaka uz unutarnju stranu prednjeg stopala.",
      "Suprotnom rukom rotacija trupa, otvaranje prsa prema gore.",
      "Pogled prati ruku; vrat u liniji s kralježnicom; izmjena strane.",
    ],
    defaultSets: 2,
    defaultReps: "6 / strana",
    restSec: 30,
    alternativeId: "cat_cow",
  },
  thoracic_opener: {
    id: "thoracic_opener",
    name: "Torakalna rotacija (quadruped)",
    movementPattern: "mobility",
    primaryMuscles: ["traps"],
    secondaryMuscles: ["lats", "shoulders_rear"],
    equipment: "mat",
    level: "beginner",
    motion: "hold",
    instructions: [
      "Pozicija na sve četiri; jedna šaka iza vrata.",
      "Rotacija lakta prema gore; pogled prati lakat.",
      "Zadrži vrh 1 s, vrati u start (lakat prema suprotnoj nadlanici).",
      "Trbušna napeta; donji dio leđa stabilan.",
    ],
    defaultSets: 2,
    defaultReps: "10 / strana",
    restSec: 30,
    alternativeId: "cat_cow",
  },
};

export const ALL_EXERCISES: Exercise[] = Object.values(EXERCISES);

export function getExercise(id: string): Exercise {
  const ex = EXERCISES[id];
  if (!ex) throw new Error(`Unknown exercise: ${id}`);
  return ex;
}

// ─── Workout tracks (legacy — used by /check-in → /training?mode=...) ────────
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

export function getTrack(mode: WorkoutMode): Exercise[] {
  return WORKOUT_TRACKS[mode].map(getExercise);
}

export const MUSCLE_LABEL: Record<MuscleGroup, string> = {
  chest: "Prsa",
  shoulders_front: "Prednji deltoid",
  shoulders_side: "Bočni deltoid",
  shoulders_rear: "Stražnji deltoid",
  biceps: "Biceps",
  triceps: "Triceps",
  forearms: "Podlaktice",
  abs: "Trbuh",
  obliques: "Kosi trbušnjaci",
  lats: "Najširi mišić leđa",
  traps: "Trapezius",
  lower_back: "Lumbalni dio",
  glutes: "Glutei",
  quads: "Kvadricepsi",
  hamstrings: "Stražnja loža",
  adductors: "Aduktori",
  calves: "Listovi",
  full_body: "Cijelo tijelo",
};

export const EQUIPMENT_LABEL: Record<Equipment, string> = {
  bodyweight: "Bez opreme",
  barbell: "Šipka",
  dumbbell: "Bučice",
  kettlebell: "Kettlebell",
  machine: "Sprava",
  bench: "Klupa",
  mat: "Strunjača",
};

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: "Početnik",
  intermediate: "Srednji",
  advanced: "Napredni",
};
