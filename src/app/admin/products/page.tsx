import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { ProductTable } from '@/components/admin/ProductTable';
import type { Product } from '@/types/product';

export const metadata = {
  title: 'Products - Admin Dashboard',
};

// Ensure fresh data on every request in the admin panel
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = createAdminClient();

  let { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // Resilient fallback if created_at column is not yet present
  if (error && error.code === '42703') {
    const fallback = await supabase.from('products').select('*');
    products = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error('Failed to fetch admin products:', error.message || error);
  }

  const productList: Product[] = products || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Products</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            Manage your store inventory, prices, and product visibility
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          + Add Product
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          <p className="font-semibold">Unable to fetch products from Supabase</p>
          <p className="mt-1 text-xs">{error.message}</p>
        </div>
      )}

      <ProductTable products={productList} />
    </div>
  );
}
