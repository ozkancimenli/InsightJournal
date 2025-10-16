"use client";
import { useEffect, useState } from "react";
import { useAuth, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button, Card, Textarea } from "@/components/ui";
import { moodToEmoji, moodToColor } from "@/lib/utils";
import { toast } from "sonner";

type AnalyzeResponse = { mood: string; score: number };
type EntryItem = { id: string; content: string; mood: string; score: number; created_at: string };

export default function JournalPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [editing, setEditing] = useState<EntryItem | null>(null);
  const { userId, isLoaded } = useAuth();

  async function onAnalyze() {
    if (!content.trim()) return toast.warning("Write something first.");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await res.json()) as AnalyzeResponse;
      setResult(data);
      toast.success(`Analyzed: ${data.mood}`);
    } catch {
      toast.error("Failed to analyze");
    } finally {
      setLoading(false);
    }
  }

  async function onSave() {
    if (!result) return toast.warning("Analyze first.");
    if (!isLoaded || !userId) return toast.warning("Sign in to save.");
    setLoading(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mood: result.mood, score: result.score, primary_emotion: (result as any).primary_emotion, emotions: (result as any).emotions }),
      });
      if (!res.ok) throw new Error("Save failed");
      setContent("");
      setResult(null);
      toast.success("Saved entry");
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {}, []);

  async function onStartEdit(item: EntryItem) {
    setEditing(item);
    setContent(item.content);
    setResult({ mood: item.mood, score: item.score });
  }

  async function onSaveEdit() {
    if (!editing) return;
    const res = await fetch("/api/entries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing.id, content }),
    });
    if (!res.ok) return toast.error("Update failed");
    setEditing(null);
    setContent("");
    setResult(null);
      toast.success("Updated entry");
  }

  async function onDelete(id: string) {
    const res = await fetch(`/api/entries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Delete failed");
    toast.success("Deleted");
  }

  return (
    <main className="container-max py-10 space-y-6">
      <h1 className="text-2xl font-semibold">New Journal Entry</h1>
      <Card className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How are you feeling today?"
        />
        <div className="flex items-center gap-2">
          <Button onClick={onAnalyze} disabled={loading}>Analyze</Button>
          {editing ? (
            <Button variant="outline" onClick={onSaveEdit} disabled={loading || !content.trim()}>Update</Button>
          ) : (
            <Button variant="outline" onClick={onSave} disabled={loading || !result}>Save</Button>
          )}
        </div>
      </Card>

      {result && (
        <div className={`rounded-lg p-4 border bg-gradient-to-br ${moodToColor(result.mood)}`}>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{moodToEmoji(result.mood)}</div>
            <div className="font-medium">
              {result.mood} – {(result.score * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      <SignedOut>
        <div className="border rounded-lg p-4 text-center">
          <p className="mb-2">Sign in to save your entries.</p>
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* Recent list moved to dashboard */}
    </main>
  );
}


