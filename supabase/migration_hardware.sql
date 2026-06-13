-- PawGate hardware migration
-- Run in Supabase SQL Editor → New query → paste & run

alter table public.binges add column if not exists luke_ip        text    default '';
alter table public.binges add column if not exists luke_channel   integer default 0;
alter table public.binges add column if not exists luke_close_url text    default '';
alter table public.binges add column if not exists luke_topic     text    default '';
alter table public.binges add column if not exists luke_port      text    default '1883';
alter table public.binges add column if not exists spyl_ip        text    default '';
alter table public.binges add column if not exists spyl_channel   integer default 0;
alter table public.binges add column if not exists spyl_close_url text    default '';
alter table public.binges add column if not exists spyl_topic     text    default '';
alter table public.binges add column if not exists spyl_port      text    default '1883';
alter table public.binges add column if not exists cam_url        text    default '';
alter table public.binges add column if not exists cam_type       text    default 'mjpeg';
