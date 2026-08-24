import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatDate } from '@/lib/utils/format';
import { ToggleActiveButton } from './ToggleActiveButton';
import { DeleteProductButton } from './DeleteProductButton';
import type { Product } from '@/types/product';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8">
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">No products found in the database.</p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Add Your First Product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-3.5">Product</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Price</th>
              <th className="px-6 py-3.5">Stock</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Created</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-zinc-50/75 dark:hover:bg-zinc-800/40 transition-colors"
              >
                {/* Product Name & Thumbnail */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                      <Image
                        src={product.image_url || '/images/product-placeholder.svg'}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-zinc-400 truncate max-w-xs">{product.slug}</p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {product.category || '—'}
                </td>

                {/* Price */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatPrice(product.price)}
                  </div>
                  {product.compare_at_price && (
                    <div className="text-xs text-zinc-400 line-through">
                      {formatPrice(product.compare_at_price)}
                    </div>
                  )}
                </td>

                {/* Stock */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded ${
                      product.stock > 10
                        ? 'text-zinc-700 bg-zinc-100 dark:text-zinc-300 dark:bg-zinc-800'
                        : product.stock > 0
                        ? 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/50'
                        : 'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950/50'
                    }`}
                  >
                    {product.stock} in stock
                  </span>
                </td>

                {/* Status Toggle */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <ToggleActiveButton productId={product.id} isActive={product.is_active} />
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                  {formatDate(product.created_at)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-xs font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
