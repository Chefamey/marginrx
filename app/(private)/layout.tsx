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
        <aside className="panel h-fit p-5 lg:sticky lg:top-4">
          <Link href="/dashboard" className="block">
            <p className="label">The House of Amey Marathe</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">House OS</h1>
          </Link>

          <nav className="mt-8 space-y-1">
            <Link className="block rounded-md px-3 py-2 text-sm font-semibold text-ink transition hover:bg-ink/[0.05]" href="/dashboard">
              Executive Dashboard
            </Link>
            <Link className="block rounded-md px-3 py-2 text-sm font-semibold text-ink transition hover:bg-ink/[0.05]" href="/entries">
              All Records
            </Link>
            {houseModules.map((module) => (
              <Link
                key={module.key}
                className="block rounded-md px-3 py-2 text-sm font-semibold text-ink-muted transition hover:bg-ink/[0.05] hover:text-ink"
                href={`/entries?module=${module.key}`}
              >
                {module.label}
              </Link>
            ))}
            <Link className="block rounded-md px-3 py-2 text-sm font-semibold text-ink-muted transition hover:bg-ink/[0.05] hover:text-ink" href="/ask">
              AI Ask
            </Link>
          </nav>

          <div className="mt-8 border-t border-line pt-5">
            <p className="text-xs leading-5 text-ink-muted">{user.email}</p>
            <form action={signOutAction} className="mt-3">
              <button className="quiet-link" type="submit">
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
