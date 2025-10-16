## Insight Journal – Emotional AI Diary

Minimal journaling with AI mood insights, weekly trends, and PDF export.

### Stack
- Next.js 14 (App Router, TS)
- Clerk Auth
- Supabase (DB + RLS)
- Tailwind + shadcn-styled components
- Recharts
- OpenAI API
- PDFKit
- PWA (offline queue)

### Setup
1. Envs:
```bash
cp .env.example .env.local  # if .env.example not present, create .env.local manually
```
Fill:
```
# OpenAI API
OPENAI_API_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

2. Install deps:
```bash
npm i
```

3. Database schema (Supabase SQL editor):
```sql
-- Run supabase/schema.sql contents
```

4. Dev:
```bash
npm run dev
```

### Notes
- RLS allows users to manage only their own entries.
-- `/api/analyze` returns `{ mood, score, primary_emotion?, emotions? }`.
-- `/api/entries` stores entries; `/api/entries/weekly?days=7` retrieves last N days.
-- `/api/export/weekly` returns a PDF summary.
-- `/api/dev/seed` inserts sample entries (signed-in only, dev use).
-- `/api/entries/import` accepts a JSON array to import entries (from export).

### Production checklist
- Set envs in Vercel (same as local).
- Apply SQL in Supabase project/branch used by those keys.
- Verify `journal_entries_v2` exists and RLS policy is active.
- OpenAI key present; analyze endpoint returns 200.
- Optional hardening: zod validation for APIs, OpenAI timeout, rate limiting, error boundary.


