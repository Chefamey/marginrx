"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";

function safeRedirect(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/")) {
    return "/dashboard";
  }
  return value;
}

export async function signInAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/login?error=config");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirect(formData.get("redirectTo"));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent("Invalid private credentials.")}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
