"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ENERGY_LABEL,
  EQUIPMENT_TIER_LABEL,
  LOCATION_LABEL,
  TIME_LABEL,
  generateSession,
  type EnergyBucket,
  type EquipmentTier,
  type Location,
  type Time,
  type WizardInput,
} from "@/lib/wizard";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "nf:wizard:session";

const TIME_OPTIONS: Time[] = ["15min", "30min", "45min"];
const LOCATION_OPTIONS: Location[] = ["home", "outdoor", "gym"];
const EQUIPMENT_OPTIONS: EquipmentTier[] = [
  "none",
  "mat",
  "dumbbell",
  "full_gym",
];
const ENERGY_OPTIONS: EnergyBucket[] = ["low", "mid", "high"];

const QUESTIONS = [
  {
    key: "time" as const,
    title: "Koliko ti vremena netko nije ukrao?",
    subtitle: "Realno. Ne idealno.",
  },
  {
    key: "location" as const,
    title: "Gdje si?",
    subtitle: "Različite lokacije, različita pravila.",
  },
  {
    key: "equipment" as const,
    title: "Što imaš pri ruci?",
    subtitle: "Bez šipke nije sramota — radi se s onim što ima.",
  },
  {
    key: "energy" as const,
    title: "Iskreno — kako si?",
    subtitle: "Bez heroja. Bez izgovora.",
  },
];

type Answers = Partial<WizardInput>;

export function WeekendWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const canProceed = useMemo(() => {
    return Boolean(answers[q.key]);
  }, [answers, q.key]);

  const handlePick = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.key]: value as never }));
  };

  const handleNext = () => {
    if (!canProceed) return;
    if (isLast) {
      const input = answers as WizardInput;
      const session = generateSession(input);
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...session, input, ts: Date.now() })
      );
      router.push("/training?source=wizard");
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <section className="flex flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
            Vikendaš · {step + 1} / {QUESTIONS.length}
          </span>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="text-[10px] uppercase tracking-widest text-ash-400 hover:text-ash-200"
            >
              ← natrag
            </button>
          )}
        </div>
        <h1 className="text-2xl font-semibold leading-tight text-ash-50">
          {q.title}
        </h1>
        <p className="text-sm text-ash-200">{q.subtitle}</p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-charcoal-soft">
          <div
            className="h-full bg-mint transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {q.key === "time" &&
          TIME_OPTIONS.map((t) => (
            <Choice
              key={t}
              label={TIME_LABEL[t]}
              hint={
                t === "15min"
                  ? "Brzi reset — mobilnost + minimum."
                  : t === "30min"
                  ? "Standardna sesija."
                  : "Cijeli plan."
              }
              selected={answers.time === t}
              onClick={() => handlePick(t)}
            />
          ))}
        {q.key === "location" &&
          LOCATION_OPTIONS.map((l) => (
            <Choice
              key={l}
              label={LOCATION_LABEL[l]}
              hint={
                l === "home"
                  ? "Bez galerije promatrača."
                  : l === "outdoor"
                  ? "Park, zrak, pomalo."
                  : "Cijeli arsenal."
              }
              selected={answers.location === l}
              onClick={() => handlePick(l)}
            />
          ))}
        {q.key === "equipment" &&
          EQUIPMENT_OPTIONS.map((e) => (
            <Choice
              key={e}
              label={EQUIPMENT_TIER_LABEL[e]}
              hint={
                e === "none"
                  ? "Bodyweight. Dovoljno."
                  : e === "mat"
                  ? "Strunjača i tvoje tijelo."
                  : e === "dumbbell"
                  ? "Bučice / kettlebell — dovoljno za 90% stvari."
                  : "Šipka, sprave, sve."
              }
              selected={answers.equipment === e}
              onClick={() => handlePick(e)}
            />
          ))}
        {q.key === "energy" &&
          ENERGY_OPTIONS.map((en) => (
            <Choice
              key={en}
              label={ENERGY_LABEL[en]}
              hint={
                en === "low"
                  ? "Mobilnost, lagani cardio."
                  : en === "mid"
                  ? "Balansiran trening."
                  : "Punih 100% — idemo težak rad."
              }
              selected={answers.energy === en}
              onClick={() => handlePick(en)}
              tone={en === "low" ? "violet" : "mint"}
            />
          ))}
      </div>

      <button
        type="button"
        disabled={!canProceed}
        onClick={handleNext}
        className={cn(
          "rounded-xl px-4 py-3 text-sm font-medium transition",
          canProceed
            ? "bg-mint text-charcoal-deep hover:bg-mint-glow"
            : "border border-charcoal-line text-ash-600"
        )}
      >
        {isLast ? "Slazi mi trening →" : "Dalje →"}
      </button>

      <p className="text-center text-xs text-ash-400">
        Bez prijave. Bez naplate. Bez prosuđivanja.
      </p>
    </section>
  );
}

interface ChoiceProps {
  label: string;
  hint: string;
  selected: boolean;
  onClick: () => void;
  tone?: "mint" | "violet";
}

function Choice({
  label,
  hint,
  selected,
  onClick,
  tone = "mint",
}: ChoiceProps) {
  const activeBorder =
    tone === "mint" ? "border-mint shadow-glow-mint" : "border-violet shadow-glow-violet";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-1 rounded-2xl border bg-charcoal-soft p-4 text-left transition",
        selected
          ? activeBorder
          : "border-charcoal-line hover:border-ash-400"
      )}
    >
      <span className="text-base font-medium text-ash-50">{label}</span>
      <span className="text-xs text-ash-400">{hint}</span>
    </button>
  );
}

export const WIZARD_STORAGE_KEY = STORAGE_KEY;
