import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Product } from '@/types/product';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params;
  return {
    title: `Edit Product ${id} - Admin Dashboard`,
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/products" className="hover:text-zinc-800 dark:hover:text-zinc-200">
          Products
        </Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 font-medium">Edit Product</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Edit: {product.name}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
            Update product info, pricing, stock, or replace the product image
          </p>
        </div>

        <Link
          href={`/products/${product.id}`}
          target="_blank"
          className="text-xs text-zinc-600 dark:text-zinc-400 hover:underline"
        >
          View live on store ↗
        </Link>
      </div>

      <ProductForm product={product as Product} isEditing={true} />
    </div>
  );
}
