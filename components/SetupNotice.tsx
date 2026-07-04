export function SetupNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="panel max-w-2xl p-8">
        <p className="label">Configuration Required</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Connect Supabase to activate House OS.</h1>
        <p className="mt-4 text-sm leading-6 text-ink-muted">
          Add <code className="font-semibold text-ink">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-semibold text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your local environment and Vercel project, then run the schema in{" "}
          <code className="font-semibold text-ink">supabase/schema.sql</code>.
        </p>
      </section>
    </main>
  );
}
