import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

const samples = [
  { content: "Felt focused and optimistic about work.", mood: "Positive", score: 0.78, primary_emotion: "happy", emotions: ["happy","hopeful"] },
  { content: "A bit anxious before the meeting.", mood: "Neutral", score: 0.5, primary_emotion: "anxious", emotions: ["anxious"] },
  { content: "Overwhelmed, but I took a walk.", mood: "Stressed", score: 0.32, primary_emotion: "stressed", emotions: ["stressed","bored"] },
  { content: "Calm evening reading.", mood: "Calm", score: 0.72, primary_emotion: "calm", emotions: ["calm"] },
  { content: "Feeling hopeful after a chat with a friend.", mood: "Hopeful", score: 0.68, primary_emotion: "hopeful", emotions: ["hopeful","happy"] },
];

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseService();
  if (!supabase) return NextResponse.json({ error: "Server missing service key" }, { status: 500 });
  const now = Date.now();
  const rows = samples.map((s, idx) => ({ ...s, user_id: userId, created_at: new Date(now - idx * 3_600_000).toISOString() }));
  const { error } = await supabase.from("journal_entries").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ inserted: rows.length });
}


