import { NextRequest, NextResponse } from "next/server";
import {
  getGptEntry,
  gptApiErrorResponse,
  hasGptDataConfig,
  isAuthorizedGptRequest,
  isAuthorizedGptWriteRequest,
  missingGptConfigResponse,
  readGptJson,
  unauthorizedGptResponse,
  updateGptEntry
} from "@/lib/gpt-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type EntryRouteContext = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: EntryRouteContext) {
  if (!isAuthorizedGptRequest(request)) {
    return unauthorizedGptResponse();
  }

  if (!hasGptDataConfig()) {
    return missingGptConfigResponse();
  }

  try {
    const record = await getGptEntry(params.id);
    return NextResponse.json({ record });
  } catch (error) {
    return gptApiErrorResponse(error, "Unable to read House OS record");
  }
}

export async function PATCH(request: NextRequest, { params }: EntryRouteContext) {
  if (!isAuthorizedGptWriteRequest(request)) {
    return unauthorizedGptResponse();
  }

  if (!hasGptDataConfig()) {
    return missingGptConfigResponse();
  }

  try {
    const record = await updateGptEntry(params.id, await readGptJson(request));
    return NextResponse.json({ record });
  } catch (error) {
    return gptApiErrorResponse(error, "Unable to update House OS record");
  }
}
