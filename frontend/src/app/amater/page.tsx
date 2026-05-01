import Link from "next/link";
import { PROGRAMS_BY_LEVEL } from "@/data/programs";

export default function AmaterIndexPage() {
  const programs = PROGRAMS_BY_LEVEL.amater;

  return (
    <section className="flex flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-widest text-ash-400 hover:text-ash-200"
        >
          ← Nazad
        </Link>
        <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
          Amaterski
        </span>
        <h1 className="text-2xl font-semibold leading-tight">
          Full body.{" "}
          <span className="text-ash-400 text-base font-normal">
            Dvije sesije pokrivaju sve. Ne treba više.
          </span>
        </h1>
      </header>

      {programs.map((p) => (
        <div key={p.id} className="flex flex-col gap-3">
          <p className="text-sm text-ash-200">{p.description}</p>
          <div className="flex flex-col gap-3">
            {p.days.map((d) => (
              <Link
                key={d.id}
                href={`/training?source=program&programId=${p.id}&dayId=${d.id}`}
                className="flex flex-col gap-1 rounded-2xl border border-charcoal-line bg-charcoal-soft p-5 transition hover:border-mint hover:shadow-glow-mint"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-mint">
                    {d.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-ash-600">
                    {d.exerciseIds.length} vježbi
                  </span>
                </div>
                <p className="text-sm text-ash-200">{d.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
