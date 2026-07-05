import { NextRequest, NextResponse } from "next/server";
import { buildHouseSummary, getGptEntries, hasGptDataConfig, isAuthorizedGptRequest, missingGptConfigResponse, unauthorizedGptResponse } from "@/lib/gpt-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAuthorizedGptRequest(request)) {
    return unauthorizedGptResponse();
  }

  if (!hasGptDataConfig()) {
    return missingGptConfigResponse();
  }

  try {
    const params = new URLSearchParams(request.nextUrl.searchParams);
    params.set("limit", "100");

    const entries = await getGptEntries(params);
    return NextResponse.json(buildHouseSummary(entries));
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to summarize House OS",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
