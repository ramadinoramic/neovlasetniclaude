import Link from "next/link";
import { notFound } from "next/navigation";
import { PROGRAMS } from "@/data/programs";

interface PageProps {
  params: { programId: string };
}

export default function ProgramDayPickerPage({ params }: PageProps) {
  const program = PROGRAMS[params.programId];
  if (!program) notFound();

  return (
    <section className="flex flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <Link
          href="/pro"
          className="text-[10px] uppercase tracking-widest text-ash-400 hover:text-ash-200"
        >
          ← Programi
        </Link>
        <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
          {program.name}
        </span>
        <h1 className="text-2xl font-semibold leading-tight text-ash-50">
          Koji dan ti je danas?
        </h1>
        <p className="text-sm text-ash-200">{program.description}</p>
      </header>

      <div className="flex flex-col gap-3">
        {program.days.map((d) => (
          <Link
            key={d.id}
            href={`/training?source=program&programId=${program.id}&dayId=${d.id}`}
            className="flex flex-col gap-1 rounded-2xl border border-charcoal-line bg-charcoal-soft p-5 transition hover:border-mint hover:shadow-glow-mint"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-mint">
                {d.id.toUpperCase()}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-ash-600">
                {d.exerciseIds.length} vježbi
              </span>
            </div>
            <h2 className="text-base font-semibold text-ash-50">{d.name}</h2>
            <p className="text-xs text-ash-400">{d.tagline}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
