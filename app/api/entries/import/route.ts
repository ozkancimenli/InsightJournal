import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseService } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseService();
  if (!supabase) return NextResponse.json({ error: "Server missing service key" }, { status: 500 });

  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await req.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: 'Expected an array of entries' }, { status: 400 });
    const rows = body.map((e: any) => ({
      user_id: userId,
      content: String(e.content || ''),
      mood: String(e.mood || 'Neutral'),
      score: Number(e.score || 0.5),
      primary_emotion: e.primary_emotion || null,
      emotions: Array.isArray(e.emotions) ? e.emotions : [],
      created_at: e.created_at ? new Date(e.created_at).toISOString() : new Date().toISOString(),
    }));
    const { error } = await supabase.from('journal_entries_v2').insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ inserted: rows.length });
  }

  return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
}


