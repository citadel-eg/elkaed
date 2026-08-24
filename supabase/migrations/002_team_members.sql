-- 002_team_members.sql
-- Migration to set up team_members table in Supabase

-- 1. Enable uuid extension if not already enabled
create extension if not exists "uuid-ossp";

-- 2. Create team_members table
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  image_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- 3. Create indexes for fast querying
create index if not exists idx_team_members_active on public.team_members (is_active);
create index if not exists idx_team_members_order on public.team_members (display_order);

-- 4. Create trigger to automatically update updated_at timestamp
drop trigger if exists set_team_members_updated_at on public.team_members;
create trigger set_team_members_updated_at
  before update on public.team_members
  for each row
  execute function public.handle_updated_at();

-- 5. Enable Row Level Security (RLS) & Grant Permissions
alter table public.team_members enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on table public.team_members to anon;
grant all on table public.team_members to authenticated, service_role;

-- Policy: Anyone can read active team members (Public storefront)
drop policy if exists "Allow public read access on active team members" on public.team_members;
create policy "Allow public read access on active team members"
  on public.team_members
  for select
  using (is_active = true);

-- 6. Supabase Storage Setup for 'team' bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'team',
  'team',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set public = true;

-- Policy: Allow public read access to team images
drop policy if exists "Allow public read on team images" on storage.objects;
create policy "Allow public read on team images"
  on storage.objects
  for select
  using (bucket_id = 'team');

-- Policy: Allow service role / authenticated uploads
drop policy if exists "Allow service role insert on team images" on storage.objects;
create policy "Allow service role insert on team images"
  on storage.objects
  for insert
  with check (bucket_id = 'team');

drop policy if exists "Allow service role update on team images" on storage.objects;
create policy "Allow service role update on team images"
  on storage.objects
  for update
  using (bucket_id = 'team');

drop policy if exists "Allow service role delete on team images" on storage.objects;
create policy "Allow service role delete on team images"
  on storage.objects
  for delete
  using (bucket_id = 'team');
