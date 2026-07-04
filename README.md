# House OS

House OS is a private founder operating system for The House of Amey Marathe.

It is designed as institutional memory, not a notes app: Founder Codex, projects, relationships, decisions, principles, wealth frameworks, and prophetic record.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres with row level security
- Vercel-ready deployment

## Core Modules

- Founder's Codex
- Projects
- Relationships
- Decisions
- Principles
- Wealth
- Prophetic Record

Every record includes title, module, category, tags, date, body/content, and optional notes/context.

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run `supabase/schema.sql` in the Supabase SQL editor.

4. Create a Supabase Auth user for the private founder account.

5. Start the app:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Deployment

Add the same Supabase environment variables in Vercel and deploy the repository as a Next.js app.

The protected app surfaces are:

- `/dashboard`
- `/entries`
- `/entries/new`
- `/ask`

`/login` uses Supabase email/password authentication. v0.1 includes an AI Ask placeholder only; it does not send private records to an AI provider.
