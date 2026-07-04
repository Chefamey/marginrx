# Supabase Schema Draft

House OS v0.1 uses one private Postgres table for all institutional-memory entries.

Run the executable schema at `supabase/schema.sql` in the Supabase SQL editor.

## house_entries

- `id uuid primary key`
- `user_id uuid references auth.users(id) on delete cascade`
- `module text`
  - `founders_codex`
  - `projects`
  - `relationships`
  - `decisions`
  - `principles`
  - `wealth`
  - `prophetic_record`
- `title text`
- `category text`
- `tags text[]`
- `entry_date date`
- `body text`
- `context text`
- `created_at timestamptz`
- `updated_at timestamptz`

## Security

Row level security is enabled. Policies restrict select, insert, update, and delete operations to the authenticated owner where `auth.uid() = user_id`.
