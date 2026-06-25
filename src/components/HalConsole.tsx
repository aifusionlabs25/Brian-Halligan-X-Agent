"use client";

import Image from "next/image";
import {
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  LockKeyhole,
  Play,
  RadioTower,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { HalTranscriptAnalysis } from "@/lib/hal/transcriptAnalysis";

type PreviewState = {
  label: string;
  status: "ready" | "pending" | "blocked";
  detail: string;
};

type ApiResult = Record<string, unknown> | null;

const operations = [
  {
    label: "Payload",
    endpoint: "/api/hal/conversation/start-preview",
    icon: Play,
  },
  {
    label: "Context",
    endpoint: "/api/hal/context/preview",
    icon: BrainCircuit,
  },
  {
    label: "Session",
    endpoint: "/api/hal/session-completed/dry-run",
    icon: ClipboardCheck,
  },
  {
    label: "Review",
    endpoint: "/api/hal/operator-review/dry-run",
    icon: ShieldCheck,
  },
] as const;

function statusClass(status: PreviewState["status"]) {
  if (status === "ready") return "border-emerald-300/28 bg-emerald-300/9 text-emerald-100";
  if (status === "blocked") return "border-red-300/25 bg-red-300/8 text-red-100";
  return "border-[#c5a56c]/30 bg-[#c5a56c]/10 text-[#f4ddb0]";
}

function BooleanLine({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 py-2 last:border-b-0">
      <span className="text-[12px] font-semibold uppercase text-[#9faaa1]">{label}</span>
      <span className={value ? "text-emerald-200" : "text-[#d4b16f]"}>
        {value ? "true" : "false"}
      </span>
    </div>
  );
}

function summarizeResult(result: ApiResult) {
  if (!result) return "No preview selected.";
  const keys = [
    "dry_run_only",
    "live_tavus_called",
    "live_hermes_called",
    "outbound_action_taken",
    "production_database_mutated",
    "action_claim_allowed",
  ];
  return keys
    .map((key) => `${key}: ${String(result[key] ?? "n/a")}`)
    .join("\n");
}

export function HalConsole({
  transcriptAnalysis,
}: {
  transcriptAnalysis: HalTranscriptAnalysis;
}) {
  const [result, setResult] = useState<ApiResult>(null);
  const [active, setActive] = useState<string>("none");
  const [loading, setLoading] = useState(false);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setClientReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const statusRows = useMemo<PreviewState[]>(
    () => [
      {
        label: "Replica",
        status: result?.replica_id_configured === true ? "ready" : "pending",
        detail:
          result?.replica_id_configured === true
            ? "Env present"
            : "Awaiting Tavus env",
      },
      {
        label: "Persona",
        status: result?.persona_id_configured === true ? "ready" : "pending",
        detail:
          result?.persona_id_configured === true
            ? "Env present"
            : "Pending Tavus persona",
      },
      {
        label: "Runtime",
        status: "blocked",
        detail: "Live calls closed",
      },
      {
        label: "Memory",
        status: "pending",
        detail: "Review before store",
      },
    ],
    [result],
  );

  async function runPreview(endpoint: string, label: string) {
    setLoading(true);
    setActive(label);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_mode: "public_plus_approved_kb_pending",
          demo_scenario: "hal_video_persona_review",
        }),
      });
      const json = (await response.json()) as Record<string, unknown>;
      setResult(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111312] text-[#f3efe5]">
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(360px,0.88fr)_minmax(560px,1.12fr)]">
        <div className="relative min-h-[560px] overflow-hidden border-b border-white/10 bg-[#171a18] lg:border-b-0 lg:border-r">
          <Image
            src="/hal-concept-v1.png"
            alt="Synthetic Hal executive operating partner concept"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 44vw, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,18,0.03)_0%,rgba(17,19,18,0.48)_58%,rgba(17,19,18,0.9)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="max-w-xl border border-white/12 bg-[#111312]/82 p-5 shadow-2xl backdrop-blur-md">
              <div className="mb-4 flex items-center gap-3 text-[12px] font-bold uppercase text-[#d4b16f]">
                <RadioTower size={16} />
                Hal X Agent
              </div>
              <h1 className="text-4xl font-black leading-tight text-[#f5efe2] sm:text-5xl">
                Executive autopilot, supervised by design.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#c9d0c7]">
                Tavus-style interface. Dani/Hermes memory path. Brian-approved knowledge only.
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex min-h-screen flex-col bg-[linear-gradient(135deg,#111312_0%,#1a201d_54%,#101211_100%)]"
          data-client-ready={clientReady ? "true" : "false"}
        >
          <header className="border-b border-white/10 px-5 py-4 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[12px] font-bold uppercase text-[#9faaa1]">Prototype Lane</p>
                <h2 className="mt-1 text-2xl font-black text-[#f4efe5]">Hal operating console</h2>
              </div>
              <div className="flex items-center gap-2 border border-[#c5a56c]/25 bg-[#c5a56c]/10 px-3 py-2 text-[12px] font-bold uppercase text-[#f4ddb0]">
                <LockKeyhole size={15} />
                Dry run only
              </div>
            </div>
          </header>

          <section className="grid gap-4 border-b border-white/10 px-5 py-5 sm:grid-cols-4 sm:px-7">
            {statusRows.map((row) => (
              <div key={row.label} className={`border p-4 ${statusClass(row.status)}`}>
                <p className="text-[11px] font-black uppercase">{row.label}</p>
                <p className="mt-2 text-sm font-semibold">{row.detail}</p>
              </div>
            ))}
          </section>

          <section className="grid flex-1 gap-5 px-5 py-5 sm:px-7 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              <div className="border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex items-center gap-2 text-[12px] font-black uppercase text-[#9faaa1]">
                  <FileSearch size={16} />
                  Video Persona Read
                </div>
                <h3 className="text-xl font-black text-[#f4efe5]">{transcriptAnalysis.headline}</h3>
                <p className="mt-3 text-sm leading-6 text-[#c9d0c7]">{transcriptAnalysis.takeaway}</p>
                <div className="mt-5 space-y-3">
                  {transcriptAnalysis.promptMoves.map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-5 text-[#e7e0d2]">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={16} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 bg-[#0d0f0e] p-5">
                <div className="grid grid-cols-2 gap-3">
                  {operations.map((operation) => {
                    const Icon = operation.icon;
                    return (
                      <button
                        key={operation.label}
                        type="button"
                        onClick={() => runPreview(operation.endpoint, operation.label)}
                        disabled={!clientReady || loading}
                        className="flex min-h-24 flex-col justify-between border border-white/10 bg-white/[0.045] p-4 text-left transition-colors hover:border-[#c5a56c]/55 hover:bg-[#c5a56c]/10"
                      >
                        <Icon size={20} className="text-[#d4b16f]" />
                        <span className="text-sm font-black text-[#f4efe5]">{operation.label}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setActive("none");
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-2 border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold text-[#d8ded6] transition-colors hover:bg-white/[0.07]"
                >
                  <RotateCcw size={16} />
                  Reset Preview
                </button>
              </div>
            </div>

            <div className="border border-white/10 bg-[#0d0f0e] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[12px] font-black uppercase text-[#9faaa1]">Safe Response</p>
                  <h3 className="mt-1 text-xl font-black text-[#f4efe5]">{active}</h3>
                </div>
                {loading && <span className="text-sm font-semibold text-[#d4b16f]">Running</span>}
              </div>

              <div className="mb-5 border border-white/8 bg-white/[0.025] p-4 font-mono text-[12px] leading-6 text-[#cbd3ca]">
                <pre className="whitespace-pre-wrap">{summarizeResult(result)}</pre>
              </div>

              <div className="space-y-1 font-mono text-sm">
                <BooleanLine label="Live Tavus" value={result?.live_tavus_called === true} />
                <BooleanLine label="Live Hermes" value={result?.live_hermes_called === true} />
                <BooleanLine label="Outbound Action" value={result?.outbound_action_taken === true} />
                <BooleanLine label="Production DB" value={result?.production_database_mutated === true} />
                <BooleanLine label="Claim Action Done" value={result?.action_claim_allowed === true} />
              </div>

              <div className="mt-5 border border-[#c5a56c]/25 bg-[#c5a56c]/8 p-4 text-sm leading-6 text-[#ead8b9]">
                Hal can prepare, route, and recommend. Completion claims stay off until a connected system confirms them.
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
