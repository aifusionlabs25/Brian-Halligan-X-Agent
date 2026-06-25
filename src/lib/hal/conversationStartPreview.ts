import { buildHalContextPreview } from "./contextPreview";
import { HAL_BOUNDARY_FLAGS, readHalRuntimeConfig } from "./runtime";

export function buildHalConversationStartPreview(input: Record<string, unknown> = {}) {
  const runtime = readHalRuntimeConfig();
  const context = buildHalContextPreview(input);

  return {
    conversation_start_preview_version: "hal_tavus_start_preview_v1",
    agent_slug: "hal",
    provider: "tavus",
    runtime,
    replica_id_configured: runtime.replica_id_configured,
    persona_id_configured: runtime.persona_id_configured,
    tavus_payload_preview: {
      replica_id: runtime.replica_id_configured ? "env:HAL_TAVUS_REPLICA_ID" : null,
      persona_id: runtime.persona_id_configured ? "env:HAL_TAVUS_PERSONA_ID" : null,
      custom_greeting:
        "I am Hal, an AI operating partner interface. What should we prepare or pressure-test first?",
      conversational_context: context.candidate_tavus_conversational_context,
      properties: {
        max_call_duration: 900,
        participant_absent_timeout: 120,
        participant_left_timeout: 60,
      },
    },
    callback_url_preview: "/api/hal/webhook/pending-not-registered",
    ...HAL_BOUNDARY_FLAGS,
  };
}
