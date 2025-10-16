import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseService } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 200 });
  const url = new URL(req.url);
  const daysParam = url.searchParams.get("days");
  const days = Math.max(1, Math.min(30, Number(daysParam) || 7));
  const since = new Date();
  // compute from UTC midnight to avoid timezone gaps
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (days - 1));
  const supabase = getSupabaseService();
  if (!supabase) return NextResponse.json([], { status: 200 });
  const { data, error } = await supabase
    .from("journal_entries_v2")
    .select("id,created_at,mood,score,primary_emotion,emotions")
    .eq("user_id", userId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json([], { status: 200, headers: { 'Cache-Control': 'no-store' } });
  return NextResponse.json(data ?? [], { status: 200, headers: { 'Cache-Control': 'no-store' } });
}


