import { NextResponse } from "next/server";
import { buildHalOperatorReview } from "@/lib/hal/operatorReview";
import { readOptionalJsonBody } from "@/lib/hal/runtime";

export async function POST(request: Request) {
  const body = await readOptionalJsonBody(request);
  return NextResponse.json(buildHalOperatorReview(body));
}
