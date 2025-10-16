"use client";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Scatter, Cell, Area } from "recharts";

type Entry = { created_at: string; mood: string; score: number };

export default function DashboardChart({ data, showPoints = true }: { data: Entry[]; showPoints?: boolean }) {
  const points = data.map(d => ({
    mood: d.mood,
    score: d.score,
    time: new Date(d.created_at).getTime(),
    label: new Date(d.created_at).toLocaleString(),
    primary: (d as any).primary_emotion as string | undefined,
  }));

  // daily aggregates (average per day)
  const dayToScores = new Map<number, number[]>();
  for (const p of points) {
    const day = new Date(p.time); day.setHours(0,0,0,0);
    const key = day.getTime();
    const arr = dayToScores.get(key) || [];
    arr.push(p.score);
    dayToScores.set(key, arr);
  }
  const aggregates = Array.from(dayToScores.entries())
    .sort((a,b) => a[0]-b[0])
    .map(([day, scores]) => {
      const sum = scores.reduce((a,b)=>a+b,0);
      const avg = sum / scores.length;
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      return { day, avg, min, max, count: scores.length };
    });

  const fmt = (ms: number) => new Date(ms).toLocaleDateString();

  const colorForEmotion = (e?: string) => {
    switch ((e || "").toLowerCase()) {
      case "happy": return "#f59e0b"; // amber
      case "sad": return "#6366f1"; // indigo
      case "angry": return "#f43f5e"; // rose
      case "anxious": return "#fb923c"; // orange
      case "calm": return "#10b981"; // emerald
      case "bored": return "#64748b"; // slate
      case "excited": return "#ec4899"; // pink
      case "depressed": return "#7c3aed"; // violet
      case "stressed": return "#ef4444"; // red
      case "hopeful": return "#3b82f6"; // blue
      default: return "#2563eb";
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="day" domain={["dataMin", "dataMax"]} tickFormatter={(v) => new Date(Number(v)).toLocaleDateString()} />
        <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(Number(v) * 100)}%`} />
        <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v: any) => `${Math.round(Number(v) * 100)}%`} labelFormatter={(v) => fmt(Number(v))} />
        {/* Daily min–max band (approx) */}
        <Area data={aggregates} type="monotone" dataKey="max" stroke="none" fill="#2563eb" fillOpacity={0.08} />
        <Area data={aggregates} type="monotone" dataKey="min" stroke="none" fill="#ffffff" fillOpacity={1} />
        {/* Daily average trend */}
        <Line data={aggregates} type="monotone" dataKey="avg" stroke="#2563eb" dot={false} strokeWidth={2} />
        {/* Per-entry scatter points */}
        {showPoints && (
          <Scatter data={points} dataKey="score" shape="circle">
            {points.map((p, idx) => (
              <Cell key={idx} fill={colorForEmotion(p.primary)} fillOpacity={0.5} />
            ))}
          </Scatter>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}


