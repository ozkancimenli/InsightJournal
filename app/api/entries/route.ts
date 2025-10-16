import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseService } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { content, mood, score, primary_emotion, emotions } = await req.json();
    if (!content || typeof content !== "string") return NextResponse.json({ error: "Invalid content" }, { status: 400 });

    const supabase = getSupabaseService();
    if (!supabase) return NextResponse.json({ error: "Server missing service key" }, { status: 500 });
    const { error } = await supabase.from("journal_entries_v2").insert({
      user_id: userId,
      content,
      mood,
      score,
      primary_emotion,
      emotions,
    });
    if (error) {
      console.error("/api/entries insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("/api/entries unexpected error:", e);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 200 });
  const supabase = getSupabaseService();
  if (!supabase) return NextResponse.json([], { status: 200 });
  const { data, error } = await supabase
    .from("journal_entries_v2")
    .select("id, content, mood, score, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data ?? []);
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, content } = await req.json();
  if (!id || !content) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const supabase = getSupabaseService();
  if (!supabase) return NextResponse.json({ error: "Server missing service key" }, { status: 500 });
  const { error } = await supabase
    .from("journal_entries_v2")
    .update({ content })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const supabase = getSupabaseService();
  if (!supabase) return NextResponse.json({ error: "Server missing service key" }, { status: 500 });
  const { error } = await supabase
    .from("journal_entries_v2")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}


