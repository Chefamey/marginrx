import Link from "next/link";
import { ModuleBadge } from "@/components/ModuleBadge";
import type { HouseEntry } from "@/lib/types";

export function EntryCard({ entry }: { entry: HouseEntry }) {
  return (
    <article className="panel p-5 transition hover:-translate-y-0.5 hover:border-ink/30">
      <div className="flex flex-wrap items-center gap-2">
        <ModuleBadge module={entry.module} />
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">{entry.entry_date}</span>
      </div>
      <Link href={`/entries/${entry.id}`} className="mt-4 block text-xl font-semibold tracking-tight text-ink hover:underline">
        {entry.title}
      </Link>
      <p className="mt-2 text-sm font-semibold text-ink-muted">{entry.category}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-muted">{entry.body}</p>
      {entry.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink-muted">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
