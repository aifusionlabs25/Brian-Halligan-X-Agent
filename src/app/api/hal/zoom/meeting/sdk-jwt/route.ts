import { NextResponse } from "next/server";
import { readOptionalJsonBody } from "@/lib/hal/runtime";
import { buildHalZoomMeetingSdkJwtResponse } from "@/lib/hal/zoomMeetingJoin";

export async function POST(request: Request) {
  const body = await readOptionalJsonBody(request);
  const result = buildHalZoomMeetingSdkJwtResponse(body);
  return NextResponse.json(result, { status: result.status === "blocked" ? 409 : 200 });
}
