import Link from "next/link";
import { EntryCard } from "@/components/EntryCard";
import { getEntries } from "@/lib/entries";
import { houseModules, normalizeModule } from "@/lib/modules";

type EntriesPageProps = {
  searchParams: {
    q?: string;
    module?: string;
  };
};

export default async function EntriesPage({ searchParams }: EntriesPageProps) {
  const selectedModule = searchParams.module ? normalizeModule(searchParams.module) : "";
  const entries = await getEntries({
    module: selectedModule || null,
    query: searchParams.q ?? null,
    limit: 500
  });

  return (
    <div className="space-y-6">
      <section className="panel overflow-hidden">
        <div className="h-1 signal-rail" />
        <div className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label">Archive</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">House Records</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
              Search founder memory across doctrine, projects, relationships, decisions, principles, wealth, and prophetic record.
            </p>
          </div>
          <Link href={`/entries/new${selectedModule ? `?module=${selectedModule}` : ""}`} className="button-primary">
            New Record
          </Link>
        </div>

        <form className="mt-6 grid gap-3 lg:grid-cols-[1fr_16rem_auto]" action="/entries">
          <input className="field" name="q" placeholder="Search title, tags, body, category..." defaultValue={searchParams.q ?? ""} />
          <select className="field" name="module" defaultValue={selectedModule}>
            <option value="">All modules</option>
            {houseModules.map((module) => (
              <option key={module.key} value={module.key}>
                {module.label}
              </option>
            ))}
          </select>
          <button className="button-secondary" type="submit">
            Search
          </button>
        </form>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {entries.length > 0 ? (
          entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
        ) : (
          <div className="panel p-8 xl:col-span-2">
            <p className="text-lg font-semibold">No records found.</p>
            <p className="mt-2 text-sm leading-6 text-ink-muted">Adjust the search, remove the module filter, or create a new record for this domain.</p>
          </div>
        )}
      </section>
    </div>
  );
}
