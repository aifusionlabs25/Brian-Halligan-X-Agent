import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

const runtime = read("src/lib/hal/runtime.ts");
assert.match(runtime, /live_tavus_called:\s*false/);
assert.match(runtime, /tavus_create_conversation_called:\s*false/);
assert.match(runtime, /outbound_action_taken:\s*false/);
assert.match(runtime, /action_claim_allowed:\s*false/);

const startPreview = read("src/lib/hal/conversationStartPreview.ts");
assert.match(startPreview, /env:HAL_TAVUS_REPLICA_ID/);
assert.doesNotMatch(startPreview, /r9cd01efc513/);

const manifest = read("HAL_PUBLIC_KNOWLEDGE_MANIFEST.md");
assert.match(manifest, /Brian-Provided Google Drive KB Handling/);
assert.match(manifest, /unapproved private Google Drive files/);

const transcript = read("HAL_VIDEO_TRANSCRIPT_ANALYSIS.md");
assert.match(transcript, /concise memory-backed chief of staff/);
assert.match(transcript, /clone framing/i);

const meetingTransport = read("src/lib/hal/meetingTransport.ts");
assert.match(meetingTransport, /live_zoom_called:\s*false/);
assert.match(meetingTransport, /live_teams_called:\s*false/);
assert.match(meetingTransport, /external_meeting_joined:\s*false/);
assert.match(meetingTransport, /media_bridge_started:\s*false/);
assert.match(meetingTransport, /external meeting transport adapter with media bridge/);
assert.match(meetingTransport, /Hal \(AI\)/);

const meetingRoute = read("src/app/api/hal/meeting-transport/preview/route.ts");
assert.match(meetingRoute, /buildHalMeetingTransportPreview/);

const sidecarDoc = read("HAL_MEETING_TRANSPORT_SIDECAR.md");
assert.match(sidecarDoc, /Zoom or Microsoft Teams meetings/);
assert.match(sidecarDoc, /Unsafe claim today/);
assert.match(sidecarDoc, /does not yet join external meetings/);

console.log("hal-boundaries: ok");
