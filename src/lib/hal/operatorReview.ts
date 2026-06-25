import { HAL_BOUNDARY_FLAGS } from "./runtime";

export function buildHalOperatorReview(input: Record<string, unknown> = {}) {
  const sourceMode =
    typeof input.source_mode === "string" && input.source_mode.trim()
      ? input.source_mode.trim()
      : "public_plus_approved_kb_pending";

  return {
    operator_review_version: "hal_operator_review_v1",
    agent_slug: "hal",
    source_mode: sourceMode,
    recommended_operator_decision: "approve_for_dry_run_next_session_context",
    identity_review: {
      brian_impersonation_risk: "controlled_by_prompt_and_visual_direction",
      brian_likeness_approved: false,
      neutral_synthetic_persona_required: true,
    },
    source_review: {
      public_sources_ready: true,
      drive_kb_received: false,
      drive_kb_inventory_required_before_use: true,
    },
    forbidden_claims: [
      "Hal is Brian",
      "Brian approved this",
      "Hal has unrestricted Google Drive access",
      "email or calendar actions completed without app confirmation",
    ],
    next_step: "wire dry-run UI to Tavus env placeholders; wait for persona ID before live call path",
    ...HAL_BOUNDARY_FLAGS,
  };
}
