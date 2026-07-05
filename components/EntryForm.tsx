import { houseModules, type HouseModule } from "@/lib/modules";
import type { HouseEntry } from "@/lib/types";

type EntryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  entry?: HouseEntry;
  defaultModule?: HouseModule;
  submitLabel: string;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function EntryForm({ action, entry, defaultModule, submitLabel }: EntryFormProps) {
  const selectedModule = entry?.module ?? defaultModule ?? "founders_codex";

  return (
    <form action={action} className="panel overflow-hidden">
      <div className="h-1 signal-rail" />
      <div className="p-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="label">Module</span>
          <select className="field" name="module" defaultValue={selectedModule} required>
            {houseModules.map((module) => (
              <option key={module.key} value={module.key}>
                {module.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="label">Date</span>
          <input className="field" type="date" name="entry_date" defaultValue={entry?.entry_date ?? today()} required />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="label">Title</span>
          <input className="field" name="title" defaultValue={entry?.title} placeholder="What should House OS remember?" required />
        </label>

        <label className="space-y-2">
          <span className="label">Category</span>
          <input className="field" name="category" defaultValue={entry?.category} placeholder="Doctrine, capital, ally, thesis..." required />
        </label>

        <label className="space-y-2">
          <span className="label">Tags</span>
          <input className="field" name="tags" defaultValue={entry?.tags.join(", ")} placeholder="comma, separated, tags" />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="label">Body / Content</span>
          <textarea className="field" name="body" defaultValue={entry?.body} placeholder="Record the thinking, decision, relationship intelligence, or principle." required />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="label">Notes / Context</span>
          <textarea className="field min-h-32" name="context" defaultValue={entry?.context ?? ""} placeholder="Optional context, source, review date, contradiction, risk, or next action." />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="button-primary" type="submit">
          {submitLabel}
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Private institutional record</p>
      </div>
      </div>
    </form>
  );
}
