export default function AskPage() {
  return (
    <div className="space-y-6">
      <section className="panel overflow-hidden">
        <div className="border-b border-line bg-ink px-6 py-7 text-paper">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-paper/60">Placeholder Only</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">AI Ask for House OS</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-paper/70">
            v0.1 does not send founder memory to an AI provider. This surface reserves the future experience: authenticated retrieval, cited answers, and strict control over private context.
          </p>
        </div>
        <div className="p-6">
          <label className="space-y-2">
            <span className="label">Future Question</span>
            <textarea className="field" disabled placeholder="Ask House OS about decisions, relationships, principles, wealth logic, or the Codex." />
          </label>
          <button className="button-secondary mt-4 cursor-not-allowed opacity-60" disabled>
            Coming in v0.2
          </button>
        </div>
      </section>
    </div>
  );
}
