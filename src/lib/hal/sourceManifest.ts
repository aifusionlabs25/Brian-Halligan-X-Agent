export const HAL_SOURCE_POLICY = {
  source_policy_version: "hal_source_policy_v1",
  default_source_mode: "public_plus_approved_kb_pending",
  allowed_sources: [
    "public Brian Halligan post and public professional context",
    "Tavus public Knowledge Navigator / Dom context",
    "Brian/Tavus-shared Google Drive KB after source inventory",
    "synthetic demo scenarios labeled synthetic",
    "explicitly approved operator-provided material",
  ],
  blocked_sources: [
    "unapproved private Drive files",
    "private email",
    "private calendar",
    "private messages",
    "private contacts",
    "voice or likeness assets without explicit approval",
  ],
  drive_kb_status: "pending_not_received",
  drive_kb_first_step: "inventory_and_classify_before_context_injection",
} as const;

export const HAL_REFERENCE_SOURCES = [
  {
    title: "Brian Halligan Hal X post",
    url: "https://x.com/bhalligan/status/2069857238500741310",
    status: "public",
  },
  {
    title: "Brian Halligan Hal video transcript",
    url: "https://x.com/bhalligan/status/2069857238500741310/video/1",
    status: "operator_supplied_transcript",
  },
  {
    title: "Tavus Knowledge Navigator / Dom post",
    url: "https://www.tavus.io/blog/40-years-later-fulfilling-knowledge-navigators-promises",
    status: "public",
  },
  {
    title: "Brian/Tavus Google Drive KB",
    url: "pending",
    status: "pending_not_received",
  },
] as const;
