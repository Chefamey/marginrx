import { redirect } from "next/navigation";
import { defaultModule, normalizeModule, type HouseModule } from "@/lib/modules";
import { createSupabaseServerClient, hasSupabaseConfig } from "@/lib/supabase/server";
import type { HouseEntry } from "@/lib/types";

export async function getAuthenticatedUser() {
  if (!hasSupabaseConfig()) {
    return { user: null, configMissing: true };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    return { user: null, configMissing: false };
  }

  return { user, configMissing: false };
}

export async function requireAuthenticatedUser() {
  const session = await getAuthenticatedUser();

  if (session.configMissing) {
    return session;
  }

  if (!session.user) {
    redirect("/login");
  }

  return session;
}

export async function getEntries(options?: {
  module?: string | null;
  query?: string | null;
  limit?: number;
}) {
  const session = await requireAuthenticatedUser();
  if (session.configMissing || !session.user) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const requestedModule = options?.module ? normalizeModule(options.module) : null;

  let request = supabase
    .from("house_entries")
    .select("*")
    .eq("user_id", session.user.id)
    .order("entry_date", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(options?.limit ?? 250);

  if (requestedModule) {
    request = request.eq("module", requestedModule);
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(error.message);
  }

  const entries = (data ?? []) as HouseEntry[];
  const query = options?.query?.trim().toLowerCase();

  if (!query) {
    return entries;
  }

  return entries.filter((entry) => {
    const searchBody = [
      entry.title,
      entry.category,
      entry.body,
      entry.context ?? "",
      entry.tags.join(" "),
      entry.module
    ]
      .join(" ")
      .toLowerCase();

    return searchBody.includes(query);
  });
}

export async function getEntry(id: string) {
  const session = await requireAuthenticatedUser();
  if (session.configMissing || !session.user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("house_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (error) {
    return null;
  }

  return data as HouseEntry;
}

export function parseModuleFromSearch(value: string | string[] | undefined): HouseModule {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ? normalizeModule(raw) : defaultModule;
}
