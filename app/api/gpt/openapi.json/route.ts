import { NextRequest, NextResponse } from "next/server";
import { buildGptOpenApiSpec, gptOpenApiHeaders } from "@/lib/gpt-openapi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return NextResponse.json(buildGptOpenApiSpec(request.nextUrl.origin), {
    headers: gptOpenApiHeaders()
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: gptOpenApiHeaders()
  });
}
