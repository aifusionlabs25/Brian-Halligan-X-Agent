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

const zoomMeetingCreate = read("src/lib/hal/zoomMeetingCreate.ts");
assert.match(zoomMeetingCreate, /zoom_oauth_token_requested:\s*false/);
assert.match(zoomMeetingCreate, /live_zoom_called:\s*false/);
assert.match(zoomMeetingCreate, /zoom_meeting_created:\s*false/);
assert.match(zoomMeetingCreate, /zoom_reason/);
assert.match(zoomMeetingCreate, /CREATE_ZOOM_MEETING/);
assert.match(zoomMeetingCreate, /HAL_ZOOM_LIVE_CREATE_KILL_SWITCH=false/);
assert.doesNotMatch(zoomMeetingCreate, /ZOOM_CLIENT_SECRET=.*[A-Za-z0-9]{8}/);

const zoomPreviewRoute = read("src/app/api/hal/zoom/meeting/create-preview/route.ts");
assert.match(zoomPreviewRoute, /buildHalZoomMeetingCreatePreview/);

const zoomLiveRoute = read("src/app/api/hal/zoom/meeting/create-live/route.ts");
assert.match(zoomLiveRoute, /createZoomMeetingLiveGated/);
assert.match(zoomLiveRoute, /live_zoom_called:\s*false/);

const zoomDoc = read("HAL_ZOOM_MEETING_CREATE_SIDECAR.md");
assert.match(zoomDoc, /dry-run adapter with live gate/);
assert.match(zoomDoc, /Unsafe until a gated live test passes/);
assert.match(zoomDoc, /ZOOM_CLIENT_SECRET=/);
assert.match(zoomDoc, /Do not use the `me` shortcut/);

const envExample = read(".env.example");
assert.match(envExample, /ZOOM_USER_ID=\s*$/m);
assert.match(envExample, /HAL_ZOOM_RETURN_SDK_JWT=false/);

const zoomJoin = read("src/lib/hal/zoomMeetingJoin.ts");
assert.match(zoomJoin, /zoom_meeting_joined:\s*false/);
assert.match(zoomJoin, /zoom_audio_connected:\s*false/);
assert.match(zoomJoin, /tavus_media_bridge_started:\s*false/);
assert.match(zoomJoin, /RETURN_ZOOM_SDK_JWT/);
assert.match(zoomJoin, /createHmac/);

const zoomJoinRoute = read("src/app/api/hal/zoom/meeting/join-preview/route.ts");
assert.match(zoomJoinRoute, /buildHalZoomMeetingJoinPreview/);

const zoomSdkJwtRoute = read("src/app/api/hal/zoom/meeting/sdk-jwt/route.ts");
assert.match(zoomSdkJwtRoute, /buildHalZoomMeetingSdkJwtResponse/);

const zoomJoinDoc = read("HAL_ZOOM_JOIN_SIDECAR.md");
assert.match(zoomJoinDoc, /Meeting SDK JWT/);
assert.match(zoomJoinDoc, /It still does not join a meeting by itself/);
assert.match(zoomJoinDoc, /HAL_ZOOM_RETURN_SDK_JWT=false/);

console.log("hal-boundaries: ok");
