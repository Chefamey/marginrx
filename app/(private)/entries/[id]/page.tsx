import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteEntryAction } from "@/app/actions";
import { ModuleBadge } from "@/components/ModuleBadge";
import { getEntry } from "@/lib/entries";

type EntryPageProps = {
  params: {
    id: string;
  };
};

export default async function EntryPage({ params }: EntryPageProps) {
  const entry = await getEntry(params.id);

  if (!entry) {
    notFound();
  }

  const deleteAction = deleteEntryAction.bind(null, entry.id);

  return (
    <article className="space-y-6">
      <section className="panel p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <ModuleBadge module={entry.module} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{entry.entry_date}</span>
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight">{entry.title}</h2>
            <p className="mt-3 text-sm font-semibold text-ink-muted">{entry.category}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/entries/${entry.id}/edit`} className="button-secondary">
              Edit
            </Link>
            <form action={deleteAction}>
              <button className="button-secondary border-red-200 text-red-700 hover:border-red-500" type="submit">
                Delete
              </button>
            </form>
          </div>
        </div>

        {entry.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-semibold text-ink-muted">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="panel p-6">
          <p className="label">Content</p>
          <div className="mt-4 max-w-none whitespace-pre-wrap text-sm leading-7 text-ink">{entry.body}</div>
        </div>

        <aside className="panel p-6">
          <p className="label">Notes / Context</p>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-ink-muted">{entry.context || "No additional context recorded."}</div>
          <dl className="mt-8 space-y-3 border-t border-line pt-5 text-sm">
            <div>
              <dt className="font-semibold text-ink">Created</dt>
              <dd className="text-ink-muted">{new Date(entry.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Updated</dt>
              <dd className="text-ink-muted">{new Date(entry.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </article>
  );
}
