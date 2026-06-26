# Brian Halligan X Agent

Hal is a Tavus-style X Agent prototype for an executive operating partner interface inspired by Brian Halligan's public Hal post.

This repo is dry-run first. The current app does not call Tavus, Hermes, OpenAI, AgentMail, Resend, Calendly, CRM, calendar, Google Drive, or outbound services.

## Local Setup

```powershell
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Env

Copy `.env.example` to `.env.local`.

```text
HAL_TAVUS_RUNTIME_MODE=dry-run
HAL_TAVUS_REPLICA_ID=<from Tavus>
HAL_TAVUS_PERSONA_ID=<from Tavus>
```

Do not commit live API keys, callback tokens, persona secrets, or private KB links.

## Dry-Run Routes

- `POST /api/hal/conversation/start-preview`
- `POST /api/hal/context/preview`
- `POST /api/hal/meeting-transport/preview`
- `POST /api/hal/zoom/meeting/create-preview`
- `POST /api/hal/zoom/meeting/create-live`
- `POST /api/hal/zoom/meeting/join-preview`
- `POST /api/hal/zoom/meeting/sdk-jwt`
- `POST /api/hal/session-completed/dry-run`
- `POST /api/hal/operator-review/dry-run`

All routes are designed to return safe boundary booleans:

- `live_tavus_called=false`
- `live_hermes_called=false`
- `outbound_action_taken=false`
- `production_database_mutated=false`
- `action_claim_allowed=false`

## Meeting Transport Sidecar

`HAL_MEETING_TRANSPORT_SIDECAR.md` defines the side project for Zoom/Teams meeting join. The current route is a dry-run planner only; it detects the meeting platform, returns the required adapter lane, and proves no external meeting bot or media bridge was called.

`HAL_ZOOM_MEETING_CREATE_SIDECAR.md` defines the easier scheduling lane. The preview route builds the Zoom create-meeting request without calling Zoom. The live route is blocked unless Zoom Server-to-Server OAuth credentials, live env gates, host authorization, and the `CREATE_ZOOM_MEETING` confirmation phrase are all present.

`HAL_ZOOM_JOIN_SIDECAR.md` defines the next join lane. The preview route explains whether Zoom Meeting SDK credentials are ready. The SDK JWT route signs a local Meeting SDK JWT only when join gates are open; it does not join a meeting by itself.

Local Zoom join test page:

```text
http://127.0.0.1:3001/zoom/join
```

Keep `HAL_ZOOM_RETURN_SDK_JWT=false` except during a controlled local SDK join test.

## Validation

```powershell
npm run test
npm run lint
npm run typecheck
npm run build
```

## Reference Docs

- `HAL_PRODUCT_BRIEF.md`
- `HAL_PUBLIC_KNOWLEDGE_MANIFEST.md`
- `HAL_SYSTEM_PROMPT_DRAFT.md`
- `HAL_VIDEO_TRANSCRIPT_ANALYSIS.md`
- `HAL_DANI_REFERENCE_ARCHITECTURE.md`
