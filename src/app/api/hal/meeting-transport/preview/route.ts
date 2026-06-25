import { NextResponse } from "next/server";
import { buildHalMeetingTransportPreview } from "@/lib/hal/meetingTransport";
import { readOptionalJsonBody } from "@/lib/hal/runtime";

export async function POST(request: Request) {
  const body = await readOptionalJsonBody(request);
  return NextResponse.json(buildHalMeetingTransportPreview(body));
}
