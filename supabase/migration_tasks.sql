-- PawGate tasks migration
-- Run in Supabase SQL Editor → New query → paste & run

create table if not exists public.tasks (
  id         uuid default gen_random_uuid() primary key,
  kennel_id  uuid references public.kennels on delete cascade not null,
  title      text not null,
  date       text not null default '',
  time       text default '',
  tag        text default 'routine',
  done       boolean default false,
  created_at timestamptz default now()
);

alter table public.tasks enable row level security;

create policy "Users CRUD tasks in own kennels" on public.tasks
  using  (kennel_id in (select id from public.kennels where owner_id = auth.uid()))
  with check (kennel_id in (select id from public.kennels where owner_id = auth.uid()));

-- Enable realtime for tasks
alter publication supabase_realtime add table public.tasks;
