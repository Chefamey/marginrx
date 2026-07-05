import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { SetupNotice } from "@/components/SetupNotice";
import { getAuthenticatedUser } from "@/lib/entries";
import { houseModules } from "@/lib/modules";

export const dynamic = "force-dynamic";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { user, configMissing } = await getAuthenticatedUser();

  if (configMissing) {
    return <SetupNotice />;
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen px-4 py-4 text-ink md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[18rem_1fr]">
        <aside className="command-surface h-fit overflow-hidden rounded-lg border border-ink/10 p-5 text-paper shadow-command lg:sticky lg:top-4">
          <Link href="/dashboard" className="block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/50">The House of Amey Marathe</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">House OS</h1>
            <div className="mt-4 h-1 rounded-full signal-rail" />
          </Link>

          <nav className="mt-8 space-y-1">
            <Link className="block rounded-md px-3 py-2 text-sm font-semibold text-paper transition hover:bg-white/10" href="/dashboard">
              Executive Dashboard
            </Link>
            <Link className="block rounded-md px-3 py-2 text-sm font-semibold text-paper transition hover:bg-white/10" href="/entries">
              All Records
            </Link>
            {houseModules.map((module) => (
              <Link
                key={module.key}
                className="block rounded-md px-3 py-2 text-sm font-semibold text-paper/[0.62] transition hover:bg-white/10 hover:text-paper"
                href={`/entries?module=${module.key}`}
              >
                {module.label}
              </Link>
            ))}
            <Link className="block rounded-md px-3 py-2 text-sm font-semibold text-paper/[0.62] transition hover:bg-white/10 hover:text-paper" href="/ask">
              AI Ask
            </Link>
          </nav>

          <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.08] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-jade">Private Kernel Online</p>
            <p className="mt-2 break-words text-xs leading-5 text-paper/[0.62]">{user.email}</p>
            <form action={signOutAction} className="mt-3">
              <button className="text-sm font-semibold text-paper/70 transition hover:text-paper" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 pb-12">{children}</main>
      </div>
    </div>
  );
}
