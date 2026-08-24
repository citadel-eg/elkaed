'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createProduct, updateProduct, type ActionState } from '@/app/admin/products/actions';
import type { Product } from '@/types/product';

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  // Bind product ID if editing
  const actionFunction = isEditing && product
    ? updateProduct.bind(null, product.id)
    : createProduct;

  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    actionFunction,
    null
  );

  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <form action={formAction} className="space-y-6 max-w-4xl">
      {state?.error && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300"
        >
          <p className="font-semibold">{state.error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          Basic Information
        </h2>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Product Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product?.name || ''}
            placeholder="e.g. Premium Cotton T-Shirt"
            disabled={isPending}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 disabled:opacity-50"
          />
          {state?.fieldErrors?.name && (
            <p className="text-xs text-red-600 mt-1">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Slug (Optional - auto-generated if blank)
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              defaultValue={product?.slug || ''}
              placeholder="e.g. premium-cotton-t-shirt"
              disabled={isPending}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 disabled:opacity-50"
            />
            {state?.fieldErrors?.slug && (
              <p className="text-xs text-red-600 mt-1">{state.fieldErrors.slug[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              defaultValue={product?.category || ''}
              placeholder="e.g. Apparel, Footwear, Accessories"
              disabled={isPending}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={product?.description || ''}
            placeholder="Detailed description of the product..."
            disabled={isPending}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Pricing and Inventory */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          Pricing & Inventory
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Price ($) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product?.price !== undefined ? product.price : ''}
              placeholder="29.99"
              disabled={isPending}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 disabled:opacity-50"
            />
            {state?.fieldErrors?.price && (
              <p className="text-xs text-red-600 mt-1">{state.fieldErrors.price[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="compare_at_price"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Compare At Price ($)
            </label>
            <input
              id="compare_at_price"
              name="compare_at_price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.compare_at_price ?? ''}
              placeholder="39.99"
              disabled={isPending}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Stock Quantity *
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              required
              defaultValue={product?.stock !== undefined ? product.stock : 0}
              placeholder="100"
              disabled={isPending}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 disabled:opacity-50"
            />
            {state?.fieldErrors?.stock && (
              <p className="text-xs text-red-600 mt-1">{state.fieldErrors.stock[0]}</p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              value="true"
              defaultChecked={product ? product.is_active : true}
              disabled={isPending}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
            />
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Active product (visible to customers in store)
            </span>
          </label>
        </div>
      </div>

      {/* Media / Image Upload */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          Product Image
        </h2>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          {imagePreview ? (
            <div className="relative w-36 h-36 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
              <Image
                src={imagePreview}
                alt="Product preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-36 h-36 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-400 flex-shrink-0">
              No Image
            </div>
          )}

          <div className="flex-1 space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {imagePreview ? 'Replace Image' : 'Upload Image'}
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isPending}
              className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 dark:file:bg-zinc-800 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 cursor-pointer"
            />
            <p className="text-xs text-zinc-500">
              Supports JPEG, PNG, WebP, SVG, GIF. Stored securely in Supabase Storage.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
        >
          {isPending
            ? isEditing
              ? 'Saving Changes...'
              : 'Creating Product...'
            : isEditing
            ? 'Save Product Changes'
            : 'Create Product'}
        </button>

        <Link
          href="/admin/products"
          className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
