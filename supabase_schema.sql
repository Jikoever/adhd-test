-- Run this in Supabase SQL editor
-- Auth now uses Supabase native auth.users (email + GitHub).
-- Only app stats table is needed here.

create table if not exists public.adhd_daily_bingo_stats (
  user_id text not null,
  date date not null,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

create index if not exists adhd_daily_bingo_stats_date_idx on public.adhd_daily_bingo_stats(date);

-- If old schema had FK to adhd_users, remove it (for native auth compatibility).
alter table if exists public.adhd_daily_bingo_stats
  drop constraint if exists adhd_daily_bingo_stats_user_id_fkey;

-- Optional (recommended when server writes with service_role):
-- alter table public.adhd_daily_bingo_stats disable row level security;
