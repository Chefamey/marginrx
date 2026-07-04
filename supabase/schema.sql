create extension if not exists pgcrypto;

create table if not exists public.house_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module text not null check (
    module in (
      'founders_codex',
      'projects',
      'relationships',
      'decisions',
      'principles',
      'wealth',
      'prophetic_record'
    )
  ),
  title text not null,
  category text not null,
  tags text[] not null default '{}',
  entry_date date not null default current_date,
  body text not null,
  context text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists house_entries_user_module_idx on public.house_entries(user_id, module);
create index if not exists house_entries_user_date_idx on public.house_entries(user_id, entry_date desc);
create index if not exists house_entries_tags_idx on public.house_entries using gin(tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_house_entries_updated_at on public.house_entries;
create trigger set_house_entries_updated_at
before update on public.house_entries
for each row
execute function public.set_updated_at();

alter table public.house_entries enable row level security;

drop policy if exists "House entries are private to the owner" on public.house_entries;
create policy "House entries are private to the owner"
on public.house_entries
for select
using (auth.uid() = user_id);

drop policy if exists "Owners can insert house entries" on public.house_entries;
create policy "Owners can insert house entries"
on public.house_entries
for insert
with check (auth.uid() = user_id);

drop policy if exists "Owners can update house entries" on public.house_entries;
create policy "Owners can update house entries"
on public.house_entries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Owners can delete house entries" on public.house_entries;
create policy "Owners can delete house entries"
on public.house_entries
for delete
using (auth.uid() = user_id);
