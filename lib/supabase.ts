import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAnonClient: SupabaseClient | null = null;
let cachedServiceClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cachedAnonClient) return cachedAnonClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase env vars missing");
  }
  cachedAnonClient = createClient(url, anon);
  return cachedAnonClient;
}

export function getSupabaseService(): SupabaseClient | null {
  if (cachedServiceClient) return cachedServiceClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return null;
  cachedServiceClient = createClient(url, service);
  return cachedServiceClient;
}

export type MoodLabel = "Positive" | "Neutral" | "Negative" | "Calm" | "Stressed" | "Hopeful";

export type JournalEntry = {
  id: string;
  user_id: string;
  content: string;
  mood: MoodLabel;
  score: number;
  created_at: string;
};


