import { NextResponse } from "next/server";
import { readOptionalJsonBody } from "@/lib/hal/runtime";
import { createZoomMeetingLiveGated } from "@/lib/hal/zoomMeetingCreate";

export async function POST(request: Request) {
  const body = await readOptionalJsonBody(request);

  try {
    return NextResponse.json(await createZoomMeetingLiveGated(body));
  } catch (error) {
    return NextResponse.json(
      {
        zoom_meeting_create_live_version: "hal_zoom_meeting_create_live_v1",
        status: "blocked",
        error: error instanceof Error ? error.message : "Zoom live create blocked",
        zoom_oauth_token_requested: false,
        live_zoom_called: false,
        zoom_meeting_created: false,
        outbound_action_taken: false,
        action_claim_allowed: false,
      },
      { status: 409 },
    );
  }
}
