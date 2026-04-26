/**
 * Klinički prikaz uputa.
 *
 * VAŽNO: Ovo je kineziološka zona — bez ironije, bez "Neovlaštenog" tona.
 * Tekst koji se ovdje renderira dolazi iz `exercises.ts` i mora ostati
 * stručan i precizan. UI komponenta ne smije ničim parafrazirati.
 */

interface ExerciseInstructionsProps {
  steps: string[];
}

export function ExerciseInstructions({ steps }: ExerciseInstructionsProps) {
  return (
    <section
      aria-label="Tehnička izvedba — kineziološke upute"
      className="rounded-2xl border border-charcoal-line bg-charcoal-soft p-5"
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.25em] text-ash-400">
          Tehnička izvedba
        </h3>
        <span className="text-[10px] uppercase tracking-widest text-ash-600">
          klinički
        </span>
      </header>

      <ol className="flex flex-col gap-2.5">
        {steps.map((step, idx) => (
          <li key={idx} className="flex gap-3 text-sm leading-relaxed">
            <span
              aria-hidden
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-charcoal-line bg-charcoal-deep text-[10px] font-medium text-mint"
            >
              {idx + 1}
            </span>
            <span className="text-ash-200">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
