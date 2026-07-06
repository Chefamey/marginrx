# Deployment

House OS v0.1 deploys as a standard Next.js app on Vercel.

## Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Framework preset: Next.js.
4. Install/build commands can use Vercel defaults for pnpm, or set build command to `pnpm build`.
5. Add environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
HOUSE_OS_GPT_TOKEN=generate-a-long-private-token
HOUSE_OS_OWNER_USER_ID=founder-supabase-user-id
HOUSE_OS_OWNER_EMAIL=chef.marathe@gmail.com
```

6. Deploy.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Create the private founder user in Supabase Auth.
4. Confirm email/password login is enabled.

Row level security keeps `house_entries` private to the authenticated owner.

## Routes

- `/login` - secure access
- `/dashboard` - executive dashboard
- `/entries` - searchable archive
- `/entries/new` - create record
- `/ask` - AI Ask placeholder for v0.1
- `/api/gpt/openapi.json` - OpenAPI schema for custom GPT Actions
- `/api/gpt/summary` - token-gated read-only GPT summary endpoint
- `/api/gpt/entries` - token-gated read-only GPT record search endpoint
