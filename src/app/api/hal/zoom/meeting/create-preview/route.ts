import { NextResponse } from "next/server";
import { readOptionalJsonBody } from "@/lib/hal/runtime";
import { buildHalZoomMeetingCreatePreview } from "@/lib/hal/zoomMeetingCreate";

export async function POST(request: Request) {
  const body = await readOptionalJsonBody(request);
  return NextResponse.json(buildHalZoomMeetingCreatePreview(body));
}
