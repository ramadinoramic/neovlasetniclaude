import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
          Neovlašteni
        </span>
        <h1 className="text-3xl font-semibold leading-tight">
          Bez pritiska. <br />
          <span className="text-mint">Bez bildanja egoa.</span>
        </h1>
        <p className="text-ash-200">
          Nisam ovlašten da ti budem trener. Ali nećeš ni primijetiti.
        </p>
      </header>

      <nav className="grid grid-cols-1 gap-3">
        <Link
          href="/check-in"
          className="rounded-2xl border border-charcoal-line bg-charcoal-soft p-5 transition hover:border-mint hover:shadow-glow-mint"
        >
          <div className="text-xs uppercase tracking-widest text-ash-400">
            Korak 1
          </div>
          <div className="mt-1 text-lg font-medium">Dnevni Check-in</div>
          <div className="mt-1 text-sm text-ash-200">
            Reci mi kako si. Bez prosuđivanja.
          </div>
        </Link>

        <Link
          href="/training"
          className="rounded-2xl border border-charcoal-line bg-charcoal-soft p-5 transition hover:border-violet hover:shadow-glow-violet"
        >
          <div className="text-xs uppercase tracking-widest text-ash-400">
            Korak 2
          </div>
          <div className="mt-1 text-lg font-medium">SafeSpace Trening</div>
          <div className="mt-1 text-sm text-ash-200">
            Ako je gužva — imamo plan B.
          </div>
        </Link>

        <Link
          href="/fridge"
          className="rounded-2xl border border-charcoal-line bg-charcoal-soft p-5 transition hover:border-mint hover:shadow-glow-mint"
        >
          <div className="text-xs uppercase tracking-widest text-ash-400">
            Korak 3
          </div>
          <div className="mt-1 text-lg font-medium">Pametni Hladnjak</div>
          <div className="mt-1 text-sm text-ash-200">
            Što imaš? Napravimo nešto jestivo.
          </div>
        </Link>
      </nav>
    </div>
  );
}
