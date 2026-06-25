# Hal Dani Reference Architecture

Prepared: 2026-06-25

## Repo Inspection

Hal repo:

`C:\AI Fusion Labs\X AGENTS\REPOS\Brian Halligan X Agent`

Current state:

- empty at start of inspection
- not a Git repo at start of inspection
- no app scaffold, package file, tests, source files, or docs were present

Primary Tavus reference:

`C:\AI Fusion Labs\X AGENTS\REPOS\x-agent-website-t`

Current state during inspection:

- Next.js app
- Git branch clean on `main...origin/main`
- treated as read-only

Hermes proof reference:

`C:\AI Fusion Labs\X AGENTS\REPOS\tavus-xlink-hub`

Current state during inspection:

- Python proof/backend repo
- working tree already had many modified/untracked files before this Hal work
- treated as read-only

## Architecture Decision

Start Hal docs-only first, then scaffold the smallest dry-run Tavus-style prototype after review.

Reason:

- the repo is empty and not yet versioned
- Hal has higher consent/identity risk than a normal agent
- positioning, source policy, and action authority must be agreed before code
- the Dani implementation gives a strong pattern, but Hal should not inherit Dani secrets, IDs, assets, or persona assumptions

Product alignment:

- Hal should remain a standard X Agent implementation, not a one-off side project.
- The agent role changes from Dani's sales/product guide to Hal's executive operating partner, but the architecture should stay recognizable: Tavus conversation surface, optional memory/source check-in, hidden `conversational_context`, Hermes-style post-session processing, memory candidates, operator review, and safe follow-up status.
- The latest Dani Tavus/Hermes working-memory path is the prototype to tailor from.

## Dani Website Patterns To Reuse

The latest Dani Tavus implementation in `x-agent-website-t` is the right implementation reference.

### 1. Next.js App Router Surface

Relevant reference files:

- `package.json`
- `app/agents/[slug]/page.tsx`
- `components/AgentDemoButton.tsx`
- `components/TavusPlayer.tsx`
- `components/dani/DaniLiveNotesPanel.tsx`
- `components/dani/DaniPostSessionResults.tsx`

Pattern:

- agent detail page launches an inline Tavus player
- memory check-in can happen before creating a room
- Daily iframe mounts the Tavus conversation URL
- UI shows safe session cues, not raw backend details
- post-session results show pending/confirmed boundaries

Hal adaptation:

- `HalPlayer` or `HalDemoSurface`
- `HalSourceCheckInPanel`
- `HalOperatingBriefPanel`
- `HalPostSessionResults`
- default dry-run mode, no live room creation until approved

### 2. Conversation Start Route

Relevant reference files:

- `app/api/conversation/start/route.ts`
- `lib/tavus.ts`
- `lib/tavusCreateConversationBody.mjs`

Pattern:

- backend route builds callback URL
- optional memory context is resolved before the Tavus call
- Tavus create conversation body includes persona, replica, greeting, callback URL, duration properties, and optional `conversational_context`
- response returns safe identity and memory flags

Hal adaptation:

- start with `/api/hal/conversation/start-preview`
- build the future Tavus payload without calling Tavus
- include `conversational_context` preview only when source gates are open
- no persona ID, replica ID, API key, callback token, or production identifier committed
- when live approved, use env-only config and safe booleans in the response

### 3. Hidden Memory / Context Injection

Relevant reference files:

- `lib/xagent/conversationStartMemoryContext.mjs`
- `lib/xagent/serverSideMemoryContextResolver.mjs`
- `lib/xagent/tavusMemoryPromptPreview.mjs`
- `lib/xagent/sessionMemoryContext.mjs`

Pattern:

- memory injection is gated by explicit env switches and kill switches
- supplied context is validated before Tavus
- server-side lookup can resolve return-code or email identity memory
- hidden context tells the agent what it may use and what it must not claim
- backend identifiers are not exposed inside the spoken prompt

Hal adaptation:

- public-source context is the first hidden context type
- optional returning-user context stays disabled until approved
- context must distinguish public source, approved Brian/Tavus Drive KB source, other explicitly approved private source, synthetic demo data, and blocked source
- hidden context must say Hal is not Brian
- hidden context must forbid claims about private access and completed actions

### 4. Prompt Design And Objective Deconfliction

Relevant reference docs:

- `docs/HERMES_DANI_TAVUS_SYSTEM_PROMPT_T43.md`
- `docs/HERMES_DANI_PROMPT_V2_DESIGN_T50.md`
- `docs/HERMES_DANI_OBJECTIVE_DECONFLICTION_T53.md`

Pattern:

- compact persona prompt outperforms bloated intake scripts
- memory should be quiet context, not repeated demo speech
- one useful question at a time
- Tavus Objectives can conflict with returning-user continuity if they force classification
- Hermes is a backend worker, not the live voice turn controller

Hal adaptation:

- no objective graph in phase one
- prompt should focus on executive operating partner behavior
- Hal must answer identity challenges directly
- no classification-first questions
- no "Brian simulator" objective

### 5. Post-Session Transcript And Memory Handling

Relevant reference files:

- `app/api/webhook/route.ts`
- `lib/xagent/tavusTranscriptionMemoryWebhook.mjs`
- `lib/xagent/sessionCompletedFromTavus.mjs`
- `lib/xagent/hermesEmailMemoryOperator.mjs`
- `lib/xagent/hermesEmailCommunicationsOperator.mjs`
- `lib/xagent/emailMemoryStore.mjs`

Pattern:

- Tavus transcription-ready webhook is gated
- callback token can protect callback processing
- transcript handling returns safe status booleans
- memory storage and email/action planning are separate
- raw email and raw transcript are not shown in UI

Hal adaptation:

- first version should use `/api/hal/session-completed/dry-run`
- only synthetic or approved transcript inputs
- redacted summary candidate, not production memory
- operator review before any memory promotion
- no live webhook registration until approved

### 6. AgentMail / Follow-Up Planning

Relevant reference files:

- `lib/xagent/agentMailAdapterReadiness.mjs`
- `lib/xagent/agentMailSendAdapter.mjs`
- `lib/xagent/hermesEmailCommunicationsOperator.mjs`
- `lib/xagent/hermesEmailActionStatusStore.mjs`

Pattern:

- adapter readiness exposes safe booleans only
- send mode is preview or live
- live send requires gates, config, ledger, and narrow approval
- action claim is allowed only after confirmed send

Hal adaptation:

- first follow-up output is a draft packet only
- no live AgentMail, Resend, calendar, or CRM
- action status labels: `draft_prepared`, `pending_review`, `sent_confirmed`
- Hal can state only the status that the app confirms

## Hermes Proof Concepts To Reuse

Use `tavus-xlink-hub` only for backend proof concepts, not as the Hal app model.

### 1. Post-Session Bridge Contract

Relevant reference:

- `docs/HERMES_TAVUS_POST_SESSION_BRIDGE_CONTRACT.md`
- `tavus_xlink_hub/hermes_tavus_post_session_bridge.py`

Reusable concept:

- normalize a completed Tavus-shaped session event
- validate agent, visitor, session, transcript, and idempotency
- produce local proof artifacts
- prove no live Tavus, live Hermes, outbound workflow, or production memory mutation occurred

Hal adaptation:

- `hal_session_completed_bridge_v1`
- public/source-policy metadata included
- Brian-identity boundary included
- no live bridge until approved

### 2. Redacted Transcript Artifact

Relevant reference:

- `docs/HERMES_XAGENT_REDACTED_TRANSCRIPT_ARTIFACT_PROOF.md`
- `tavus_xlink_hub/hermes_xagent_redacted_transcript.py`

Reusable concept:

- raw transcript is not the memory artifact
- retain only memory-safe user/agent turns
- reject sensitive text patterns
- tie provenance to hashes
- keep raw Tavus payload out of artifacts

Hal adaptation:

- redact private Brian or stakeholder data aggressively
- block source records that imply private access
- store only summary candidates until review

### 3. Memory Candidate, Promotion, Recall

Relevant references:

- `tavus_xlink_hub/hermes_xagent_memory_candidate.py`
- `tavus_xlink_hub/hermes_xagent_memory_promotion_preview.py`
- `tavus_xlink_hub/hermes_xagent_memory_recall_preview.py`
- `docs/HERMES_XAGENT_MEMORY_PROMOTION_PREVIEW.md`
- `docs/HERMES_XAGENT_MEMORY_RECALL_PREVIEW.md`

Reusable concept:

- candidate is not persisted memory
- promotion preview is not approval
- recall preview is read-only
- allowed and forbidden use travel with memory context
- outbound claims are forbidden in memory summaries

Hal adaptation:

- memory candidate status defaults to `pending_operator_review`
- promotion gates default closed
- recall context must not become Brian impersonation
- public-source records and session-memory records stay separate

### 4. Operator Review

Relevant reference:

- `docs/HERMES_TAVUS_OPERATOR_REVIEW_PACKET.md`
- `tavus_xlink_hub/hermes_operator_review.py`

Reusable concept:

- a human-readable review packet explains what can be used next time
- forbidden claims are explicit
- recommended decisions are bounded
- boundary proof shows no live or outbound actions

Hal adaptation:

- operator review must include identity/consent flags
- decisions: `approve_for_public_demo_context`, `hold_for_brian_or_tavus_review`, `reject_due_to_identity_or_source_scope`

## Smallest Safe Hal Scaffold

After doc review, scaffold:

```text
app/
  page.tsx
  api/
    hal/
      conversation/
        start-preview/route.ts
      context/
        preview/route.ts
      session-completed/
        dry-run/route.ts
components/
  HalDemoSurface.tsx
  HalSourceCheckInPanel.tsx
  HalOperatingBriefPanel.tsx
  HalPostSessionResults.tsx
lib/
  hal/
    sourceManifest.ts
    halContextPreview.mjs
    halConversationStartPreview.mjs
    halSessionCompletedDryRun.mjs
    halOperatorReview.mjs
tests/
  hal-source-manifest.test.mjs
  hal-context-preview.test.mjs
  hal-conversation-start-preview.test.mjs
  hal-session-completed-dry-run.test.mjs
```

Build constraints:

- no env values committed
- no live Tavus call
- no live Hermes call
- no OpenAI call
- no AgentMail or Resend call
- no Calendly or calendar call
- no production persistence
- no raw Google Drive KB text injected into Tavus context without source review
- all route outputs include boundary booleans

## Validation Ladder For Future Scaffold

1. Static docs/source check.
2. Unit tests for source manifest and prompt boundaries.
3. Dry-run payload tests confirming no live-service calls.
4. UI smoke test for memory/source check-in and post-session pending states.
5. Manual prompt test for "Are you Brian?"
6. Manual prompt test for "Send the email."
7. Manual prompt test for "What private files do you have?"
8. Only then consider a gated Tavus test-mode path.

## Final Recommendation

Do not scaffold from Dani wholesale.

Scaffold a small Hal-specific Next.js prototype that copies Dani's proven architectural patterns:

- gated start route
- hidden context preview
- safe status flags
- memory check-in pattern
- post-session results
- operator-review boundary

Do not copy Dani:

- persona
- assets
- env names with production values
- AgentMail inbox identifiers
- proof artifacts
- live route behavior
- production memory assumptions
