-- PawGate settings migration
-- Run in Supabase SQL Editor → New query → paste & run

-- ── Add settings columns to profiles ──────────────────────────────────────
alter table public.profiles add column if not exists plan         text    default 'basis';
alter table public.profiles add column if not exists plan_status  text    default 'active';
alter table public.profiles add column if not exists plan_renewal text    default '';
alter table public.profiles add column if not exists theme_id     text    default 'dark-gold';
alter table public.profiles add column if not exists lang         text    default 'nn';
alter table public.profiles add column if not exists notif_prefs  jsonb   default '{"luke":true,"spyl":true,"task":true,"conn":true}'::jsonb;
alter table public.profiles add column if not exists smart_alerts jsonb   default '{"nospyl":{"on":true,"hours":12},"temp":{"on":true,"max":28,"min":5},"lukefail":true,"camfail":true,"inact":{"on":false,"hours":4}}'::jsonb;

-- ── Ensure location/timezone exist on kennels (already in schema but safe) ─
alter table public.kennels add column if not exists location text    default '';
alter table public.kennels add column if not exists timezone text    default 'Europe/Oslo';

-- ── Allow users to read/update their own profile ──────────────────────────
drop policy if exists "Users view own profile"   on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
