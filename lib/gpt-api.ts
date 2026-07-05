import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { houseModules, isHouseModule, type HouseModule } from "@/lib/modules";
import type { HouseEntry } from "@/lib/types";

type PublicHouseEntry = Omit<HouseEntry, "user_id">;

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 25;

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") ?? "";
  const bearer = authorization.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  return bearer || request.headers.get("x-house-os-token")?.trim() || "";
}

export function isAuthorizedGptRequest(request: NextRequest) {
  const expectedToken = process.env.HOUSE_OS_GPT_TOKEN?.trim();

  if (!expectedToken) {
    return false;
  }

  return bearerToken(request) === expectedToken;
}

export function unauthorizedGptResponse() {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message: "House OS GPT access requires a valid bearer token."
    },
    { status: 401 }
  );
}

export function missingGptConfigResponse() {
  return NextResponse.json(
    {
      error: "GPT access is not configured",
      message:
        "Set HOUSE_OS_GPT_TOKEN, SUPABASE_SERVICE_ROLE_KEY, and HOUSE_OS_OWNER_USER_ID or HOUSE_OS_OWNER_EMAIL in Vercel before connecting a GPT Action."
    },
    { status: 503 }
  );
}

export function hasGptDataConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.HOUSE_OS_GPT_TOKEN &&
      (process.env.HOUSE_OS_OWNER_USER_ID || process.env.HOUSE_OS_OWNER_EMAIL)
  );
}

function createSupabaseAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase admin configuration.");
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

function normalizeLimit(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

function entryMatchesQuery(entry: PublicHouseEntry, query: string) {
  const haystack = [
    entry.title,
    entry.category,
    entry.body,
    entry.context ?? "",
    entry.module,
    entry.tags.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function publicEntry(entry: HouseEntry): PublicHouseEntry {
  const { user_id: _userId, ...publicRecord } = entry;
  return publicRecord;
}

export async function getGptEntries(searchParams: URLSearchParams) {
  const supabase = createSupabaseAdminClient();
  const query = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category")?.trim().toLowerCase() ?? "";
  const tag = searchParams.get("tag")?.trim().toLowerCase() ?? "";
  const requestedModule = searchParams.get("module");
  const limit = normalizeLimit(searchParams.get("limit"));

  let ownerUserId = process.env.HOUSE_OS_OWNER_USER_ID?.trim();
  const ownerEmail = process.env.HOUSE_OS_OWNER_EMAIL?.trim().toLowerCase();

  if (!ownerUserId && ownerEmail) {
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

    if (error) {
      throw new Error(error.message);
    }

    ownerUserId = data.users.find((user) => user.email?.toLowerCase() === ownerEmail)?.id;
  }

  if (!ownerUserId) {
    throw new Error("Missing HOUSE_OS_OWNER_USER_ID or HOUSE_OS_OWNER_EMAIL.");
  }

  let request = supabase.from("house_entries").select("*").eq("user_id", ownerUserId);

  if (isHouseModule(requestedModule)) {
    request = request.eq("module", requestedModule);
  }

  const { data, error } = await request
    .order("entry_date", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(Math.max(limit, 100));

  if (error) {
    throw new Error(error.message);
  }

  let entries = ((data ?? []) as HouseEntry[]).map(publicEntry);

  if (query) {
    entries = entries.filter((entry) => entryMatchesQuery(entry, query));
  }

  if (category) {
    entries = entries.filter((entry) => entry.category.toLowerCase().includes(category));
  }

  if (tag) {
    entries = entries.filter((entry) => entry.tags.some((entryTag) => entryTag.toLowerCase() === tag));
  }

  return entries.slice(0, limit);
}

export function buildHouseSummary(entries: PublicHouseEntry[]) {
  const moduleCounts = houseModules.map((module) => ({
    module: module.key as HouseModule,
    label: module.label,
    count: entries.filter((entry) => entry.module === module.key).length
  }));

  const categoryCounts = Object.entries(
    entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  return {
    totalRecords: entries.length,
    activeModules: moduleCounts.filter((module) => module.count > 0).length,
    modules: moduleCounts,
    categories: categoryCounts,
    recentEntries: entries.slice(0, 8)
  };
}
