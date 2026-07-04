import Link from "next/link";
import { EntryCard } from "@/components/EntryCard";
import { getEntries } from "@/lib/entries";
import { houseModules } from "@/lib/modules";

export default async function DashboardPage() {
  const entries = await getEntries({ limit: 500 });
  const recentEntries = entries.slice(0, 4);
  const moduleCounts = houseModules.map((module) => ({
    ...module,
    count: entries.filter((entry) => entry.module === module.key).length
  }));

  const categoryCounts = Object.entries(
    entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <section className="panel overflow-hidden">
        <div className="border-b border-line bg-ink px-6 py-7 text-paper">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/60">Private Founder Operating System</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">Institutional memory for The House of Amey Marathe.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-paper/70">
                Not a notes app. A private system for founder thinking, decisions, relationships, doctrine, wealth logic, and the record of what was seen before it became obvious.
              </p>
            </div>
            <Link href="/entries/new" className="button-secondary border-paper/20 bg-paper text-ink hover:border-paper">
              New Record
            </Link>
          </div>
        </div>

        <div className="grid gap-px bg-line md:grid-cols-3">
          <div className="bg-white/80 p-6">
            <p className="label">Total Records</p>
            <p className="mt-3 text-4xl font-semibold">{entries.length}</p>
          </div>
          <div className="bg-white/80 p-6">
            <p className="label">Active Modules</p>
            <p className="mt-3 text-4xl font-semibold">{moduleCounts.filter((module) => module.count > 0).length}</p>
          </div>
          <div className="bg-white/80 p-6">
            <p className="label">Largest Category</p>
            <p className="mt-3 text-2xl font-semibold">{categoryCounts[0]?.[0] ?? "Awaiting doctrine"}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label">Recent Memory</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Latest entries</h3>
            </div>
            <Link href="/entries" className="quiet-link">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-4">
            {recentEntries.length > 0 ? (
              recentEntries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-white/60 p-8">
                <p className="text-sm font-semibold text-ink">The archive is ready.</p>
                <p className="mt-2 text-sm leading-6 text-ink-muted">Create the first record in the Codex, Decisions, Wealth, or any other House module.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel p-5">
            <p className="label">Module Counts</p>
            <div className="mt-4 space-y-3">
              {moduleCounts.map((module) => (
                <Link key={module.key} href={`/entries?module=${module.key}`} className="flex items-center justify-between rounded-md border border-line bg-white/70 px-3 py-3 transition hover:border-ink/30">
                  <span>
                    <span className="block text-sm font-semibold text-ink">{module.label}</span>
                    <span className="mt-1 block text-xs text-ink-muted">{module.description}</span>
                  </span>
                  <span className="text-lg font-semibold">{module.count}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <p className="label">Category Counts</p>
            <div className="mt-4 space-y-2">
              {categoryCounts.length > 0 ? (
                categoryCounts.map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between rounded-md bg-white/70 px-3 py-2">
                    <span className="text-sm font-semibold text-ink">{category}</span>
                    <span className="text-sm text-ink-muted">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-ink-muted">Categories will appear once entries are created.</p>
              )}
            </div>
          </div>

          <div className="panel border-ink/20 bg-ink p-5 text-paper">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/50">AI Ask Placeholder</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">Ask House OS</h3>
            <p className="mt-3 text-sm leading-6 text-paper/70">
              v0.1 reserves the surface. Retrieval, citations, and founder-memory intelligence will be added after the core archive is stable.
            </p>
            <Link href="/ask" className="mt-5 inline-flex text-sm font-semibold text-paper underline decoration-paper/30 underline-offset-4">
              Open placeholder
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
