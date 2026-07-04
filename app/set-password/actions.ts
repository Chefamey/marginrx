"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";

function redirectWithError(message: string): never {
  redirect(`/set-password?error=${encodeURIComponent(message)}`);
}

export async function setPasswordAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/login?error=config");
  }

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 12) {
    redirectWithError("Use at least 12 characters for the private password.");
  }

  if (password !== confirmPassword) {
    redirectWithError("The passwords do not match.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?error=Private access link expired. Request a fresh invite.");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirectWithError(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
