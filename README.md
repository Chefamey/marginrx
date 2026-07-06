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

`/login` uses Supabase email/password authentication. v0.1 keeps the in-app AI Ask surface as a placeholder, and adds a separate read-only GPT Action API behind `HOUSE_OS_GPT_TOKEN`.

## Private GPT Access

OpenAPI schema:

```text
https://house-os-nine.vercel.app/api/gpt/openapi.json
```

Protected read endpoints:

```text
GET /api/gpt/summary
GET /api/gpt/entries?q=&module=&category=&tag=&limit=
```

Configure the custom GPT Action with bearer-token authentication using `HOUSE_OS_GPT_TOKEN`. The API is read-only and requires `SUPABASE_SERVICE_ROLE_KEY` on the server so the GPT can retrieve founder records without a browser login session. Set either `HOUSE_OS_OWNER_USER_ID` or `HOUSE_OS_OWNER_EMAIL` so the endpoint is pinned to the founder account.
