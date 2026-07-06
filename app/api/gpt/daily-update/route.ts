import { NextRequest, NextResponse } from "next/server";
import {
  gptApiErrorResponse,
  hasGptDataConfig,
  isAuthorizedGptWriteRequest,
  missingGptConfigResponse,
  readGptJson,
  unauthorizedGptResponse,
  upsertGptDailyUpdate
} from "@/lib/gpt-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAuthorizedGptWriteRequest(request)) {
    return unauthorizedGptResponse();
  }

  if (!hasGptDataConfig()) {
    return missingGptConfigResponse();
  }

  try {
    const result = await upsertGptDailyUpdate(await readGptJson(request));
    return NextResponse.json(result, { status: result.action === "created" ? 201 : 200 });
  } catch (error) {
    return gptApiErrorResponse(error, "Unable to write daily House OS update");
  }
}
