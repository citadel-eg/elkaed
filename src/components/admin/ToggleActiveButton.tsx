'use client';

import { useTransition } from 'react';
import { toggleProductActive } from '@/app/admin/products/actions';

interface ToggleActiveButtonProps {
  productId: string;
  isActive: boolean;
}

export function ToggleActiveButton({ productId, isActive }: ToggleActiveButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleProductActive(productId, isActive);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isActive ? 'Click to deactivate' : 'Click to activate'}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-opacity ${
        isPending ? 'opacity-50' : 'opacity-100'
      } ${
        isActive
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isActive ? 'bg-emerald-500' : 'bg-zinc-400'
        }`}
      />
      {isActive ? 'Active' : 'Inactive'}
    </button>
  );
}
