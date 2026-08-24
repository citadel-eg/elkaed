# Supabase Database & Storage Setup

## Quick Setup Instructions

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project: `hqmnistbtiozalclszhm`.
3. Open the **SQL Editor** tab on the left sidebar.
4. Copy the entire contents of [`migrations/001_products.sql`](./migrations/001_products.sql) and paste into a new SQL query.
5. Click **Run**.

## What this creates:
- `public.products` table with UUID primary key, slug, name, description, price, compare_at_price, image_url, category, stock, is_active, created_at, updated_at.
- Trigger for automatically maintaining `updated_at`.
- Row Level Security (RLS) policies allowing public read of active products.
- `products` public storage bucket for product images organized as `products/{product-id}/{filename}`.
