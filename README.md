## Insight Journal – Emotional AI Diary

Minimal journaling with AI mood insights, weekly trends, and PDF export.

### Tech Stack
- Next.js 14 (App Router, TypeScript)
- Clerk (authentication)
- Supabase (Postgres + RLS)
- Tailwind CSS + shadcn-style components
- Recharts (charts)
- OpenAI API (analysis)
- PDFKit (PDF export)
- PWA (offline support)

---

### Features
- AI-powered mood analysis per entry
- Weekly summary and charts (pie/line)
- PDF export for weekly report
- Import/export entries (JSON)
- Secure, per-user data via RLS

---

### Getting Started
1) Environment variables
```bash
cp .env.example .env.local # or create .env.local
```
Fill in:
```
# OpenAI
OPENAI_API_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

2) Install dependencies
```bash
npm install
```

3) Database schema
Run the SQL in `supabase/schema.sql` in your Supabase project (SQL Editor). Ensure RLS is enabled and policies from the file are applied.

4) Development
```bash
npm run dev
```

---

### Scripts
- `npm run dev`: Start Next.js dev server on port 3000
- `npm run build`: Production build
- `npm start`: Start production server
- `npm run lint`: Lint
- `npm run test`: Run tests once (Vitest)
- `npm run test:watch`: Watch tests

---

### API Endpoints
- `POST /api/analyze`: Analyze text, returns `{ mood, score, primary_emotion?, emotions? }`
- `GET /api/entries/weekly?days=7`: Weekly entries aggregation
- `POST /api/entries`: Create an entry
- `GET /api/export/weekly`: PDF weekly report
- `POST /api/dev/seed`: Seed sample entries (dev only)
- `POST /api/entries/import`: Import entries from JSON

---

### Project Structure
- `app/` – Next.js App Router pages and API routes
- `components/` – UI components (charts, navbar, theme, etc.)
- `lib/` – helpers: OpenAI, Supabase client, utils
- `supabase/` – SQL schema

---

### Deployment
- Deploy on Vercel
- Set all environment variables in the hosting platform
- Point to the same Supabase project used locally and apply the schema
- Verify `/api/analyze` works (OpenAI key set), and RLS policies are active

---

### Troubleshooting
- Missing `OPENAI_API_KEY`: analysis returns fallback; set the key in envs
- Supabase errors: verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 401/403 on APIs: ensure Clerk keys are set and user is signed in
- PDF not generating: confirm `pdfkit` installed and `/api/export/weekly` reachable

---

### License
MIT
