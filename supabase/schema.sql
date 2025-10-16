-- Ensure pgcrypto for gen_random_uuid
create extension if not exists pgcrypto;
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  content text not null,
  mood text not null,
  score double precision not null,
  primary_emotion text,
  emotions text[] default '{}'::text[],
  created_at timestamp with time zone not null default now()
);

create index if not exists journal_entries_user_created_idx on public.journal_entries(user_id, created_at desc);

alter table public.journal_entries enable row level security;

-- RLS: users can CRUD only their own rows
create policy if not exists "Users can manage own entries" on public.journal_entries
for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- New table with richer emotion fields to avoid schema cache issues
create table if not exists public.journal_entries_v2 (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  content text not null,
  mood text not null,
  score double precision not null,
  primary_emotion text,
  emotions text[] default '{}'::text[],
  created_at timestamp with time zone not null default now()
);

create index if not exists journal_entries_v2_user_created_idx on public.journal_entries_v2(user_id, created_at desc);

alter table public.journal_entries_v2 enable row level security;

create policy if not exists "Users manage own entries v2" on public.journal_entries_v2
for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);

-- Optional: migrate existing rows (without emotions)
-- insert into public.journal_entries_v2 (id, user_id, content, mood, score, created_at)
-- select id, user_id, content, mood, score, created_at from public.journal_entries
-- on conflict (id) do nothing;

-- Refresh PostgREST schema cache (run once in SQL editor)
-- notify pgrst, 'reload schema';


