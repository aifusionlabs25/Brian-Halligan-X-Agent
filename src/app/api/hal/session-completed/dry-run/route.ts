import { NextResponse } from "next/server";
import { readOptionalJsonBody } from "@/lib/hal/runtime";
import { buildHalSessionCompletedDryRun } from "@/lib/hal/sessionDryRun";

export async function POST(request: Request) {
  const body = await readOptionalJsonBody(request);
  return NextResponse.json(buildHalSessionCompletedDryRun(body));
}
