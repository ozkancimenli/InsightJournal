"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Card } from "@/components/ui";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { moodToEmoji } from "@/lib/utils";

type Entry = { id?: string; content?: string; created_at: string; mood: string; score: number };

export default function DashboardPage() {
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const Chart = dynamic(() => import("@/components/dashboard-chart"), { ssr: false });
  const EmotionsPie = dynamic(() => import("./emotions-pie"), { ssr: false });
  const [range, setRange] = useState(7);

  useEffect(() => {
    setMounted(true);
    (async () => {
      try {
    const [weekly, recent] = await Promise.all([
      fetch(`/api/entries/weekly?days=${range}`, { headers: { 'Cache-Control': 'no-store' } }).then(r => r.json()),
      fetch("/api/entries", { headers: { 'Cache-Control': 'no-store' } }).then(r => r.json())
    ]);
        setData(weekly as Entry[]);
        setRecentEntries(recent as Entry[]);
      } finally {
        setLoading(false);
      }
    })();
  }, [range]);

  const avg = data.length ? data.reduce((a, b) => a + b.score, 0) / data.length : 0;
  const topMood = data.reduce((acc, cur) => {
    acc[cur.mood] = (acc[cur.mood] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topMoodLabel = Object.entries(topMood).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Neutral";

  // simple streak: consecutive days with any entry from newest backwards
  function calcStreak(entries: Entry[]) {
    if (!entries.length) return 0;
    const days = new Set(entries.map(e => new Date(e.created_at).toDateString()));
    let streak = 0; const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      if (days.has(d.toDateString())) streak++; else break;
    }
    return streak;
  }
  const streak = calcStreak(data);

  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  async function onDeleteEntry(id: string) {
    await fetch(`/api/entries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    // reload
    const [weekly, recent] = await Promise.all([
      fetch("/api/entries/weekly").then(r => r.json()),
      fetch("/api/entries").then(r => r.json())
    ]);
    setData(weekly as Entry[]);
    setRecentEntries(recent as Entry[]);
  }

  function onStartEdit(e: Entry) {
    if (!e.id) return;
    setEditingId(e.id);
    setEditContent(e.content || "");
  }

  async function onSaveEdit() {
    if (!editingId) return;
    await fetch(`/api/entries`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, content: editContent }),
    });
    // reload
    const [weekly, recent] = await Promise.all([
      fetch("/api/entries/weekly").then(r => r.json()),
      fetch("/api/entries").then(r => r.json())
    ]);
    setData(weekly as Entry[]);
    setRecentEntries(recent as Entry[]);
    setEditingId(null);
    setEditContent("");
  }

  function onCancelEdit() {
    setEditingId(null);
    setEditContent("");
  }

  async function onExport() {
    const res = await fetch("/api/export/weekly");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "insight-journal-weekly.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="container-max py-10 space-y-6">
      <SignedOut>
        <div className="border rounded-lg p-6 text-center">
          <p className="mb-3">Sign in to view your dashboard.</p>
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <select className="h-10 rounded-md border bg-background px-2 text-sm" value={range} onChange={(e) => setRange(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <Button onClick={onExport} variant="outline">Export PDF</Button>
        </div>
      </div>

      <Card>
        <div className="h-64" suppressHydrationWarning>
          {loading || !mounted ? (
            <div className="h-full grid place-items-center text-muted-foreground">Loading…</div>
          ) : (
            <Chart data={data} />
          )}
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Avg mood score</div>
            <div className="text-xl font-semibold">{(avg * 100).toFixed(0)}%</div>
          </div>
          <div className="text-2xl" title={topMoodLabel}>{moodToEmoji(topMoodLabel)}</div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Current streak</div>
            <div className="text-xl font-semibold">{streak} day{streak === 1 ? "" : "s"}</div>
          </div>
          <div className="text-2xl">🔥</div>
        </Card>
        <Card>
          <div className="text-sm text-muted-foreground mb-1">AI Insight</div>
          <div className="text-sm">{avg >= 0.6 ? "You seem calmer this week." : avg <= 0.4 ? "A bit tense—short walks can help." : "Holding steady—keep journaling."}</div>
        </Card>
      </div>

      {/* Emotion legend */}
      <div className="text-xs text-muted-foreground mt-2">Emotion colors: happy(amber), sad(indigo), angry(rose), anxious(orange), calm(emerald), bored(slate), excited(pink), depressed(violet), stressed(red), hopeful(blue)</div>

      {/* Distribution */}
      {recentEntries.length > 0 && (
        <Card className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">Emotion distribution (last {range} days)</div>
          <EmotionsPie data={data as any} />
        </Card>
      )}

      {recentEntries.length > 0 && (
        <Card className="mt-4">
          <div className="text-sm text-muted-foreground mb-3">Recent entries</div>
          <div className="space-y-3">
            {recentEntries.map((e) => (
              <div key={e.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</div>
                  <div className="text-xs font-medium">{e.mood} {(e.score * 100).toFixed(0)}%</div>
                </div>
                {editingId === e.id ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={editContent}
                      onChange={(ev) => setEditContent(ev.target.value)}
                      rows={4}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" onClick={onCancelEdit}>Cancel</Button>
                      <Button variant="outline" onClick={onSaveEdit} disabled={!editContent.trim()}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                {e.content && <p className="mt-1 text-sm whitespace-pre-wrap">{e.content}</p>}
                {Array.isArray((e as any).emotions) && (e as any).emotions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(e as any).emotions.slice(0,3).map((em: string, i: number) => (
                      <span key={i} className="text-xs rounded-full border px-2 py-0.5">
                        {em}
                      </span>
                    ))}
                  </div>
                )}
                    {e.id && (
                      <div className="mt-2 text-right flex items-center gap-2 justify-end">
                        <Button variant="ghost" onClick={() => onStartEdit(e)}>Edit</Button>
                        <Button variant="ghost" onClick={() => onDeleteEntry(e.id!)}>Delete</Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
      </SignedIn>
    </main>
  );
}


