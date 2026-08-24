import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = {
  title: 'Add New Product - Admin Dashboard',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/admin/products" className="hover:text-zinc-800 dark:hover:text-zinc-200">
          Products
        </Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 font-medium">New Product</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Add New Product</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
          Enter product details, pricing, inventory, and upload media
        </p>
      </div>

      <ProductForm isEditing={false} />
    </div>
  );
}
