import { NextResponse } from "next/server";
import { getSupabase, getSupabaseService } from "@/lib/supabase";

export async function GET() {
  try {
    const sAnon = getSupabase();
    const sSvc = getSupabaseService();
    const [{ data: existsAnon, error: eAnon }, { data: existsSvc, error: eSvc }] = await Promise.all([
      sAnon.rpc("pg_catalog.pg_table_is_visible", { relid: "public.journal_entries" as any }).catch(() => ({ data: null, error: { message: "rpc not accessible" } })),
      sSvc ? sSvc.from("journal_entries").select("count").limit(1).maybeSingle() : Promise.resolve({ data: null, error: { message: "no service" } })
    ]) as any;
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


