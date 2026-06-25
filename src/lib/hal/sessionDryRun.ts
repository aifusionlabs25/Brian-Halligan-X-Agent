import { HAL_BOUNDARY_FLAGS } from "./runtime";
import { HAL_TRANSCRIPT_ANALYSIS } from "./transcriptAnalysis";

export function buildHalSessionCompletedDryRun(input: Record<string, unknown> = {}) {
  const scenario =
    typeof input.demo_scenario === "string" && input.demo_scenario.trim()
      ? input.demo_scenario.trim()
      : "hal_video_persona_review";

  return {
    session_completed_dry_run_version: "hal_session_completed_dry_run_v1",
    agent_slug: "hal",
    scenario,
    transcript_source: "operator_supplied_public_x_video_transcript",
    redacted_transcript_artifact_created: true,
    raw_transcript_stored: false,
    persona_analysis: HAL_TRANSCRIPT_ANALYSIS,
    memory_candidate: {
      status: "pending_operator_review",
      memory_type: "persona_and_prompt_guidance",
      approved_for_memory_store: false,
      memory_updated: false,
      summary:
        "Hal should retain the current video's concise memory-backed chief-of-staff behavior while reducing clone/identity confusion and adding source/action boundaries.",
    },
    follow_up_packet: {
      status: "draft_prepared_pending_review",
      send_attempted: false,
      sent_confirmed: false,
    },
    ...HAL_BOUNDARY_FLAGS,
  };
}
