import { HAL_BOUNDARY_FLAGS } from "./runtime";

type ZoomMeetingCreateInput = {
  topic?: unknown;
  agenda?: unknown;
  start_time?: unknown;
  duration_minutes?: unknown;
  timezone?: unknown;
  recipients?: unknown;
  host_authorized?: unknown;
  invite_sending_authorized?: unknown;
  meeting_context_summary?: unknown;
  confirm_live_zoom_create?: unknown;
};

const ZOOM_MEETING_CREATE_BOUNDARY_FLAGS = {
  zoom_oauth_token_requested: false,
  live_zoom_called: false,
  zoom_meeting_created: false,
  zoom_join_url_returned: false,
  zoom_start_url_returned: false,
  calendar_invite_sent: false,
  email_invite_sent: false,
  external_invites_sent: false,
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

function asPositiveInteger(value: unknown, fallback: number) {
  const numeric = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function defaultStartTime() {
  return new Date(Date.now() + 30 * 60 * 1000).toISOString();
}

function readZoomMeetingCreateConfig() {
  const accountId = env("ZOOM_ACCOUNT_ID");
  const clientId = env("ZOOM_CLIENT_ID");
  const clientSecret = env("ZOOM_CLIENT_SECRET");
  const userId = env("ZOOM_USER_ID");
  const liveEnabled = env("HAL_ZOOM_LIVE_CREATE_ENABLED") === "true";
  const killSwitchOpen = env("HAL_ZOOM_LIVE_CREATE_KILL_SWITCH") === "false";
  const mode = env("HAL_ZOOM_MEETING_CREATE_MODE") || "dry-run";

  return {
    mode,
    live_enabled: liveEnabled,
    kill_switch_open: killSwitchOpen,
    zoom_user_id_configured: Boolean(userId),
    zoom_account_id_configured: Boolean(accountId),
    zoom_client_id_configured: Boolean(clientId),
    zoom_client_secret_configured: Boolean(clientSecret),
    return_join_url: env("HAL_ZOOM_RETURN_JOIN_URL") === "true",
    missing_env: [
      !accountId ? "ZOOM_ACCOUNT_ID" : "",
      !clientId ? "ZOOM_CLIENT_ID" : "",
      !clientSecret ? "ZOOM_CLIENT_SECRET" : "",
      !userId ? "ZOOM_USER_ID" : "",
    ].filter(Boolean),
    user_id: userId || "<ZOOM_USER_ID>",
    account_id: accountId,
    client_id: clientId,
    client_secret: clientSecret,
  };
}

function normalizeRecipients(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.includes("@"))
    .map((item) => item.trim())
    .slice(0, 10);
}

function buildZoomCreateRequest(input: ZoomMeetingCreateInput) {
  const topic = asText(input.topic, "Hal working session");
  const agenda = asText(
    input.agenda,
    "AI operating partner meeting created by Hal after explicit authorization.",
  );

  return {
    topic,
    type: 2,
    start_time: asText(input.start_time, defaultStartTime()),
    duration: asPositiveInteger(input.duration_minutes, 30),
    timezone: asText(input.timezone, "America/Phoenix"),
    agenda,
    settings: {
      join_before_host: false,
      waiting_room: true,
      approval_type: 2,
      auto_recording: "none",
      mute_upon_entry: true,
      participant_video: false,
      host_video: false,
    },
  };
}

export function buildHalZoomMeetingCreatePreview(input: ZoomMeetingCreateInput = {}) {
  const config = readZoomMeetingCreateConfig();
  const hostAuthorized = asBool(input.host_authorized);
  const inviteSendingAuthorized = asBool(input.invite_sending_authorized);
  const recipients = normalizeRecipients(input.recipients);
  const zoomRequest = buildZoomCreateRequest(input);
  const createEndpoint = `/v2/users/${config.user_id}/meetings`;

  return {
    zoom_meeting_create_preview_version: "hal_zoom_meeting_create_v1",
    agent_slug: "hal",
    status: "dry_run_zoom_meeting_create_plan",
    zoom_runtime: {
      mode: config.mode,
      live_enabled: config.live_enabled,
      kill_switch_open: config.kill_switch_open,
      zoom_account_id_configured: config.zoom_account_id_configured,
      zoom_client_id_configured: config.zoom_client_id_configured,
      zoom_client_secret_configured: config.zoom_client_secret_configured,
      missing_env: config.missing_env,
    },
    input_summary: {
      host_authorized: hostAuthorized,
      invite_sending_authorized: inviteSendingAuthorized,
      recipient_count: recipients.length,
      topic: zoomRequest.topic,
      start_time: zoomRequest.start_time,
      duration: zoomRequest.duration,
      timezone: zoomRequest.timezone,
      meeting_context_summary: asText(input.meeting_context_summary, "not provided"),
    },
    zoom_api_plan: {
      auth_lane: "Zoom Server-to-Server OAuth",
      token_endpoint: "POST https://zoom.us/oauth/token?grant_type=account_credentials&account_id=<ZOOM_ACCOUNT_ID>",
      create_meeting_endpoint: `POST https://api.zoom.us${createEndpoint}`,
      target_user: config.user_id,
      request_headers: ["Authorization: Bearer <access_token>", "Content-Type: application/json"],
      docs: [
        "https://developers.zoom.us/docs/api/",
        "https://developers.zoom.us/docs/integrations/oauth/",
      ],
    },
    zoom_request_preview: zoomRequest,
    invite_policy: {
      invite_sending_in_this_route: false,
      recipients_redacted: recipients.map(() => "recipient_redacted"),
      next_step:
        "Return or store Zoom receipt first; send email/calendar invite only through a separately authorized tool receipt.",
    },
    tavus_follow_on: {
      can_attach_hal_tavus_room: true,
      can_make_hal_live_zoom_participant: false,
      reason:
        "Creating a Zoom meeting is not the same as joining it with Tavus media. The meeting-transport sidecar must still bridge live audio/video.",
    },
    hermes_follow_on: {
      pre_meeting: [
        "compile meeting brief",
        "mark approved sources and blocked sources",
        "set Hal mandate and allowed actions",
      ],
      post_meeting: [
        "process transcript only after authorized capture",
        "create memory candidates pending operator review",
        "draft follow-ups without sending",
      ],
    },
    release_claim_allowed: false,
    ...HAL_BOUNDARY_FLAGS,
    ...ZOOM_MEETING_CREATE_BOUNDARY_FLAGS,
  };
}

function assertLiveZoomCreateAllowed(input: ZoomMeetingCreateInput, config: ReturnType<typeof readZoomMeetingCreateConfig>) {
  const closed = [
    config.mode !== "live" ? "HAL_ZOOM_MEETING_CREATE_MODE=live" : "",
    !config.live_enabled ? "HAL_ZOOM_LIVE_CREATE_ENABLED=true" : "",
    !config.kill_switch_open ? "HAL_ZOOM_LIVE_CREATE_KILL_SWITCH=false" : "",
    input.confirm_live_zoom_create !== "CREATE_ZOOM_MEETING" ? "confirm_live_zoom_create=CREATE_ZOOM_MEETING" : "",
    !asBool(input.host_authorized) ? "host_authorized=true" : "",
    ...config.missing_env,
  ].filter(Boolean);

  if (closed.length) {
    const error = new Error(`zoom_live_create_gates_closed:${closed.join(",")}`);
    error.name = "ZoomLiveCreateGatesClosed";
    throw error;
  }
}

export async function createZoomMeetingLiveGated(input: ZoomMeetingCreateInput = {}) {
  const config = readZoomMeetingCreateConfig();
  assertLiveZoomCreateAllowed(input, config);

  const tokenParams = new URLSearchParams({
    grant_type: "account_credentials",
    account_id: config.account_id,
  });
  const basicAuth = Buffer.from(`${config.client_id}:${config.client_secret}`).toString("base64");

  const tokenResponse = await fetch(`https://zoom.us/oauth/token?${tokenParams.toString()}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
    },
  });
  const tokenJson = (await tokenResponse.json().catch(() => ({}))) as Record<string, unknown>;

  if (!tokenResponse.ok || typeof tokenJson.access_token !== "string") {
    return {
      zoom_meeting_create_live_version: "hal_zoom_meeting_create_live_v1",
      status: "zoom_token_request_failed",
      http_status: tokenResponse.status,
      zoom_oauth_token_requested: true,
      live_zoom_called: true,
      zoom_meeting_created: false,
      error: typeof tokenJson.message === "string" ? tokenJson.message : "Zoom token request failed",
      ...HAL_BOUNDARY_FLAGS,
      outbound_action_taken: false,
      action_claim_allowed: false,
    };
  }

  const zoomRequest = buildZoomCreateRequest(input);
  const createResponse = await fetch(
    `https://api.zoom.us/v2/users/${encodeURIComponent(config.user_id)}/meetings`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zoomRequest),
    },
  );
  const createJson = (await createResponse.json().catch(() => ({}))) as Record<string, unknown>;
  const created = createResponse.ok && Boolean(createJson.id);

  return {
    zoom_meeting_create_live_version: "hal_zoom_meeting_create_live_v1",
    status: created ? "zoom_meeting_created" : "zoom_meeting_create_failed",
    http_status: createResponse.status,
    zoom_oauth_token_requested: true,
    live_zoom_called: true,
    zoom_meeting_created: created,
    outbound_action_taken: created,
    action_claim_allowed: created,
    meeting_receipt: {
      provider: "zoom",
      meeting_id_present: Boolean(createJson.id),
      uuid_present: Boolean(createJson.uuid),
      join_url_present: Boolean(createJson.join_url),
      start_url_present: Boolean(createJson.start_url),
      join_url: config.return_join_url && typeof createJson.join_url === "string" ? createJson.join_url : undefined,
      start_url: undefined,
      created_at: typeof createJson.created_at === "string" ? createJson.created_at : undefined,
      topic: typeof createJson.topic === "string" ? createJson.topic : zoomRequest.topic,
    },
    calendar_invite_sent: false,
    email_invite_sent: false,
    external_invites_sent: false,
    production_database_mutated: false,
    production_memory_database_mutated: false,
  };
}
