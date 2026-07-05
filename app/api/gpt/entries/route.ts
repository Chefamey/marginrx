import { NextRequest, NextResponse } from "next/server";
import { getGptEntries, hasGptDataConfig, isAuthorizedGptRequest, missingGptConfigResponse, unauthorizedGptResponse } from "@/lib/gpt-api";

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
    const entries = await getGptEntries(request.nextUrl.searchParams);
    return NextResponse.json({
      records: entries,
      count: entries.length
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to read House OS records",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
