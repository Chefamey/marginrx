import { notFound } from "next/navigation";
import { updateEntryAction } from "@/app/actions";
import { EntryForm } from "@/components/EntryForm";
import { getEntry } from "@/lib/entries";

type EditEntryPageProps = {
  params: {
    id: string;
  };
};

export default async function EditEntryPage({ params }: EditEntryPageProps) {
  const entry = await getEntry(params.id);

  if (!entry) {
    notFound();
  }

  const updateAction = updateEntryAction.bind(null, entry.id);

  return (
    <div className="space-y-6">
      <section>
        <p className="label">Edit Record</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">{entry.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">Refine the archive without losing the strategic intent of the original record.</p>
      </section>
      <EntryForm action={updateAction} entry={entry} submitLabel="Save Changes" />
    </div>
  );
}
