# Hal Public Knowledge Manifest

Prepared: 2026-06-25

## Purpose

This manifest defines what Hal may know in phase one, what requires explicit approval, and what must stay out of the prototype.

The goal is to make Hal credible without crossing consent, identity, privacy, or source-rights lines.

## Source Policy

Hal may use:

- public web pages
- public posts
- public interviews, podcasts, articles, talks, and company bios
- books or copyrighted works only as high-level summarized knowledge, not copied text
- materials explicitly provided by Brian, Tavus, Sequoia, AI Fusion Labs, or another authorized operator
- Brian/Tavus-provided Google Drive KB links when the link is intentionally shared for Hal and the approved use is recorded
- synthetic scenarios labeled as synthetic

Hal may not use:

- unapproved private Google Drive files or Drive folders obtained outside the explicit Hal share
- private emails
- private calendar events
- private Slack, text, WhatsApp, or DM content
- private meeting transcripts
- private voice or likeness material
- paid/private course materials
- scraped personal data
- confidential investor, founder, student, or customer information
- anything presented as "Brian memory" without explicit provenance

## Current Approved Sources

| Source | Status | Use |
| --- | --- | --- |
| Brian Halligan X post, `https://x.com/bhalligan/status/2069857238500741310` | Public source, X page checked but limited page text rendered | Inspiration and source link only |
| Digg mirror of the Hal post, `https://digg.com/tech/zj325m6i` | Public mirror checked | Paraphrase public Hal claims and timing |
| MIT Sloan Brian P. Halligan profile, `https://mitsloan.mit.edu/faculty/directory/brian-p-halligan` | Public institutional bio checked | Public bio context |
| Tavus Knowledge Navigator / Dom blog, `https://www.tavus.io/blog/40-years-later-fulfilling-knowledge-navigators-promises` | Public Tavus blog checked | Tavus interface thesis and human-computing context |
| User-provided outreach note to Hassaan | Explicitly provided in this repo task | Outreach packet context |
| Brian/Tavus-shared Google Drive KB link | Pending, not yet received or verified | May become an explicitly approved KB source after owner, access, scope, retention, and allowed use are confirmed |
| Dani Tavus website repo, `C:\AI Fusion Labs\X AGENTS\REPOS\x-agent-website-t` | Local read-only architecture reference | Patterns only, no secrets or production IDs |
| Tavus Hermes proof repo, `C:\AI Fusion Labs\X AGENTS\REPOS\tavus-xlink-hub` | Local read-only backend concept reference | Proof concepts only, no runtime promotion |

## Public Brian Background Allowed For Phase One

Allowed public background, subject to source citation:

- Brian Halligan is associated publicly with HubSpot, MIT Sloan, Sequoia, and Propeller Ventures.
- MIT Sloan lists him as a Senior Lecturer in Technological Innovation, Entrepreneurship, and Strategic Management.
- MIT Sloan lists him as chairperson and cofounder of HubSpot, a senior advisor at Sequoia Capital, and cofounder of Propeller Ventures.
- MIT Sloan lists his authorship of `Inbound Marketing` and `Marketing Lessons From the Grateful Dead`.

Do not turn this into personal memory. Treat it as public professional context.

## Hal Post Public Claims: Safe Interpretation

The public post/mirror describes Hal as an AI agent / second brain that can organize work and is moving toward autopilot. That is a public signal, not a license.

Safe interpretation:

- Brian is exploring a personal executive AI agent.
- The concept is moving from assistance toward supervised autonomous work.
- The public thread has interest around meetings, teaching, coaching, memory, cost, and interface.

Unsafe interpretation:

- Hal is Brian.
- Brian has approved this prototype.
- Hal may ingest Brian's private life.
- Hal may speak in Brian's voice.
- Hal may join real meetings or send real emails.

## Data Classes

### Class A: Public Source

Public web material. Allowed for phase-one summaries with citation.

Examples:

- public X post
- MIT Sloan bio
- public Tavus blog
- public interviews

### Class B: Explicitly Approved Private Source

Private material provided with a clear authorization note.

Examples:

- a Brian/Tavus-shared Google Drive KB link for Hal
- private briefing docs explicitly provided for this prototype
- approved meeting notes or transcripts shared for a defined use

Required metadata:

- source owner
- approval date
- approved use
- retention rule
- whether it can be used in live Tavus context
- whether it can be stored as memory

### Class C: Synthetic Demo Source

Fabricated scenario data used for demos.

Required metadata:

- label as synthetic
- no real personal data
- no implied Brian approval

### Class D: Blocked Source

Never ingest or imply access in phase one.

Examples:

- Brian's private files outside the approved Hal KB share
- real calendar
- real email
- real contacts
- private meetings
- voice/likeness training assets

## Knowledge Record Shape

Every future source record should include:

```json
{
  "source_id": "hal_public_source_001",
  "title": "Source title",
  "url": "https://example.com",
  "source_class": "public",
  "approved_by": "public",
  "approved_at": "2026-06-25",
  "allowed_use": ["summarize", "quote_short_excerpts", "reason_from"],
  "forbidden_use": ["impersonate_brian", "claim_private_access"],
  "retention": "manifest_only_until_approved",
  "notes": "No private data."
}
```

## Brian-Provided Google Drive KB Handling

If Brian or Tavus shares a large Google Drive KB link, treat it as an explicitly approved source only after access and use are confirmed.

Required first step:

- create a source inventory before summarizing or injecting content
- record the share source, approval date, owner, and allowed use
- separate public, approved private, synthetic, and blocked files
- flag files that look like email exports, calendar data, personal contacts, confidential third-party material, financial records, legal docs, student/founder private notes, or credentials
- do not put raw Drive file text directly into Tavus `conversational_context`
- do not create persistent memory from the KB without operator review

Safe language:

- "approved Brian-provided knowledge base"
- "approved Hal KB corpus"
- "source-limited Brian context"

Unsafe language:

- "Brian's entire life"
- "all of Brian's private Drive"
- "everything Brian knows"
- "private omniscience"

## Memory Policy

Phase one may create memory candidates only from synthetic or explicitly approved session summaries.

Memory candidate rules:

- no raw transcript storage by default
- redact contact, payment, auth, and private identifiers
- summarize only approved facts and preferences
- mark every memory candidate `pending_operator_review`
- do not promote to persistent memory without separate approval
- do not inject memory into Tavus unless the context is approved and the route is explicitly enabled

## Likeness And Voice Policy

Do not create, request, or imply a Brian Halligan Tavus replica in phase one.

The first Tavus-facing prototype should use one of:

- a neutral executive operating partner avatar
- a clearly synthetic Hal interface
- a Tavus-provided non-Brian persona
- no avatar, only dry-run payload previews

Any Brian likeness, voice, or custom replica requires explicit written approval from Brian or an authorized representative.

## Action Authority Policy

Hal can prepare and route. Hal cannot claim completion until a trusted tool confirms completion.

Allowed language:

- "I can draft that for review."
- "I can prepare a handoff packet."
- "This should go back to Brian."
- "A connected system could send this once approved."

Forbidden language unless tool-confirmed:

- "I sent the email."
- "I booked the meeting."
- "I updated the CRM."
- "I handled that for Brian."
- "Brian approved this."

## Manifest Review Checklist

Before any source is added:

- Is it public or explicitly approved?
- If it is a Drive link, was it intentionally shared for Hal rather than discovered through incidental access?
- Is the source owner clear?
- Is the permitted use clear?
- Could it cause identity confusion?
- Could it reveal private or confidential information?
- Would a reviewer be comfortable showing the source to Brian?
- Is it safe to inject into hidden Tavus context?
