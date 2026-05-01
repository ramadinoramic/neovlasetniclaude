import Link from "next/link";
import { PathCard } from "@/components/home/PathCard";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.25em] text-ash-400">
          Neovlašteni
        </span>
        <h1 className="text-3xl font-semibold leading-tight">
          Bez pritiska.
          <br />
          <span className="text-mint">Bez bildanja egoa.</span>
        </h1>
        <p className="text-ash-200">
          Nisam ovlašten da ti budem trener. Ali nećeš ni primijetiti.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-ash-600">
          Tko si danas?
        </span>

        <PathCard
          href="/pro"
          badge="Profesionalno"
          title="Ozbiljni vježbači"
          description="Strukturirani programi sa shemama po cilju. Snaga, hipertrofija, RPE."
          details={[
            "Push / Pull / Legs (3 dana)",
            "Upper / Lower (4 dana)",
            "Per-vježba: setovi × ponavljanja, RPE, pauza",
          ]}
          tone="mint"
        />

        <PathCard
          href="/amater"
          badge="Amaterski"
          title="Amateri"
          description="Balansirani full-body trening, fokus na tehniku, manje volumena."
          details={[
            "2 sesije tjedno (A i B)",
            "Push, pull, čučanj, hinge, core u jednoj sesiji",
            "Dovoljno za napredak, premalo za sagorijevanje",
          ]}
          tone="mint"
        />

        <PathCard
          href="/wizard"
          badge="Vikend"
          title="Vikendaši (neozbiljni)"
          description="4 pitanja → trening za danas. Bez plana, bez programa, bez krivnje."
          details={[
            "Vrijeme: 15 / 30 / 45 min",
            "Lokacija: doma / vani / teretana",
            "Oprema: što stvarno imaš pri ruci",
          ]}
          tone="violet"
        />
      </section>

      <section className="flex flex-col gap-3 border-t border-charcoal-line pt-6">
        <span className="text-[10px] uppercase tracking-[0.25em] text-ash-600">
          Brza pomoć
        </span>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/check-in"
            className="rounded-xl border border-charcoal-line bg-charcoal-soft px-4 py-3 text-sm text-ash-200 transition hover:border-mint hover:text-mint"
          >
            Dnevni Check-in
          </Link>
          <Link
            href="/fridge"
            className="rounded-xl border border-charcoal-line bg-charcoal-soft px-4 py-3 text-sm text-ash-200 transition hover:border-mint hover:text-mint"
          >
            Pametni Hladnjak
          </Link>
        </div>
      </section>
    </div>
  );
}
