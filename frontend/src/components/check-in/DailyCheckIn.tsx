"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EnergySlider } from "./EnergySlider";
import { MoodCard } from "./MoodCard";
import { getMoodResponse } from "@/data/moodCopy";

const STORAGE_KEY = "nf:lastCheckIn";

export function DailyCheckIn() {
  const router = useRouter();
  const [energy, setEnergy] = useState<number>(3);

  const mood = useMemo(() => getMoodResponse(energy), [energy]);

  const handleConfirm = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          energy,
          recommendation: mood.recommendation,
          ts: Date.now(),
        })
      );
    }
    router.push(`/training?mode=${mood.recommendation}`);
  };

  return (
    <section className="flex flex-col gap-8 animate-fade-in">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
          Dnevni Check-in
        </span>
        <h1 className="text-2xl font-semibold leading-tight">
          Kako si <span className="text-mint">stvarno</span>?
        </h1>
        <p className="text-sm text-ash-200">
          Bez glume. Reci mi razinu energije — pa ćemo dogovoriti realan plan.
        </p>
      </header>

      <div className="rounded-2xl border border-charcoal-line bg-charcoal-soft p-5">
        <EnergySlider value={energy} onChange={setEnergy} />
      </div>

      <MoodCard mood={mood} onConfirm={handleConfirm} />

      <p className="text-center text-xs text-ash-400">
        Možeš preskočiti. Nitko te ne nadgleda.
      </p>
    </section>
  );
}
