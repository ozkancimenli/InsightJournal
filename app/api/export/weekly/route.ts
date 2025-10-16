import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";
import { generateWeeklyPdf } from "@/lib/pdf";
import { generateMotivation } from "@/lib/ai";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 6);
  const supabase = getSupabase();
  const { data } = await supabase
    .from("journal_entries")
    .select("created_at,mood,score")
    .eq("user_id", userId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  type Row = { created_at: string; mood: string; score: number };
  const entries: Row[] = (data as Row[]) ?? [];
  const avg = entries.length ? entries.reduce((a, b) => a + b.score, 0) / entries.length : 0;
  const counts = entries.reduce((acc: Record<string, number>, cur: Row) => {
    acc[cur.mood] = (acc[cur.mood] ?? 0) + 1; return acc;
  }, {} as Record<string, number>);
  const topMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Neutral";
  const weekRange = `${since.toLocaleDateString()} – ${new Date().toLocaleDateString()}`;
  const insight = entries.length >= 2 ? "You seem calmer this week compared to last." : "Keep building your streak.";
  const quote = await generateMotivation(`Average ${(avg*100).toFixed(0)}%, top mood ${topMood}.`);

  const pdf = generateWeeklyPdf({ weekRange, avgScore: avg, topMood, insights: insight, quote });
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve) => {
    pdf.on("data", (c: Buffer) => chunks.push(c));
    pdf.on("end", () => resolve());
  });
  const file = Buffer.concat(chunks);
  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=insight-journal-weekly.pdf",
      "Cache-Control": "no-store"
    }
  });
}


