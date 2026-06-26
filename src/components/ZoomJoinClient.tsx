"use client";

import Script from "next/script";
import { useMemo, useRef, useState } from "react";

type SdkJwtResponse = {
  status?: string;
  sdk_client_id?: string;
  sdk_jwt?: string;
  zoom_meeting_sdk_jwt_generated?: boolean;
  zoom_meeting_sdk_jwt_returned?: boolean;
  blocked_reasons?: string[];
  error?: string;
};

type ZoomEmbeddedClient = {
  init(options: {
    zoomAppRoot: HTMLElement;
    language: string;
    patchJsMedia?: boolean;
  }): Promise<unknown>;
  join(options: {
    sdkKey: string;
    signature: string;
    meetingNumber: string;
    password?: string;
    userName: string;
  }): Promise<unknown>;
};

declare global {
  interface Window {
    ZoomMtgEmbedded?: {
      createClient(): ZoomEmbeddedClient;
    };
  }
}

const defaultUserName = "Hal (AI)";

export function ZoomJoinClient() {
  const sdkRootRef = useRef<HTMLDivElement | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [meetingNumber, setMeetingNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState(defaultUserName);
  const [returnJwtConfirmed, setReturnJwtConfirmed] = useState(false);
  const [status, setStatus] = useState("Waiting for a meeting number.");
  const [result, setResult] = useState<SdkJwtResponse | null>(null);
  const [joining, setJoining] = useState(false);

  const canAttemptJoin = useMemo(
    () => sdkLoaded && meetingNumber.trim() && returnJwtConfirmed && !joining,
    [sdkLoaded, meetingNumber, returnJwtConfirmed, joining],
  );

  async function requestSdkJwt() {
    const response = await fetch("/api/hal/zoom/meeting/sdk-jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meeting_number: meetingNumber.trim(),
        role: 0,
        confirm_return_sdk_jwt: returnJwtConfirmed ? "RETURN_ZOOM_SDK_JWT" : "",
      }),
    });
    const json = (await response.json()) as SdkJwtResponse;
    setResult(json);
    return json;
  }

  async function joinMeeting() {
    if (!sdkRootRef.current) {
      setStatus("Zoom render target is not ready.");
      return;
    }
    if (!window.ZoomMtgEmbedded) {
      setStatus("Zoom Meeting SDK has not loaded yet.");
      return;
    }

    setJoining(true);
    setStatus("Requesting a gated Meeting SDK token...");
    try {
      const token = await requestSdkJwt();
      if (!token.sdk_jwt || !token.sdk_client_id) {
        setStatus(
          token.blocked_reasons?.length
            ? `Blocked: ${token.blocked_reasons.join(", ")}`
            : "SDK token was not returned. Check HAL_ZOOM_RETURN_SDK_JWT and the confirmation checkbox.",
        );
        return;
      }

      setStatus("Initializing Zoom Meeting SDK...");
      const client = window.ZoomMtgEmbedded.createClient();
      await client.init({
        zoomAppRoot: sdkRootRef.current,
        language: "en-US",
        patchJsMedia: true,
      });

      setStatus("Joining Zoom as Hal (AI)...");
      await client.join({
        sdkKey: token.sdk_client_id,
        signature: token.sdk_jwt,
        meetingNumber: meetingNumber.trim(),
        password: password.trim(),
        userName: userName.trim() || defaultUserName,
      });
      setStatus("Join request sent to Zoom Meeting SDK.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Zoom join failed.");
    } finally {
      setJoining(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#101211] text-[#f3efe5]">
      <Script
        src="https://source.zoom.us/6.2.0/zoomus-websdk-embedded.umd.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          setSdkLoaded(Boolean(window.ZoomMtgEmbedded));
          setStatus("Zoom Meeting SDK loaded. Enter a controlled test meeting.");
        }}
        onError={() => setStatus("Zoom Meeting SDK failed to load from CDN.")}
      />

      <section className="mx-auto grid min-h-screen max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[420px_1fr]">
        <aside className="border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[12px] font-black uppercase text-[#d4b16f]">Local Zoom Join Proof</p>
          <h1 className="mt-2 text-3xl font-black">Join as Hal (AI)</h1>
          <p className="mt-3 text-sm leading-6 text-[#c9d0c7]">
            This page attempts a controlled Zoom Meeting SDK join. It does not connect Tavus media,
            send invites, update memory, or impersonate Brian.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-bold">
              Meeting number
              <input
                value={meetingNumber}
                onChange={(event) => setMeetingNumber(event.target.value)}
                className="mt-2 w-full border border-white/12 bg-[#0d0f0e] px-3 py-3 font-mono text-sm outline-none focus:border-[#d4b16f]"
                placeholder="123456789"
              />
            </label>

            <label className="block text-sm font-bold">
              Passcode
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full border border-white/12 bg-[#0d0f0e] px-3 py-3 font-mono text-sm outline-none focus:border-[#d4b16f]"
                placeholder="optional"
              />
            </label>

            <label className="block text-sm font-bold">
              Display name
              <input
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                className="mt-2 w-full border border-white/12 bg-[#0d0f0e] px-3 py-3 font-mono text-sm outline-none focus:border-[#d4b16f]"
              />
            </label>

            <label className="flex items-start gap-3 border border-[#c5a56c]/25 bg-[#c5a56c]/8 p-3 text-sm leading-5 text-[#ead8b9]">
              <input
                type="checkbox"
                checked={returnJwtConfirmed}
                onChange={(event) => setReturnJwtConfirmed(event.target.checked)}
                className="mt-1"
              />
              <span>
                I am running a controlled local join test and expect the backend to return a short-lived
                Zoom Meeting SDK token to this page.
              </span>
            </label>

            <button
              type="button"
              disabled={!canAttemptJoin}
              onClick={joinMeeting}
              className="w-full border border-[#d4b16f]/40 bg-[#d4b16f] px-4 py-3 text-sm font-black text-[#15110a] transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
            >
              {joining ? "Joining..." : "Join Controlled Zoom"}
            </button>

            <button
              type="button"
              onClick={requestSdkJwt}
              disabled={!meetingNumber.trim()}
              className="w-full border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-bold text-[#f3efe5] transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
            >
              Check Token Gate
            </button>
          </div>

          <div className="mt-5 border border-white/10 bg-[#0d0f0e] p-4">
            <p className="text-[11px] font-black uppercase text-[#9faaa1]">Status</p>
            <p className="mt-2 text-sm leading-6 text-[#f3efe5]">{status}</p>
          </div>

          {result && (
            <div className="mt-4 border border-white/10 bg-[#0d0f0e] p-4 font-mono text-[12px] leading-6 text-[#cbd3ca]">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    status: result.status,
                    jwt_generated: result.zoom_meeting_sdk_jwt_generated,
                    jwt_returned: result.zoom_meeting_sdk_jwt_returned,
                    blocked_reasons: result.blocked_reasons,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </aside>

        <section className="min-h-[720px] border border-white/10 bg-[#050606]">
          <div id="meetingSDKElement" ref={sdkRootRef} className="h-full min-h-[720px] w-full" />
        </section>
      </section>
    </main>
  );
}
