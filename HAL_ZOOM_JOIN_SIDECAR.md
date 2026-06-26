# Hal Zoom Join Sidecar

Status: dry-run join planner and Meeting SDK JWT gate
Date: 2026-06-25

## Plain-English Goal

This sidecar is the next step after proving Hal can create a Zoom meeting.

Creating a meeting uses Zoom's REST API. Joining a meeting as `Hal (AI)` requires Zoom Meeting SDK authorization and a client that can enter the meeting. This file defines the join lane without pretending the live media bridge is done.

## What We Have Proven

- Zoom Server-to-Server OAuth works.
- Hal can create a real Zoom meeting.
- The app can receive a safe meeting receipt.
- No invites, Tavus calls, Hermes calls, or memory writes are required for that proof.

## What This Adds

This sidecar adds:

- a join-readiness preview;
- a Meeting SDK JWT generator;
- explicit gates before returning any SDK JWT;
- a clean handoff shape for a future Zoom Meeting SDK web/native client.

It still does not join a meeting by itself.

## Zoom Requirement

Zoom's Meeting SDK docs say a Meeting SDK JWT is required to start or join a Zoom meeting through the SDK. The JWT is signed server-side with Meeting SDK app credentials.

For meetings inside the app owner's account, Zoom's docs say the app can join as a participant or non-login user using only the Meeting SDK JWT. For meetings outside the developer account, Zoom requires review and user-attributed authorization such as ZAK or OBF.

## Required Env

These credentials may be the same app credentials only if the Zoom app has Meeting SDK enabled. Keep them separate in env until proven:

```text
HAL_ZOOM_JOIN_MODE=dry-run
HAL_ZOOM_MEETING_SDK_ENABLED=false
HAL_ZOOM_MEETING_SDK_KILL_SWITCH=true
HAL_ZOOM_RETURN_SDK_JWT=false
ZOOM_MEETING_SDK_CLIENT_ID=
ZOOM_MEETING_SDK_CLIENT_SECRET=
```

Live join testing later should flip only the join gate:

```text
HAL_ZOOM_JOIN_MODE=live
HAL_ZOOM_MEETING_SDK_ENABLED=true
HAL_ZOOM_MEETING_SDK_KILL_SWITCH=false
```

Do not return the SDK JWT to ordinary API callers. The web Meeting SDK client will eventually need it, but the API should return it only to the trusted local join page or during an explicit controlled test.

## Routes

Dry-run join readiness:

```text
POST /api/hal/zoom/meeting/join-preview
```

SDK JWT gate:

```text
POST /api/hal/zoom/meeting/sdk-jwt
```

The JWT route does not call Zoom. It signs a JWT locally. By default it returns only safe booleans, not the JWT value.

To return the actual SDK JWT for a controlled local test:

```json
{
  "meeting_number": "123456789",
  "role": 0,
  "confirm_return_sdk_jwt": "RETURN_ZOOM_SDK_JWT"
}
```

and env must include:

```text
HAL_ZOOM_RETURN_SDK_JWT=true
```

## Join Handoff Shape

The future Zoom client needs:

- Meeting SDK Client ID as `sdkKey` or `appKey`, depending SDK version;
- Meeting SDK JWT from the backend;
- meeting number;
- meeting password if present;
- display name: `Hal (AI)`;
- role: `0` for participant;
- a visible disclosure script;
- media bridge plan for Tavus voice/video.

The local join client is:

```text
http://127.0.0.1:3001/zoom/join
```

For a controlled local join attempt, temporarily set:

```text
HAL_ZOOM_RETURN_SDK_JWT=true
```

Then enter a test meeting number and passcode on the local page. Turn the flag back to `false` after the test.

## What Still Remains

After the SDK JWT is generated, the next implementation step is a Zoom Meeting SDK client page or native worker that:

- joins the meeting as `Hal (AI)`;
- handles the waiting room and failed joins;
- captures live audio events or integrates with RTMS;
- routes input to Tavus or an approved Hal realtime layer;
- plays Hal's response into Zoom;
- records only approved transcript artifacts;
- hands post-session processing to Hermes.

## Sources

- Zoom Meeting SDK authorization: https://developers.zoom.us/docs/meeting-sdk/auth/
- Zoom Meeting SDK credentials: https://developers.zoom.us/docs/meeting-sdk/get-credentials/
- Zoom Realtime Media Streams: https://developers.zoom.us/docs/rtms/
