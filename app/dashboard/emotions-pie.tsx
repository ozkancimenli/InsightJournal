"use client";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

type Entry = { primary_emotion?: string };

const colorForEmotion = (e?: string) => {
  switch ((e || "").toLowerCase()) {
    case "happy": return "#f59e0b";
    case "sad": return "#6366f1";
    case "angry": return "#f43f5e";
    case "anxious": return "#fb923c";
    case "calm": return "#10b981";
    case "bored": return "#64748b";
    case "excited": return "#ec4899";
    case "depressed": return "#7c3aed";
    case "stressed": return "#ef4444";
    case "hopeful": return "#3b82f6";
    default: return "#2563eb";
  }
};

export default function EmotionsPie({ data }: { data: Entry[] }) {
  const counts = data.reduce((acc, cur) => {
    const k = (cur.primary_emotion || "").toLowerCase();
    if (!k) return acc;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const items = Object.entries(counts).map(([name, value]) => ({ name, value }));
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={items} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} paddingAngle={3}>
            {items.map((it, idx) => (
              <Cell key={idx} fill={colorForEmotion(it.name)} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


