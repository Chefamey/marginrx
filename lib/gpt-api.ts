import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { houseModules, isHouseModule, type HouseModule } from "@/lib/modules";
import type { HouseEntry, HouseEntryPayload } from "@/lib/types";

export type PublicHouseEntry = Omit<HouseEntry, "user_id">;

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 25;
const MAX_TITLE_LENGTH = 180;
const MAX_CATEGORY_LENGTH = 120;
const MAX_TAG_LENGTH = 48;
const MAX_TAGS = 24;
const MAX_BODY_LENGTH = 20000;
const MAX_CONTEXT_LENGTH = 8000;

type JsonRecord = Record<string, unknown>;

export class GptApiError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

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

export function isAuthorizedGptWriteRequest(request: NextRequest) {
  const expectedToken = process.env.HOUSE_OS_GPT_WRITE_TOKEN?.trim() || process.env.HOUSE_OS_GPT_TOKEN?.trim();

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

export function gptApiErrorResponse(error: unknown, fallback: string) {
  const status = error instanceof GptApiError ? error.status : 500;

  return NextResponse.json(
    {
      error: fallback,
      message: error instanceof Error ? error.message : "Unknown error"
    },
    { status }
  );
}

export async function readGptJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    throw new GptApiError("Request body must be valid JSON.");
  }
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

function isJsonRecord(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function requireJsonRecord(value: unknown) {
  if (!isJsonRecord(value)) {
    throw new GptApiError("Request body must be a JSON object.");
  }

  return value;
}

function textField(value: unknown, field: string, maxLength: number, required: boolean) {
  const text = typeof value === "string" ? value.trim() : "";

  if (required && !text) {
    throw new GptApiError(`${field} is required.`);
  }

  if (text.length > maxLength) {
    throw new GptApiError(`${field} must be ${maxLength} characters or fewer.`);
  }

  return text;
}

function normalizeTags(value: unknown) {
  const rawTags = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  return Array.from(
    new Set(
      rawTags
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter(Boolean)
        .map((tag) => {
          if (tag.length > MAX_TAG_LENGTH) {
            throw new GptApiError(`Tags must be ${MAX_TAG_LENGTH} characters or fewer.`);
          }

          return tag;
        })
    )
  ).slice(0, MAX_TAGS);
}

function isValidDateString(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function currentHouseDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
}

function normalizeDate(value: unknown, field: string, fallback?: string) {
  const date = typeof value === "string" && value.trim() ? value.trim() : fallback;

  if (!date) {
    throw new GptApiError(`${field} is required.`);
  }

  if (!isValidDateString(date)) {
    throw new GptApiError(`${field} must be a valid date in YYYY-MM-DD format.`);
  }

  return date;
}

function normalizeModuleField(value: unknown, required: boolean, fallback?: HouseModule) {
  const normalizedModule = typeof value === "string" && value.trim() ? value.trim() : fallback;

  if (!normalizedModule) {
    if (required) {
      throw new GptApiError("module is required.");
    }

    return undefined;
  }

  if (!isHouseModule(normalizedModule)) {
    throw new GptApiError(`module must be one of: ${houseModules.map((item) => item.key).join(", ")}.`);
  }

  return normalizedModule;
}

function normalizeCreatePayload(input: unknown): HouseEntryPayload {
  const body = requireJsonRecord(input);

  return {
    module: normalizeModuleField(body.module, true)!,
    title: textField(body.title, "title", MAX_TITLE_LENGTH, true),
    category: textField(body.category, "category", MAX_CATEGORY_LENGTH, true),
    tags: normalizeTags(body.tags),
    entry_date: normalizeDate(body.entry_date, "entry_date"),
    body: textField(body.body, "body", MAX_BODY_LENGTH, true),
    context: textField(body.context, "context", MAX_CONTEXT_LENGTH, false) || null
  };
}

function normalizeUpdatePayload(input: unknown): Partial<HouseEntryPayload> {
  const body = requireJsonRecord(input);
  const payload: Partial<HouseEntryPayload> = {};

  if ("module" in body) {
    payload.module = normalizeModuleField(body.module, true)!;
  }

  if ("title" in body) {
    payload.title = textField(body.title, "title", MAX_TITLE_LENGTH, true);
  }

  if ("category" in body) {
    payload.category = textField(body.category, "category", MAX_CATEGORY_LENGTH, true);
  }

  if ("tags" in body) {
    payload.tags = normalizeTags(body.tags);
  }

  if ("entry_date" in body) {
    payload.entry_date = normalizeDate(body.entry_date, "entry_date");
  }

  if ("body" in body) {
    payload.body = textField(body.body, "body", MAX_BODY_LENGTH, true);
  }

  if ("context" in body) {
    payload.context = textField(body.context, "context", MAX_CONTEXT_LENGTH, false) || null;
  }

  if (Object.keys(payload).length === 0) {
    throw new GptApiError("At least one editable field is required.");
  }

  return payload;
}

async function resolveOwnerUserId(supabase: ReturnType<typeof createSupabaseAdminClient>) {
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

  return ownerUserId;
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

  const ownerUserId = await resolveOwnerUserId(supabase);

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

export async function getGptEntry(entryId: string) {
  const supabase = createSupabaseAdminClient();
  const ownerUserId = await resolveOwnerUserId(supabase);

  const { data, error } = await supabase
    .from("house_entries")
    .select("*")
    .eq("id", entryId)
    .eq("user_id", ownerUserId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new GptApiError("House OS record not found.", 404);
  }

  return publicEntry(data as HouseEntry);
}

export async function createGptEntry(input: unknown) {
  const supabase = createSupabaseAdminClient();
  const ownerUserId = await resolveOwnerUserId(supabase);
  const payload = normalizeCreatePayload(input);

  const { data, error } = await supabase
    .from("house_entries")
    .insert({ ...payload, user_id: ownerUserId })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return publicEntry(data as HouseEntry);
}

export async function updateGptEntry(entryId: string, input: unknown) {
  const supabase = createSupabaseAdminClient();
  const ownerUserId = await resolveOwnerUserId(supabase);
  const payload = normalizeUpdatePayload(input);

  const { data, error } = await supabase
    .from("house_entries")
    .update(payload)
    .eq("id", entryId)
    .eq("user_id", ownerUserId)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new GptApiError("House OS record not found.", 404);
  }

  return publicEntry(data as HouseEntry);
}

export async function upsertGptDailyUpdate(input: unknown) {
  const body = requireJsonRecord(input);
  const date = normalizeDate(body.date ?? body.entry_date, "date", currentHouseDate());
  const entryModule = normalizeModuleField(body.module, false, "projects")!;
  const category = textField(body.category, "category", MAX_CATEGORY_LENGTH, false) || "Daily Operating Update";
  const title = textField(body.title, "title", MAX_TITLE_LENGTH, false) || `Daily House OS Update - ${date}`;
  const tags = Array.from(new Set(["daily-update", "gpt-action", ...normalizeTags(body.tags)])).slice(0, MAX_TAGS);
  const payload: HouseEntryPayload = {
    module: entryModule,
    title,
    category,
    tags,
    entry_date: date,
    body: textField(body.body, "body", MAX_BODY_LENGTH, true),
    context:
      textField(body.context, "context", MAX_CONTEXT_LENGTH, false) ||
      "Created through the secure House OS GPT daily update API."
  };

  const supabase = createSupabaseAdminClient();
  const ownerUserId = await resolveOwnerUserId(supabase);

  const { data: existing, error: findError } = await supabase
    .from("house_entries")
    .select("*")
    .eq("user_id", ownerUserId)
    .eq("module", payload.module)
    .eq("entry_date", payload.entry_date)
    .eq("category", payload.category)
    .eq("title", payload.title)
    .maybeSingle();

  if (findError) {
    throw new Error(findError.message);
  }

  if (existing) {
    const { data, error } = await supabase
      .from("house_entries")
      .update(payload)
      .eq("id", (existing as HouseEntry).id)
      .eq("user_id", ownerUserId)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      action: "updated" as const,
      record: publicEntry(data as HouseEntry)
    };
  }

  const { data, error } = await supabase
    .from("house_entries")
    .insert({ ...payload, user_id: ownerUserId })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    action: "created" as const,
    record: publicEntry(data as HouseEntry)
  };
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
