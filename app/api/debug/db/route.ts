import { NextResponse } from "next/server";
import { getSupabase, getSupabaseService } from "@/lib/supabase";

export async function GET() {
  try {
    const sAnon = getSupabase();
    const sSvc = getSupabaseService();

    type CountRow = { count: number } | null;
    type DbErr = { message: string } | null;

    const anonPromise = sAnon
      .from("journal_entries_v2")
      .select("count")
      .limit(1)
      .maybeSingle();

    const svcPromise = sSvc
      ? sSvc.from("journal_entries_v2").select("count").limit(1).maybeSingle()
      : Promise.resolve({ data: null as CountRow, error: { message: "no service" } as DbErr });

    const [{ data: existsAnon, error: eAnon }, { data: existsSvc, error: eSvc }] = await Promise.all([anonPromise, svcPromise]);

    return NextResponse.json({
      anonClientOk: !!sAnon,
      serviceClientOk: !!sSvc,
      anonProbe: { data: existsAnon ?? null, error: eAnon ?? null },
      serviceProbe: { data: existsSvc ?? null, error: eSvc ?? null }
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}


