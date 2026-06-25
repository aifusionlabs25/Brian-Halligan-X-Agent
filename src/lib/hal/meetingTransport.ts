import { HAL_BOUNDARY_FLAGS, readHalRuntimeConfig } from "./runtime";

export type MeetingPlatform = "zoom" | "teams" | "google_meet" | "tavus_daily" | "unknown";

type MeetingTransportInput = {
  meeting_url?: unknown;
  meeting_platform?: unknown;
  meeting_title?: unknown;
  host_authorized?: unknown;
  visible_ai_disclosure?: unknown;
  principal?: unknown;
  deployment_profile?: unknown;
};

const SIDE_CAR_BOUNDARY_FLAGS = {
  live_zoom_called: false,
  live_teams_called: false,
  live_google_meet_called: false,
  external_meeting_joined: false,
  meeting_bot_joined: false,
  media_bridge_started: false,
  participant_recording_started: false,
  meeting_url_fetched: false,
  provider_meeting_bot_called: false,
} as const;

function asText(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asBool(value: unknown) {
  return value === true || value === "true";
}

export function detectMeetingPlatform(meetingUrl: string, explicitPlatform?: unknown): MeetingPlatform {
  const explicit = asText(explicitPlatform).toLowerCase().replace(/[\s-]+/g, "_");
  if (explicit === "zoom") return "zoom";
  if (explicit === "teams" || explicit === "microsoft_teams") return "teams";
  if (explicit === "google_meet" || explicit === "meet") return "google_meet";
  if (explicit === "tavus_daily" || explicit === "daily") return "tavus_daily";

  const normalized = meetingUrl.toLowerCase();
  if (normalized.includes("zoom.us/") || normalized.includes("zoomgov.com/")) return "zoom";
  if (normalized.includes("teams.microsoft.com/") || normalized.includes("teams.live.com/")) return "teams";
  if (normalized.includes("meet.google.com/")) return "google_meet";
  if (normalized.includes("tavus.daily.co/") || normalized.includes("daily.co/")) return "tavus_daily";
  return "unknown";
}

function buildAdapterPlan(platform: MeetingPlatform) {
  if (platform === "zoom") {
    return {
      adapter_id: "zoom-meeting-transport",
      likely_lane: "Zoom Meeting SDK or approved meeting-bot provider",
      hard_parts: [
        "join existing Zoom meeting as a disclosed participant",
        "handle waiting room, passcode, host admit, mute state, and removal",
        "bridge meeting audio to Hal and play Hal audio/video back into Zoom",
        "capture transcript and participant events without over-retaining raw meeting content",
      ],
      live_dependencies: [
        "Zoom app credentials or provider account",
        "meeting host authorization",
        "bot display identity: Hal (AI)",
        "controlled test meeting",
      ],
    };
  }

  if (platform === "teams") {
    return {
      adapter_id: "teams-meeting-transport",
      likely_lane: "Microsoft Graph Cloud Communications bot or approved meeting-bot provider",
      hard_parts: [
        "tenant and Teams calling eligibility",
        "Azure Bot registration and Teams channel/calling configuration",
        "join online meeting as a disclosed bot participant",
        "bridge media and capture transcript/events under tenant policy",
      ],
      live_dependencies: [
        "Microsoft tenant/admin approval",
        "Graph communications permissions",
        "bot identity: Hal (AI)",
        "controlled Teams meeting",
      ],
    };
  }

  if (platform === "google_meet") {
    return {
      adapter_id: "google-meet-transport",
      likely_lane: "approved meeting-bot provider or browser automation bridge",
      hard_parts: [
        "join Google Meet as a visible AI participant",
        "media bridge reliability",
        "participant consent and transcript policy",
      ],
      live_dependencies: [
        "provider with Google Meet support",
        "host authorization",
        "controlled Google Meet",
      ],
    };
  }

  if (platform === "tavus_daily") {
    return {
      adapter_id: "native-tavus-daily-room",
      likely_lane: "current Tavus conversation URL flow",
      hard_parts: [
        "not an external Zoom/Teams join; participants must use the Tavus/Daily link",
        "meeting invite and room lifecycle still need product handling",
      ],
      live_dependencies: [
        "Tavus API key",
        "Hal Persona ID",
        "approved Replica ID",
        "callback URL",
      ],
    };
  }

  return {
    adapter_id: "unknown-meeting-transport",
    likely_lane: "manual review required",
    hard_parts: [
      "identify platform",
      "verify supported join method",
      "define consent, media, and transcript handling",
    ],
    live_dependencies: ["meeting URL with a supported platform"],
  };
}

export function buildHalMeetingTransportPreview(input: MeetingTransportInput = {}) {
  const runtime = readHalRuntimeConfig();
  const meetingUrl = asText(input.meeting_url, "https://zoom.us/j/123456789");
  const platform = detectMeetingPlatform(meetingUrl, input.meeting_platform);
  const hostAuthorized = asBool(input.host_authorized);
  const visibleDisclosure = asBool(input.visible_ai_disclosure);
  const canUseCurrentBackendDirectly = platform === "tavus_daily";
  const missingApprovals = [
    !hostAuthorized ? "host_authorization" : "",
    !visibleDisclosure ? "visible_ai_disclosure" : "",
    platform === "unknown" ? "supported_meeting_platform" : "",
    !runtime.persona_id_configured ? "HAL_TAVUS_PERSONA_ID" : "",
    !runtime.replica_id_configured ? "HAL_TAVUS_REPLICA_ID" : "",
  ].filter(Boolean);

  return {
    meeting_transport_preview_version: "hal_meeting_transport_sidecar_v1",
    agent_slug: "hal",
    status: "dry_run_transport_plan",
    runtime,
    input_summary: {
      meeting_url_present: Boolean(meetingUrl),
      meeting_url_redacted: meetingUrl ? "provided_not_joined" : "missing",
      detected_platform: platform,
      meeting_title: asText(input.meeting_title, "Untitled meeting"),
      principal: asText(input.principal, "Brian Halligan"),
      deployment_profile: asText(input.deployment_profile, "PUBLIC_DEMO"),
      host_authorized: hostAuthorized,
      visible_ai_disclosure: visibleDisclosure,
    },
    transport_decision: {
      can_join_with_current_backend: canUseCurrentBackendDirectly,
      current_backend_scope:
        "Tavus/Daily conversation creation, context injection, callback transcript handling, and Hermes-style post-session work.",
      missing_backend_layer: canUseCurrentBackendDirectly
        ? null
        : "external meeting transport adapter with media bridge",
      recommended_lane: canUseCurrentBackendDirectly
        ? "native_tavus_daily_room"
        : `${platform}_external_meeting_sidecar`,
      release_claim_allowed: false,
      missing_approvals: missingApprovals,
    },
    adapter_plan: buildAdapterPlan(platform),
    tavus_plug_in: {
      role: "face, voice, persona behavior, retrieval, and real-time response once media/context reaches Tavus",
      payload_inputs: [
        "HAL_TAVUS_PERSONA_ID",
        "HAL_TAVUS_REPLICA_ID",
        "document_tags: hal-public-v0-3",
        "conversational_context: rendered meeting brief",
      ],
      public_memory_default: "disabled",
    },
    hermes_plug_in: {
      role: "meeting brief compiler, source/authority classifier, post-session transcript processor, memory candidate builder, and operator-review queue",
      pre_meeting_jobs: [
        "compile scoped meeting packet",
        "classify public, approved private, or blocked sources",
        "set mandate, allowed actions, and expiry",
      ],
      post_meeting_jobs: [
        "redact transcript",
        "summarize decisions and open questions",
        "create memory candidates only after review",
        "draft follow-ups without sending",
      ],
    },
    sidecar_contract: {
      create_session: "hal.meeting_transport.session.create",
      join_meeting: "hal.meeting_transport.join.request",
      bridge_media: "hal.meeting_transport.media_bridge.start",
      emit_completed: "hal.meeting.completed",
      required_disclosure: "Hal (AI) must be visible as an AI participant and must not impersonate Brian.",
    },
    ...HAL_BOUNDARY_FLAGS,
    ...SIDE_CAR_BOUNDARY_FLAGS,
  };
}
