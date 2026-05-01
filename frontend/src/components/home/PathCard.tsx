import Link from "next/link";
import { cn } from "@/lib/cn";

interface PathCardProps {
  href: string;
  badge: string;
  title: string;
  description: string;
  details: string[];
  tone?: "mint" | "violet";
}

export function PathCard({
  href,
  badge,
  title,
  description,
  details,
  tone = "mint",
}: PathCardProps) {
  const hover =
    tone === "mint"
      ? "hover:border-mint hover:shadow-glow-mint"
      : "hover:border-violet hover:shadow-glow-violet";
  const accent = tone === "mint" ? "text-mint" : "text-violet-glow";
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border border-charcoal-line bg-charcoal-soft p-5 transition",
        hover
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-xs uppercase tracking-[0.25em]", accent)}>
          {badge}
        </span>
        <span className="text-ash-400 transition group-hover:translate-x-0.5">
          →
        </span>
      </div>
      <h2 className="text-xl font-semibold text-ash-50">{title}</h2>
      <p className="text-sm text-ash-200">{description}</p>
      <ul className="mt-1 flex flex-col gap-1 text-xs text-ash-400">
        {details.map((d) => (
          <li key={d} className="flex gap-2">
            <span className={accent}>·</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </Link>
  );
}
