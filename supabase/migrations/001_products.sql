-- 001_products.sql
-- Migration to set up products table, custom enum types, and storage bucket in Supabase

-- 1. Enable uuid extension
create extension if not exists "uuid-ossp";

-- 2. Create custom enum type for Branch Availability (renders as a Dropdown Select in Supabase Studio)
do $$ begin
  create type public.branch_availability as enum ('all', 'mahalla', 'samanoud');
exception
  when duplicate_object then null;
end $$;

-- 3. Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  brand text,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price >= 0),
  image_url text,
  gallery_images text[] default '{}',
  colors jsonb default '[]'::jsonb,
  specs jsonb default '{}'::jsonb,
  highlights text[] default '{}',
  category text,
  stock integer not null default 0 check (stock >= 0),
  available_branches public.branch_availability not null default 'all',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Ensure newly added columns and enum types exist if table was created previously
alter table public.products add column if not exists brand text;
alter table public.products add column if not exists is_featured boolean not null default false;
alter table public.products add column if not exists gallery_images text[] default '{}';
alter table public.products add column if not exists colors jsonb default '[]'::jsonb;
alter table public.products add column if not exists specs jsonb default '{}'::jsonb;
alter table public.products add column if not exists highlights text[] default '{}';

do $$ begin
  alter table public.products add column available_branches public.branch_availability not null default 'all';
exception
  when duplicate_column then null;
end $$;

-- 4. Create indexes for fast public reads and filtering
create index if not exists idx_products_slug on public.products (slug);
create index if not exists idx_products_active on public.products (is_active);
create index if not exists idx_products_featured on public.products (is_featured);
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_brand on public.products (brand);

-- 5. Create trigger to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row
  execute function public.handle_updated_at();

-- 6. Enable Row Level Security (RLS) & Grant Permissions
alter table public.products enable row level security;

-- Grant standard table permissions to Supabase roles
grant usage on schema public to anon, authenticated, service_role;
grant select on table public.products to anon;
grant all on table public.products to authenticated, service_role;

-- Policy: Anyone can read active products (Public storefront)
drop policy if exists "Allow public read access on active products" on public.products;
create policy "Allow public read access on active products"
  on public.products
  for select
  using (is_active = true);

-- Note: Mutations (Insert, Update, Delete) and reading inactive products by admin are performed
-- via the Supabase Service Role client from Server Actions/Server Components, which bypasses RLS safely.

-- 7. Supabase Storage Setup for 'products' bucket
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

-- Policy: Allow public read access to product images
drop policy if exists "Allow public read on product images" on storage.objects;
create policy "Allow public read on product images"
  on storage.objects
  for select
  using (bucket_id = 'products');

-- Policy: Allow service role / authenticated uploads
drop policy if exists "Allow service role insert on product images" on storage.objects;
create policy "Allow service role insert on product images"
  on storage.objects
  for insert
  with check (bucket_id = 'products');

drop policy if exists "Allow service role update on product images" on storage.objects;
create policy "Allow service role update on product images"
  on storage.objects
  for update
  using (bucket_id = 'products');

drop policy if exists "Allow service role delete on product images" on storage.objects;
create policy "Allow service role delete on product images"
  on storage.objects
  for delete
  using (bucket_id = 'products');
