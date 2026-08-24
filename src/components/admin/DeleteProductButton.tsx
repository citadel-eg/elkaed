'use client';

import { useState, useTransition } from 'react';
import { deleteProduct } from '@/app/admin/products/actions';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteProduct(productId);
      if (!res.success) {
        setError(res.error || 'Failed to delete');
        setIsConfirming(false);
      }
    });
  };

  if (isConfirming) {
    return (
      <div className="inline-flex items-center gap-1.5" title={`Delete "${productName}"?`}>
        <span className="text-xs text-red-600 font-medium">Delete {productName}?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? '...' : 'Yes'}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isPending}
          className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded hover:bg-zinc-300 cursor-pointer"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsConfirming(true)}
        disabled={isPending}
        className="text-xs text-red-600 hover:text-red-800 dark:hover:text-red-400 font-medium cursor-pointer"
      >
        Delete
      </button>
      {error && <span className="block text-[11px] text-red-600 mt-1">{error}</span>}
    </div>
  );
}
