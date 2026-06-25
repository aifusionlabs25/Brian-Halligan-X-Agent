# Hal Product Brief

Prepared: 2026-06-25

## Working Name

Hal

## One-Line Positioning

Hal is a consent-safe executive-autopilot interface inspired by Brian Halligan's public Hal post: an AI operating partner that can reason from approved knowledge, prepare work, and know when to hand back to Brian.

## What Hal Is

Hal is not Brian Halligan, not a Brian replica, and not a system that speaks as Brian.

Hal is an AI operating partner concept for the executive workflow Brian described publicly: a face-to-face operating layer that can help triage, prepare, summarize, route, and coordinate work from public or explicitly approved materials. If Brian or an authorized operator shares a Google Drive knowledge-base link for this project, that should be treated as an approved KB corpus with explicit scope, not as open-ended private Drive access. The first prototype should demonstrate the interface and trust model, not claim production autonomy.

Hal should still be built like the other X Agents: a Tavus-backed X Agent experience tailored to Hal's executive-autopilot job, using the latest Dani Tavus/Hermes working-memory prototype as the current architectural reference.

## Why This Moment Matters

Brian's public Hal post put a clear executive-agent wedge into the market: the next step is not another chat sidebar, but an operating partner that starts moving from copilot toward autopilot. Tavus is a strong fit because the trust interface is face-to-face, real-time, and context-rich rather than a generic chat window.

The safe opportunity is to show Hal as:

- a trusted executive interface, not an impersonation stunt
- a public-source-safe prototype, not a trained-on-private-life clone
- a Tavus-backed operating surface, not a static avatar demo
- a handoff-aware agent that can say "this needs Brian" before making a false claim

## Non-Negotiable Boundaries

- Do not present Hal as Brian Halligan.
- Do not use Brian's voice, likeness, private calendar, private files, private email, private messages, or private memory unless Brian or an authorized operator explicitly approves that use.
- Do not claim Hal sent an email, booked a meeting, updated a CRM, changed a calendar, paid a bill, or completed a workflow unless the application has confirmed that result.
- Do not claim private training on Brian's "entire life" or unrestricted Google Drive data. If Brian shares a Drive KB for Hal, ingest it only through the approved-source manifest and describe it as an approved KB, not as private omniscience.
- Do not use X-LINK / Anam.ai hub architecture as the implementation model for this project.
- Keep live Tavus, Hermes, OpenAI, AgentMail, Resend, Calendly, CRM, calendar, and outbound workflows disabled until a separate approval step.

## First-Phase Goal

Build a credible foundation that could be shown to Tavus, Rohan, Hassaan, Brian, or Sequoia without feeling like a gimmick.

The first phase should prove:

- Hal's consent-safe identity and scope
- the approved public knowledge manifest
- the Tavus-style conversation-start pattern to reuse later
- the hidden context / returning-user memory pattern to adapt later
- the post-session transcript, memory-candidate, and operator-review model
- the handoff rules that keep Hal from overclaiming completed actions

## Audience

Primary audience:

- Tavus team
- Brian Halligan / Hal stakeholders
- AI Fusion Labs operator team
- Sequoia or executive-agent stakeholders

Secondary audience:

- founders evaluating executive autopilot agents
- teams exploring face-to-face AI operating partners

## Product Principles

1. Consent before fidelity.
2. Provenance before personality.
3. Prepare before acting.
4. Handoff before overclaiming.
5. Face-to-face trust, but no identity confusion.
6. Public-source by default; private-source only with explicit approval.
7. Autopilot means supervised operating leverage, not unsupervised authority.

Visual direction lives in [HAL_VISUAL_DIRECTION_SIDEBAR.md](HAL_VISUAL_DIRECTION_SIDEBAR.md). The default Hal look should be a neutral synthetic executive operating partner, not Brian's likeness.

## Initial Capability Envelope

Allowed in phase one:

- summarize approved public sources
- index or summarize a Brian/Tavus-provided Google Drive KB after the share, source owner, allowed use, and retention scope are confirmed
- explain what Hal could do when connected to approved systems
- draft executive briefs, meeting-prep notes, follow-up drafts, and decision packets
- demonstrate hidden context injection with synthetic or approved sample data
- demonstrate post-session operator-review artifacts in dry-run form
- route action requests into "pending review" states

Not allowed in phase one:

- live Tavus room creation
- live Hermes execution
- live outbound email, scheduling, CRM, or calendar work
- private-data ingestion
- persistent production memory
- Brian likeness, voice clone, or replica claims
- direct statements that Hal is Brian or speaks for Brian

## Public Source Snapshot

The originating signal is Brian Halligan's public X post at:

https://x.com/bhalligan/status/2069857238500741310

X rendered limited page text in this environment, so the current foundation also checked the public Digg mirror:

https://digg.com/tech/zj325m6i

That mirror describes Hal as Brian's AI agent / second brain and says the project is moving toward autopilot. It also shows the post date as June 24, 2026. The prototype should use that as inspiration only, not as permission to mirror Brian's identity or ingest private data.

Useful Tavus context:

https://www.tavus.io/blog/40-years-later-fulfilling-knowledge-navigators-promises

Useful Brian public bio context:

https://mitsloan.mit.edu/faculty/directory/brian-p-halligan

## Recommended First Build Decision

Start docs-only first. The Hal repo is empty and not yet a Git repo. Scaffolding a Next.js/Tavus app before the safety and positioning are agreed would create surface area without increasing trust.

After these docs are reviewed, the smallest safe scaffold should be a dry-run Next.js prototype modeled on the Dani Tavus website architecture:

- one Hal landing/demo page
- a memory/source check-in panel
- a dry-run `/api/conversation/start-preview` route that builds the future Tavus payload without calling Tavus
- a dry-run hidden-context preview route
- a post-session results mock showing pending / routed / confirmed boundaries
- no secrets, no live calls, no production persistence

## Success Criteria For Phase One

- A reviewer can describe Hal in one sentence without confusing it for Brian.
- The approved source policy is obvious.
- The prompt draft blocks impersonation and false action claims.
- The demo flow feels executive-grade, not novelty-grade.
- The architecture clearly follows the Tavus-specific Dani path, not X-LINK / Anam.
- Every live-service boundary is closed until separately approved.
