import Link from "next/link";
import { PROGRAMS_BY_LEVEL } from "@/data/programs";

export default function ProIndexPage() {
  const programs = PROGRAMS_BY_LEVEL.pro;
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
          Profesionalno
        </span>
        <h1 className="text-2xl font-semibold leading-tight">
          Programi.{" "}
          <span className="text-ash-400 text-base font-normal">
            Snaga, hipertrofija. Sa shemama, ne nasumice.
          </span>
        </h1>
      </header>

      <div className="flex flex-col gap-3">
        {programs.map((p) => (
          <Link
            key={p.id}
            href={`/pro/${p.id}`}
            className="flex flex-col gap-2 rounded-2xl border border-charcoal-line bg-charcoal-soft p-5 transition hover:border-mint hover:shadow-glow-mint"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-mint">
                {p.goal === "strength"
                  ? "Snaga"
                  : p.goal === "hypertrophy"
                  ? "Hipertrofija"
                  : "Balansirano"}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-ash-600">
                {p.daysPerWeek}× tjedno
              </span>
            </div>
            <h2 className="text-lg font-semibold text-ash-50">{p.name}</h2>
            <p className="text-sm text-ash-200">{p.description}</p>
            <ul className="mt-1 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-widest text-ash-400">
              {p.days.map((d) => (
                <li
                  key={d.id}
                  className="rounded-full border border-charcoal-line bg-charcoal-deep/60 px-2 py-0.5"
                >
                  {d.name.split(" ")[0]}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </section>
  );
}
