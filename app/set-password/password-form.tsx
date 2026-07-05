"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient, hasSupabaseBrowserConfig } from "@/lib/supabase/browser";

type PasswordFormProps = {
  initialError?: string;
};

export function PasswordForm({ initialError }: PasswordFormProps) {
  const router = useRouter();
  const [error, setError] = useState(initialError ?? "");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 12) {
      setError("Use at least 12 characters for the private password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    if (!hasSupabaseBrowserConfig()) {
      setError("Supabase is not configured for this deployment.");
      return;
    }

    setPending(true);

    const supabase = createSupabaseBrowserClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
      setPending(false);
      setError("This private access session expired. Open the latest recovery email and try again.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setPending(false);
      setError(updateError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 lg:p-10">
      <p className="label">Secure Credential</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Create your private password.</h2>

      {error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}

      <div className="mt-6 space-y-4">
        <label className="space-y-2">
          <span className="label">New Password</span>
          <input className="field" type="password" name="password" autoComplete="new-password" required minLength={12} />
        </label>
        <label className="space-y-2">
          <span className="label">Confirm Password</span>
          <input className="field" type="password" name="confirmPassword" autoComplete="new-password" required minLength={12} />
        </label>
      </div>

      <button className="button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Password"}
      </button>
    </form>
  );
}
