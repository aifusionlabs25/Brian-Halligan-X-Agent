# Hal Zoom Meeting Create Sidecar

Status: dry-run adapter with live gate
Date: 2026-06-25

## Plain-English Goal

This sidecar lets Hal start a Zoom meeting in a controlled way.

Starting a Zoom meeting means:

- create or schedule the Zoom meeting through an authorized Zoom account;
- get a join link;
- optionally draft or send an invite later;
- prepare Hal's meeting brief and Tavus context;
- preserve an audit receipt.

This is easier than having Hal join an existing Zoom call as a live AI participant. Creating the link uses Zoom's normal API. Joining as a live participant still requires the meeting-transport/media bridge sidecar.

## What This Sidecar Can Safely Claim Today

Safe:

> Hal has a Zoom meeting-create adapter in dry run. It can produce the exact Zoom API plan and request body without calling Zoom.

Unsafe until a gated live test passes:

> Hal created the Zoom meeting.

The live claim is allowed only when Zoom returns a successful create-meeting response for the exact request.

## Zoom API Shape

The intended auth lane is Zoom Server-to-Server OAuth for a test/account-owned integration.

Required credentials, stored only in `.env.local` or deployment secrets:

```text
ZOOM_ACCOUNT_ID=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_USER_ID=me
```

Live gates:

```text
HAL_ZOOM_MEETING_CREATE_MODE=dry-run
HAL_ZOOM_LIVE_CREATE_ENABLED=false
HAL_ZOOM_LIVE_CREATE_KILL_SWITCH=true
HAL_ZOOM_RETURN_JOIN_URL=false
```

To run a controlled live local test later, the mode must be changed intentionally:

```text
HAL_ZOOM_MEETING_CREATE_MODE=live
HAL_ZOOM_LIVE_CREATE_ENABLED=true
HAL_ZOOM_LIVE_CREATE_KILL_SWITCH=false
```

The live route also requires this request field:

```json
{
  "confirm_live_zoom_create": "CREATE_ZOOM_MEETING"
}
```

## Local Routes

Dry-run preview:

```text
POST /api/hal/zoom/meeting/create-preview
```

Live-gated create:

```text
POST /api/hal/zoom/meeting/create-live
```

The preview route never calls Zoom. The live route refuses unless all gates, credentials, and the confirmation phrase are present.

## Real-World Flow

1. User asks Hal to schedule a Zoom.
2. Hermes checks authority, recipients, timing, and whether sending is allowed.
3. Hal drafts the Zoom create request.
4. If approved, the app calls Zoom.
5. Zoom returns a meeting receipt.
6. Hal may say the meeting was created only after that receipt.
7. Invite sending stays separate unless an email/calendar tool returns its own success receipt.
8. If Hal should attend the meeting, the meeting-transport sidecar still needs to join and bridge media.

## What This Does Not Solve

This sidecar does not:

- join the Zoom meeting as Hal;
- stream Tavus face/video into Zoom;
- listen to meeting audio;
- send calendar invites;
- email participants;
- store production memory;
- claim Brian approved or attended anything.

Those remain separate adapter and governance lanes.

## Official References

- Zoom API base and auth: https://developers.zoom.us/docs/api/
- Zoom OAuth Server-to-Server flow: https://developers.zoom.us/docs/integrations/oauth/
