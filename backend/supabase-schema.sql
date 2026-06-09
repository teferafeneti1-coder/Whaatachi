-- ============================================================
-- Whaatachi — Supabase SQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- USERS TABLE
create table if not exists public.users (
  id                 uuid primary key default gen_random_uuid(),
  full_name          text not null,
  photo_url          text default '',
  telegram_username  text default '',
  phone_number       text default '',
  instagram_username text default '',
  age                integer,
  gender             text not null check (gender in ('male', 'female')),
  connection_goal    text not null check (connection_goal in ('relationship', 'dating', 'fwb', 'casual')),
  is_approved        boolean default false,
  is_admin           boolean default false,
  password_hash      text,
  created_at         timestamptz default now()
);

-- PAYMENTS TABLE
create table if not exists public.payments (
  id             uuid primary key default gen_random_uuid(),
  payer_info     text not null,
  viewed_user_id uuid references public.users(id) on delete cascade,
  amount         integer default 200,
  method         text not null check (method in ('telebirr', 'cbe')),
  status         text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at     timestamptz default now()
);

-- Indexes
create index if not exists idx_users_gender      on public.users(gender);
create index if not exists idx_users_approved    on public.users(is_approved);
create index if not exists idx_payments_payer    on public.payments(payer_info, viewed_user_id);
create index if not exists idx_payments_status   on public.payments(status);

-- Disable Row Level Security (backend uses service key — full access)
alter table public.users    disable row level security;
alter table public.payments disable row level security;
