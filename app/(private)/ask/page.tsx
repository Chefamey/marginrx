export default function AskPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-command">
        <div className="command-surface px-6 py-7 text-paper">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/50">GPT Access Layer</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Ask House OS</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-paper/70">
            The in-app AI surface remains a v0.1 placeholder. The GPT integration is now prepared through a private, token-gated Action API for read-only retrieval.
          </p>
        </div>
        <div className="h-1 signal-rail" />
        <div className="grid gap-px bg-line lg:grid-cols-3">
          <div className="bg-white p-5">
            <p className="label">Schema URL</p>
            <code className="mt-3 block rounded-md border border-line bg-paper px-3 py-2 text-xs text-ink">
              https://house-os-nine.vercel.app/api/gpt/openapi.json
            </code>
          </div>
          <div className="bg-white p-5">
            <p className="label">Auth Mode</p>
            <p className="mt-3 text-sm font-semibold text-ink">Bearer token</p>
            <p className="mt-2 text-xs leading-5 text-ink-muted">Use `HOUSE_OS_GPT_TOKEN` as the GPT Action secret.</p>
          </div>
          <div className="bg-white p-5">
            <p className="label">Access Level</p>
            <p className="mt-3 text-sm font-semibold text-ink">Read only</p>
            <p className="mt-2 text-xs leading-5 text-ink-muted">The GPT can search and summarize records, not create or edit them.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <div className="panel p-6">
          <p className="label">Placeholder Console</p>
          <label className="mt-4 block space-y-2">
            <span className="label">Future Question</span>
            <textarea className="field" disabled placeholder="Ask House OS about decisions, relationships, principles, wealth logic, or the Codex." />
          </label>
          <button className="button-secondary mt-4 cursor-not-allowed opacity-60" disabled>
            Coming in v0.2
          </button>
        </div>

        <div className="panel p-6">
          <p className="label">GPT Action Endpoints</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-md border border-line bg-white px-3 py-3">
              <p className="font-semibold text-ink">Summary</p>
              <code className="mt-1 block text-xs text-ink-muted">GET /api/gpt/summary</code>
            </div>
            <div className="rounded-md border border-line bg-white px-3 py-3">
              <p className="font-semibold text-ink">Search records</p>
              <code className="mt-1 block text-xs text-ink-muted">GET /api/gpt/entries?q=&amp;module=&amp;limit=</code>
            </div>
            <p className="text-xs leading-5 text-ink-muted">
              Required Vercel env vars: `HOUSE_OS_GPT_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`, and `HOUSE_OS_OWNER_USER_ID` or `HOUSE_OS_OWNER_EMAIL`.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
