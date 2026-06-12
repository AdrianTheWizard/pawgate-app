-- PawGate database schema
-- Run this in the Supabase SQL editor:
-- supabase.com → your project → SQL Editor → New query → paste & run

-- ── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Profiles (extends auth.users) ──────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  kennel_name text default 'Min Kennel',
  avatar_url  text,
  updated_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- ── Kennels ────────────────────────────────────────────────────────────────
create table if not exists public.kennels (
  id         uuid default gen_random_uuid() primary key,
  owner_id   uuid references auth.users on delete cascade not null,
  name       text not null default 'Min Kennel',
  location   text default '',
  timezone   text default 'Europe/Oslo',
  created_at timestamptz default now()
);
alter table public.kennels enable row level security;
create policy "Users CRUD own kennels" on public.kennels
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ── Bingar (pens) ──────────────────────────────────────────────────────────
create table if not exists public.binges (
  id           uuid default gen_random_uuid() primary key,
  kennel_id    uuid references public.kennels on delete cascade not null,
  name         text not null,
  dog          text default '',
  is_open      boolean default false,
  luke_hw      text default 'pawgate',
  spyl_hw      text default 'pawgate',
  auto_open    text default '07:00',
  auto_close   text default '21:00',
  last_changed text default '',
  last_sprayed text default '',
  dog_breed    text default '',
  dog_bday     text default '',
  dog_vet      text default '',
  dog_vac      text default '',
  sort_order   integer default 0,
  created_at   timestamptz default now()
);
alter table public.binges enable row level security;
create policy "Users CRUD binges in own kennels" on public.binges
  using  (kennel_id in (select id from public.kennels where owner_id = auth.uid()))
  with check (kennel_id in (select id from public.kennels where owner_id = auth.uid()));

-- ── Enable Realtime for live gate status ───────────────────────────────────
-- (Run this separately if the table already exists in your publication)
alter publication supabase_realtime add table public.binges;

-- ── Auto-create profile + kennel on signup ─────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, kennel_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'kennel_name', 'Min Kennel')
  ) on conflict (id) do nothing;

  insert into public.kennels (owner_id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'kennel_name', 'Min Kennel')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
