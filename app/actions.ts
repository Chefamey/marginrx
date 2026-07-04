"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizeModule } from "@/lib/modules";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";
import type { HouseEntryPayload } from "@/lib/types";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 24);
}

function parsePayload(formData: FormData): HouseEntryPayload {
  const entryModule = normalizeModule(formValue(formData, "module"));
  const title = formValue(formData, "title");
  const category = formValue(formData, "category");
  const body = formValue(formData, "body");
  const entryDate = formValue(formData, "entry_date");
  const context = formValue(formData, "context");

  if (!title || !category || !body || !entryDate) {
    throw new Error("Title, category, date, and body are required.");
  }

  return {
    module: entryModule,
    title,
    category,
    body,
    tags: parseTags(formValue(formData, "tags")),
    entry_date: entryDate,
    context: context || null
  };
}

async function requireSupabaseWithUser() {
  if (!hasSupabaseConfig()) {
    throw new Error("Missing Supabase environment variables.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function createEntryAction(formData: FormData) {
  const { supabase, user } = await requireSupabaseWithUser();
  const payload = parsePayload(formData);

  const { data, error } = await supabase
    .from("house_entries")
    .insert({ ...payload, user_id: user.id })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/entries");
  redirect(`/entries/${data.id}`);
}

export async function updateEntryAction(entryId: string, formData: FormData) {
  const { supabase, user } = await requireSupabaseWithUser();
  const payload = parsePayload(formData);

  const { error } = await supabase
    .from("house_entries")
    .update(payload)
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/entries");
  revalidatePath(`/entries/${entryId}`);
  redirect(`/entries/${entryId}`);
}

export async function deleteEntryAction(entryId: string) {
  const { supabase, user } = await requireSupabaseWithUser();
  const { error } = await supabase
    .from("house_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/entries");
  redirect("/entries");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
