import Link from "next/link";
import { EntryCard } from "@/components/EntryCard";
import { getEntries } from "@/lib/entries";
import { houseModules } from "@/lib/modules";

const moduleAccents = [
  "from-jade/20 to-jade/5 text-jade",
  "from-cobalt/20 to-cobalt/5 text-cobalt",
  "from-ruby/20 to-ruby/5 text-ruby",
  "from-signal/20 to-signal/5 text-signal",
  "from-ink/10 to-ink/5 text-ink",
  "from-brass/25 to-brass/5 text-brass",
  "from-jade/20 via-cobalt/10 to-ruby/5 text-ink"
];

export default async function DashboardPage() {
  const entries = await getEntries({ limit: 500 });
  const recentEntries = entries.slice(0, 4);
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const moduleCounts = houseModules.map((module, index) => ({
    ...module,
    accent: moduleAccents[index % moduleAccents.length],
    count: entries.filter((entry) => entry.module === module.key).length
  }));

  const maxModuleCount = Math.max(...moduleCounts.map((module) => module.count), 1);
  const recordsThisMonth = entries.filter((entry) => new Date(entry.created_at) >= last30Days).length;
  const latestEntryDate = recentEntries[0]?.entry_date ?? "Awaiting first record";

  const categoryCounts = Object.entries(
    entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxCategoryCount = Math.max(...categoryCounts.map(([, count]) => count), 1);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-command">
        <div className="command-surface px-6 py-7 text-paper md:px-8 md:py-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-paper/[0.55]">Private Founder Operating System</p>
            <span className="rounded-full border border-jade/30 bg-jade/[0.15] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-jade">
              Live Memory Kernel
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_17rem] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                Institutional memory with sharper signal.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-paper/70">
                House OS preserves doctrine, decisions, projects, relationships, wealth logic, and prophetic record as a living founder command system.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/50">Next Action</p>
              <p className="mt-3 text-2xl font-semibold">Capture the signal before it decays.</p>
              <Link href="/entries/new" className="button-primary mt-5 w-full bg-paper text-ink hover:bg-white">
                New Record
              </Link>
            </div>
          </div>
        </div>
        <div className="h-1 signal-rail" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="metric-card">
          <p className="label">Total Records</p>
          <p className="mt-3 text-4xl font-semibold">{entries.length}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-jade">Institutional memory base</p>
        </div>
        <div className="metric-card">
          <p className="label">Active Modules</p>
          <p className="mt-3 text-4xl font-semibold">{moduleCounts.filter((module) => module.count > 0).length}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cobalt">Across seven domains</p>
        </div>
        <div className="metric-card">
          <p className="label">Last 30 Days</p>
          <p className="mt-3 text-4xl font-semibold">{recordsThisMonth}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-ruby">Fresh founder signal</p>
        </div>
        <div className="metric-card">
          <p className="label">Latest Record</p>
          <p className="mt-3 text-2xl font-semibold">{latestEntryDate}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-signal">Chronology intact</p>
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
              <div className="rounded-lg border border-dashed border-line bg-white/70 p-8">
                <p className="text-sm font-semibold text-ink">The archive is ready.</p>
                <p className="mt-2 text-sm leading-6 text-ink-muted">Create the first record in the Codex, Decisions, Wealth, or any other House module.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel p-5">
            <p className="label">Module Heat</p>
            <div className="mt-4 grid gap-3">
              {moduleCounts.map((module) => (
                <Link key={module.key} href={`/entries?module=${module.key}`} className={`module-card bg-gradient-to-br ${module.accent}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span>
                      <span className="block text-sm font-semibold text-ink">{module.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-ink-muted">{module.description}</span>
                    </span>
                    <span className="text-2xl font-semibold">{module.count}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full rounded-full bg-current" style={{ width: `${Math.max((module.count / maxModuleCount) * 100, module.count ? 12 : 0)}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <p className="label">Strategic Categories</p>
            <div className="mt-4 space-y-3">
              {categoryCounts.length > 0 ? (
                categoryCounts.map(([category, count]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-ink">{category}</span>
                      <span className="text-sm text-ink-muted">{count}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-jade via-cobalt to-ruby" style={{ width: `${Math.max((count / maxCategoryCount) * 100, 8)}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-ink-muted">Categories will appear once entries are created.</p>
              )}
            </div>
          </div>

          <div className="command-surface rounded-lg border border-ink/10 p-5 text-paper shadow-command">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/50">GPT Access Layer</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">Private Action Ready</h3>
            <p className="mt-3 text-sm leading-6 text-paper/70">
              v0.1 now exposes a token-gated read API and OpenAPI schema for your private GPT. It can retrieve records only when the GPT carries the House OS bearer token.
            </p>
            <Link href="/ask" className="mt-5 inline-flex text-sm font-semibold text-jade underline decoration-jade/30 underline-offset-4">
              View GPT setup
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
