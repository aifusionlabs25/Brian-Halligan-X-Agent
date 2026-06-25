export const HAL_BOUNDARY_FLAGS = {
  dry_run_only: true,
  preview_only: true,
  live_tavus_called: false,
  tavus_create_conversation_called: false,
  live_hermes_called: false,
  openai_called: false,
  agentmail_called: false,
  resend_called: false,
  calendly_called: false,
  outbound_action_taken: false,
  production_database_mutated: false,
  production_memory_database_mutated: false,
  action_claim_allowed: false,
} as const;

function env(key: string) {
  return process.env[key]?.replace(/^\uFEFF/, "").trim() ?? "";
}

export function readHalRuntimeConfig() {
  const replicaId = env("HAL_TAVUS_REPLICA_ID");
  const personaId = env("HAL_TAVUS_PERSONA_ID");
  return {
    tavus_runtime_mode: env("HAL_TAVUS_RUNTIME_MODE") || "dry-run",
    replica_id_configured: Boolean(replicaId),
    persona_id_configured: Boolean(personaId),
    missing_env: [
      !replicaId ? "HAL_TAVUS_REPLICA_ID" : "",
      !personaId ? "HAL_TAVUS_PERSONA_ID" : "",
    ].filter(Boolean),
  };
}

export async function readOptionalJsonBody(request: Request) {
  const text = await request.text();
  if (!text.trim()) return {};
  return JSON.parse(text) as Record<string, unknown>;
}
