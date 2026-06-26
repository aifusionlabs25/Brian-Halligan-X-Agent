import { createHmac } from "node:crypto";
import { HAL_BOUNDARY_FLAGS } from "./runtime";

type ZoomMeetingJoinInput = {
  meeting_number?: unknown;
  meeting_password?: unknown;
  display_name?: unknown;
  role?: unknown;
  host_authorized?: unknown;
  visible_ai_disclosure?: unknown;
  meeting_owned_by_developer_account?: unknown;
  confirm_return_sdk_jwt?: unknown;
};

const ZOOM_JOIN_BOUNDARY_FLAGS = {
  zoom_meeting_sdk_jwt_generated: false,
  zoom_meeting_sdk_jwt_returned: false,
  zoom_meeting_joined: false,
  zoom_waiting_room_entered: false,
  zoom_audio_connected: false,
  zoom_video_connected: false,
  tavus_media_bridge_started: false,
  zoom_rtms_started: false,
} as const;

function env(key: string) {
  return process.env[key]?.replace(/^\uFEFF/, "").trim() ?? "";
}

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asBool(value: unknown) {
  return value === true || value === "true";
}

function asRole(value: unknown) {
  const numeric = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return numeric === 1 ? 1 : 0;
}

function readZoomMeetingSdkConfig() {
  const clientId = env("ZOOM_MEETING_SDK_CLIENT_ID");
  const clientSecret = env("ZOOM_MEETING_SDK_CLIENT_SECRET");
  return {
    mode: env("HAL_ZOOM_JOIN_MODE") || "dry-run",
    sdk_enabled: env("HAL_ZOOM_MEETING_SDK_ENABLED") === "true",
    kill_switch_open: env("HAL_ZOOM_MEETING_SDK_KILL_SWITCH") === "false",
    return_sdk_jwt: env("HAL_ZOOM_RETURN_SDK_JWT") === "true",
    client_id_configured: Boolean(clientId),
    client_secret_configured: Boolean(clientSecret),
    missing_env: [
      !clientId ? "ZOOM_MEETING_SDK_CLIENT_ID" : "",
      !clientSecret ? "ZOOM_MEETING_SDK_CLIENT_SECRET" : "",
    ].filter(Boolean),
    client_id: clientId,
    client_secret: clientSecret,
  };
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function buildZoomMeetingSdkJwt({
  clientId,
  clientSecret,
  meetingNumber,
  role,
}: {
  clientId: string;
  clientSecret: string;
  meetingNumber: string;
  role: 0 | 1;
}) {
  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    appKey: clientId,
    mn: meetingNumber,
    role,
    iat,
    exp,
    tokenExp: exp,
    video_webrtc_mode: 0,
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", clientSecret).update(signingInput).digest();

  return {
    jwt: `${signingInput}.${base64UrlEncode(signature)}`,
    expires_at_epoch_seconds: exp,
    role,
    meeting_number_present: Boolean(meetingNumber),
  };
}

export function buildHalZoomMeetingJoinPreview(input: ZoomMeetingJoinInput = {}) {
  const config = readZoomMeetingSdkConfig();
  const meetingNumber = asText(input.meeting_number);
  const role = asRole(input.role);
  const hostAuthorized = asBool(input.host_authorized);
  const visibleDisclosure = asBool(input.visible_ai_disclosure);
  const internalMeeting = asBool(input.meeting_owned_by_developer_account);

  return {
    zoom_meeting_join_preview_version: "hal_zoom_meeting_join_v1",
    agent_slug: "hal",
    status: "dry_run_zoom_join_plan",
    zoom_join_runtime: {
      mode: config.mode,
      sdk_enabled: config.sdk_enabled,
      kill_switch_open: config.kill_switch_open,
      client_id_configured: config.client_id_configured,
      client_secret_configured: config.client_secret_configured,
      missing_env: config.missing_env,
    },
    input_summary: {
      meeting_number_present: Boolean(meetingNumber),
      meeting_password_present: Boolean(asText(input.meeting_password)),
      display_name: asText(input.display_name, "Hal (AI)"),
      role,
      host_authorized: hostAuthorized,
      visible_ai_disclosure: visibleDisclosure,
      meeting_owned_by_developer_account: internalMeeting,
    },
    join_decision: {
      can_generate_meeting_sdk_jwt:
        config.sdk_enabled && config.kill_switch_open && config.client_id_configured && config.client_secret_configured,
      can_join_with_current_route: false,
      reason:
        "This route prepares Zoom Meeting SDK authorization. A web/native SDK client is still required to enter the meeting.",
      external_meeting_note: internalMeeting
        ? "Meeting appears inside the developer account; participant join can use Meeting SDK JWT only."
        : "External-account meetings require Zoom review and user-attributed authorization such as ZAK or OBF.",
    },
    future_client_handoff: {
      sdk_client_id_source: "env:ZOOM_MEETING_SDK_CLIENT_ID",
      signature_source: "/api/hal/zoom/meeting/sdk-jwt",
      meeting_number: meetingNumber ? "provided_not_returned" : "missing",
      password: asText(input.meeting_password) ? "provided_not_returned" : "missing_or_not_required",
      user_name: asText(input.display_name, "Hal (AI)"),
      role,
      disclosure: "Hal (AI) must be visible as an AI participant and must not impersonate Brian.",
    },
    tavus_bridge_status: {
      tavus_media_bridge_available: false,
      next_step:
        "After Zoom SDK join succeeds, build media bridge or RTMS lane to pass meeting turns into Hal/Tavus and play responses back.",
    },
    ...HAL_BOUNDARY_FLAGS,
    ...ZOOM_JOIN_BOUNDARY_FLAGS,
  };
}

export function buildHalZoomMeetingSdkJwtResponse(input: ZoomMeetingJoinInput = {}) {
  const config = readZoomMeetingSdkConfig();
  const meetingNumber = asText(input.meeting_number);
  const role = asRole(input.role);
  const closed = [
    config.mode !== "live" ? "HAL_ZOOM_JOIN_MODE=live" : "",
    !config.sdk_enabled ? "HAL_ZOOM_MEETING_SDK_ENABLED=true" : "",
    !config.kill_switch_open ? "HAL_ZOOM_MEETING_SDK_KILL_SWITCH=false" : "",
    !meetingNumber ? "meeting_number" : "",
    ...config.missing_env,
  ].filter(Boolean);

  if (closed.length) {
    return {
      zoom_meeting_sdk_jwt_version: "hal_zoom_meeting_sdk_jwt_v1",
      status: "blocked",
      blocked_reasons: closed,
      zoom_meeting_sdk_jwt_generated: false,
      zoom_meeting_sdk_jwt_returned: false,
      ...HAL_BOUNDARY_FLAGS,
    };
  }

  const signed = buildZoomMeetingSdkJwt({
    clientId: config.client_id,
    clientSecret: config.client_secret,
    meetingNumber,
    role,
  });
  const mayReturnJwt =
    config.return_sdk_jwt && input.confirm_return_sdk_jwt === "RETURN_ZOOM_SDK_JWT";

  return {
    zoom_meeting_sdk_jwt_version: "hal_zoom_meeting_sdk_jwt_v1",
    status: "sdk_jwt_generated",
    meeting_number_present: signed.meeting_number_present,
    role: signed.role,
    expires_at_epoch_seconds: signed.expires_at_epoch_seconds,
    zoom_meeting_sdk_jwt_generated: true,
    zoom_meeting_sdk_jwt_returned: mayReturnJwt,
    sdk_client_id: mayReturnJwt ? config.client_id : undefined,
    sdk_jwt: mayReturnJwt ? signed.jwt : undefined,
    ...HAL_BOUNDARY_FLAGS,
    live_zoom_called: false,
    outbound_action_taken: false,
    action_claim_allowed: false,
  };
}

export const ZOOM_MEETING_SDK_CDN = "https://source.zoom.us/6.2.0/zoomus-websdk-embedded.umd.min.js";
