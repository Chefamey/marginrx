import { redirect } from "next/navigation";
import { PasswordForm } from "@/app/set-password/password-form";
import { getAuthenticatedUser } from "@/lib/entries";

export const dynamic = "force-dynamic";

type SetPasswordPageProps = {
  searchParams: {
    error?: string;
  };
};

export default async function SetPasswordPage({ searchParams }: SetPasswordPageProps) {
  const { user, configMissing } = await getAuthenticatedUser();

  if (configMissing) {
    redirect("/login?error=config");
  }

  if (!user) {
    redirect("/login?error=Private access link expired. Request a fresh invite.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-line bg-white/80 shadow-executive backdrop-blur lg:grid-cols-[1fr_26rem]">
        <div className="bg-ink p-8 text-paper lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-paper/50">Private Onboarding</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight">Set House OS Password</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-paper/70">
            Establish private credentials for the founder operating system. This session must come from a verified Supabase invite or recovery link.
          </p>
        </div>

        <PasswordForm initialError={searchParams.error} />
      </section>
    </main>
  );
}
