import { NextResponse } from "next/server";
import { buildHalConversationStartPreview } from "@/lib/hal/conversationStartPreview";
import { readOptionalJsonBody } from "@/lib/hal/runtime";

export async function POST(request: Request) {
  const body = await readOptionalJsonBody(request);
  return NextResponse.json(buildHalConversationStartPreview(body));
}
