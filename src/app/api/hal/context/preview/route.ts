import { NextResponse } from "next/server";
import { buildHalContextPreview } from "@/lib/hal/contextPreview";
import { readOptionalJsonBody } from "@/lib/hal/runtime";

export async function POST(request: Request) {
  const body = await readOptionalJsonBody(request);
  return NextResponse.json(buildHalContextPreview(body));
}
