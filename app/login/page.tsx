import { redirect } from "next/navigation";
import { signInAction } from "@/app/login/actions";
import { getAuthenticatedUser } from "@/lib/entries";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: {
    error?: string;
    redirectTo?: string;
  };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { user, configMissing } = await getAuthenticatedUser();

  if (user) {
    redirect("/dashboard");
  }

  const error =
    searchParams.error === "config"
      ? "Supabase is not configured yet."
      : searchParams.error
        ? searchParams.error
        : "";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-line bg-white/80 shadow-executive backdrop-blur lg:grid-cols-[1fr_26rem]">
        <div className="bg-ink p-8 text-paper lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-paper/50">Private Access</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">House OS</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-paper/70">
            A private founder operating system for The House of Amey Marathe: Codex, projects, relationships, decisions, principles, wealth, and prophetic record.
          </p>
        </div>

        <form action={signInAction} className="p-8 lg:p-10">
          <input type="hidden" name="redirectTo" value={searchParams.redirectTo ?? "/dashboard"} />
          <p className="label">Secure Login</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Enter the private system.</h2>

          {configMissing ? (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Add Supabase environment variables before login can work.
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
          ) : null}

          <div className="mt-6 space-y-4">
            <label className="space-y-2">
              <span className="label">Email</span>
              <input className="field" type="email" name="email" autoComplete="email" required />
            </label>
            <label className="space-y-2">
              <span className="label">Password</span>
              <input className="field" type="password" name="password" autoComplete="current-password" required />
            </label>
          </div>

          <button className="button-primary mt-6 w-full" type="submit" disabled={configMissing}>
            Sign In
          </button>
        </form>
      </section>
    </main>
  );
}
