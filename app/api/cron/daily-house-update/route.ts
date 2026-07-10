import { NextRequest, NextResponse } from "next/server";
import { gptApiErrorResponse, hasGptDataConfig, missingGptConfigResponse, seedGptDailyUpdate } from "@/lib/gpt-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function unauthorizedCronResponse() {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message: "House OS daily automation requires the Vercel CRON_SECRET bearer token."
    },
    { status: 401 }
  );
}

function isAuthorizedCronRequest(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");

  return Boolean(cronSecret && authorization === `Bearer ${cronSecret}`);
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return unauthorizedCronResponse();
  }

  if (!hasGptDataConfig()) {
    return missingGptConfigResponse();
  }

  try {
    const result = await seedGptDailyUpdate({
      body: [
        "Automated daily House OS readiness check.",
        "",
        "System status:",
        "- Vercel Cron reached the private operating archive.",
        "- No founder-supplied daily briefing was present when this job ran.",
        "",
        "Founder/GPT action:",
        "- Enrich this record with decisions, project movement, relationship notes, principles, wealth observations, and prophetic record items from the day."
      ].join("\n"),
      context:
        "Seeded by the secure Vercel Cron automation. The House OS GPT can update this same daily record when the founder supplies richer operating context.",
      tags: ["automation", "daily-update", "vercel-cron"]
    });

    return NextResponse.json({
      success: true,
      schedule: request.headers.get("x-vercel-cron-schedule"),
      ...result
    });
  } catch (error) {
    return gptApiErrorResponse(error, "Unable to run House OS daily automation");
  }
}
