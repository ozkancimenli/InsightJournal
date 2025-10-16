import { NextRequest, NextResponse } from "next/server";
import { analyzeTextMood } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }
    const res = await analyzeTextMood(content);
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ mood: "Neutral", score: 0.5 });
  }
}


