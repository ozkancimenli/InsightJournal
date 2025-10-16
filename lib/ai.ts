import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type Analysis = { mood: string; score: number; primary_emotion?: string; emotions?: string[] };

export async function analyzeTextMood(text: string): Promise<Analysis> {
  if (!client.apiKey) throw new Error("OPENAI_API_KEY missing");

  const system = `You analyze a journal reflection and return a mood label, confidence score, and richer emotions.
Allowed moods: Positive, Neutral, Negative, Calm, Stressed, Hopeful.
Also pick a primary_emotion from: happy, sad, angry, anxious, calm, bored, excited, depressed, stressed, hopeful.
Also include emotions array of up to 3 strings from the same set.
Respond strictly as JSON: {"mood":"Calm","score":0.73,"primary_emotion":"calm","emotions":["calm","hopeful"]}`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: text }
    ],
    temperature: 0.2,
  });

  const content = completion.choices[0]?.message?.content ?? "";
  try {
    const json = JSON.parse(content);
    return { mood: String(json.mood), score: Number(json.score), primary_emotion: json.primary_emotion, emotions: json.emotions };
  } catch {
    return { mood: "Neutral", score: 0.5, primary_emotion: "calm", emotions: ["calm"] };
  }
}

export async function generateMotivation(summary: string): Promise<string> {
  if (!client.apiKey) return "Keep going—small steps shape your week.";
  const prompt = `Based on this weekly mood summary, write one short motivational sentence (max 20 words):\n${summary}`;
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You write concise, encouraging one-liners." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content?.trim() || "You’re trending upward—stay consistent.";
}


