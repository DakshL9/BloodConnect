-- ==============================================================================
-- BloodConnect Supabase Schema
-- Run this script in the Supabase SQL Editor (SQL Editor -> New query -> Run)
-- ==============================================================================

-- 1. PROFILES TABLE (Holds user profile info and role: 'user' or 'admin')
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Helper function to check if the current user is an admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Automatically create a profile when a new user signs up in Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profiles RLS Policies
-- Logged in users can view their own profile or admins can view all
create policy "Users can view own profile or admins view all"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id or is_admin());

-- Users can update their own profile name (cannot change role; only admins can change role)
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or is_admin())
  with check (
    (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()))
    or is_admin()
  );


-- 2. DONORS TABLE (Registered blood donors)
create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null,
  blood_group text not null,
  phone text not null,
  city text not null,
  availability boolean not null default true,
  last_donated_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on donors
alter table public.donors enable row level security;

-- Donors RLS Policies:
-- Only logged-in users can view donors (for donor search / listing)
create policy "Authenticated users can view donors"
  on public.donors for select
  to authenticated
  using (true);

-- Logged-in users can register themselves as a donor
create policy "Users can insert own donor profile"
  on public.donors for insert
  to authenticated
  with check (auth.uid() = user_id or is_admin());

-- Users can update only their own donor profile; admins can update any
create policy "Users can update own donor profile or admin update any"
  on public.donors for update
  to authenticated
  using (auth.uid() = user_id or is_admin())
  with check (auth.uid() = user_id or is_admin());

-- Users can delete only their own donor profile; admins can delete any
create policy "Users can delete own donor profile or admin delete any"
  on public.donors for delete
  to authenticated
  using (auth.uid() = user_id or is_admin());


-- 3. REQUESTS TABLE (Blood donation emergency requests)
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  blood_group text not null,
  units integer not null default 1,
  hospital text not null,
  city text not null,
  urgency text not null default 'Standard' check (urgency in ('Standard', 'Urgent', 'Critical')),
  contact_phone text not null,
  status text not null default 'Open' check (status in ('Open', 'Fulfilled', 'Cancelled')),
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on requests
alter table public.requests enable row level security;

-- Requests RLS Policies:
-- Only logged-in users can view requests
create policy "Authenticated users can view requests"
  on public.requests for select
  to authenticated
  using (true);

-- Logged-in users can create blood requests
create policy "Users can insert own requests"
  on public.requests for insert
  to authenticated
  with check (auth.uid() = user_id or is_admin());

-- Users can update their own requests (e.g. mark Fulfilled); admins can update any
create policy "Users can update own requests or admin update any"
  on public.requests for update
  to authenticated
  using (auth.uid() = user_id or is_admin())
  with check (auth.uid() = user_id or is_admin());

-- Users can delete their own requests; admins can delete any
create policy "Users can delete own requests or admin delete any"
  on public.requests for delete
  to authenticated
  using (auth.uid() = user_id or is_admin());

