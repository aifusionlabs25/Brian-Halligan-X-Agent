import { NextResponse } from "next/server";
import { readOptionalJsonBody } from "@/lib/hal/runtime";
import { buildHalZoomMeetingJoinPreview } from "@/lib/hal/zoomMeetingJoin";

export async function POST(request: Request) {
  const body = await readOptionalJsonBody(request);
  return NextResponse.json(buildHalZoomMeetingJoinPreview(body));
}
