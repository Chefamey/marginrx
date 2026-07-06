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
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
HOUSE_OS_GPT_TOKEN=generate-a-long-private-token
HOUSE_OS_GPT_WRITE_TOKEN=optional-separate-write-token
HOUSE_OS_OWNER_USER_ID=founder-supabase-user-id
HOUSE_OS_OWNER_EMAIL=chef.marathe@gmail.com
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

`/login` uses Supabase email/password authentication. v0.1 keeps the in-app AI Ask surface as a placeholder, and adds a separate GPT Action API behind `HOUSE_OS_GPT_TOKEN`.

## Private GPT Access

OpenAPI schema:

```text
https://house-os-nine.vercel.app/api/gpt/openapi.json
```

Protected GPT endpoints:

```text
GET /api/gpt/summary
GET /api/gpt/entries?q=&module=&category=&tag=&limit=
POST /api/gpt/entries
GET /api/gpt/entries/:id
PATCH /api/gpt/entries/:id
POST /api/gpt/daily-update
```

Configure the custom GPT Action with bearer-token authentication using `HOUSE_OS_GPT_TOKEN`. Writes may use `HOUSE_OS_GPT_WRITE_TOKEN` when set; otherwise the main GPT token authorizes both reads and writes. The API does not expose delete actions.

The server requires `SUPABASE_SERVICE_ROLE_KEY` so the GPT can access founder records without a browser login session. Set either `HOUSE_OS_OWNER_USER_ID` or `HOUSE_OS_OWNER_EMAIL` so every action is pinned to the founder account.

Daily maintenance is handled through `POST /api/gpt/daily-update`, which creates or updates one operating update for the current Asia/Kolkata date unless a date is supplied. The endpoint is ready for a scheduled GPT/external automation to call once per day; GPT itself only updates House OS when an action is invoked.
