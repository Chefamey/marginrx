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
