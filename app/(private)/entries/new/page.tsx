import { createEntryAction } from "@/app/actions";
import { EntryForm } from "@/components/EntryForm";
import { parseModuleFromSearch } from "@/lib/entries";

type NewEntryPageProps = {
  searchParams: {
    module?: string;
  };
};

export default function NewEntryPage({ searchParams }: NewEntryPageProps) {
  const defaultModule = parseModuleFromSearch(searchParams.module);

  return (
    <div className="space-y-6">
      <section>
        <p className="label">New Record</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Add to House OS</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
          Every record should be useful to the future founder: clear title, module, category, tags, date, body, and context when the surrounding intelligence matters.
        </p>
      </section>
      <EntryForm action={createEntryAction} defaultModule={defaultModule} submitLabel="Create Record" />
    </div>
  );
}
