'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { toggleProductActive, toggleProductFeatured, deleteProduct } from '@/app/admin/products/actions';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleToggleActive = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleProductActive(id, current);
    });
  };

  const handleToggleFeatured = (id: string, current: boolean) => {
    startTransition(async () => {
      await toggleProductFeatured(id, current);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteProduct(id);
      setDeleteConfirmId(null);
    });
  };

  return (
    <div className="space-y-4 text-start" dir="rtl">
      {/* Top Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-border-light shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم أو الماركة..."
            className="w-full h-10 pr-9 pl-4 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] placeholder-muted-text focus:outline-none focus:border-gold transition-colors"
          />
          <svg
            className="w-4 h-4 text-muted-text absolute right-3 top-3 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 bg-[#FCFBF8] border border-[#DCD4CA] rounded-xl font-alexandria text-xs text-[#1F1F1F] focus:outline-none focus:border-gold transition-colors cursor-pointer"
          >
            <option value="all">كافة الأقسام ({products.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Container */}
      <div className="bg-white border border-border-light rounded-2xl shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="font-alexandria font-semibold text-sm text-[#1F1F1F]">
              لا توجد منتجات مطابقة للبحث
            </p>
            <p className="font-alexandria text-xs text-muted-text">
              جرب تغيير معايير البحث أو إضافة منتج جديد.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse font-alexandria text-xs">
              <thead>
                <tr className="bg-[#F8F5F0] border-b border-border-light text-muted-text font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-start">المنتج</th>
                  <th className="py-3.5 px-4 text-start">القسم / الماركة</th>
                  <th className="py-3.5 px-4 text-start">السعر</th>
                  <th className="py-3.5 px-4 text-center">المخزون</th>
                  <th className="py-3.5 px-4 text-center">الفروع</th>
                  <th className="py-3.5 px-4 text-center">مميز</th>
                  <th className="py-3.5 px-4 text-center">الحالة</th>
                  <th className="py-3.5 px-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EEE8]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FCFBF8] transition-colors">
                    {/* Image & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl bg-gold-light border border-border-light overflow-hidden shrink-0">
                          <Image
                            src={p.image_url || '/images/product-placeholder.svg'}
                            alt={p.name}
                            fill
                            sizes="44px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="font-bold text-xs text-[#1F1F1F] hover:text-gold transition-colors line-clamp-1"
                          >
                            {p.name}
                          </Link>
                          <span className="font-mono text-[10px] text-muted-text block" dir="ltr">
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Brand */}
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#F2EEE8] text-[#1F1F1F] font-medium text-[11px]">
                        {p.category || 'غير محدد'}
                      </span>
                      {p.brand && (
                        <span className="block text-[10px] text-muted-text mt-0.5">
                          {p.brand}
                        </span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-[#1F1F1F]">
                      {p.price.toLocaleString('ar-EG')} ج.م
                      {p.compare_at_price && p.compare_at_price > p.price && (
                        <span className="block text-[10px] font-normal text-muted-text line-through">
                          {p.compare_at_price.toLocaleString('ar-EG')} ج.م
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          p.stock > 5
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.stock > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {p.stock} قطعة
                      </span>
                    </td>

                    {/* Branches */}
                    <td className="py-3 px-4 text-center">
                      <span className="text-[11px] text-[#6B635B]">
                        {p.available_branches === 'mahalla'
                          ? 'المحلة'
                          : p.available_branches === 'samanoud'
                          ? 'سمنود'
                          : 'كافة الفروع'}
                      </span>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p.id, p.is_featured)}
                        disabled={isPending}
                        className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer ${
                          p.is_featured
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-zinc-100 text-zinc-400 hover:text-amber-500'
                        }`}
                        title={p.is_featured ? 'مميز بالرئيسية' : 'اضغط للتمييز'}
                      >
                        ★
                      </button>
                    </td>

                    {/* Active Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(p.id, p.is_active)}
                        disabled={isPending}
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] transition-colors cursor-pointer ${
                          p.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {p.is_active ? 'نشط' : 'معطل'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-1.5 rounded-lg bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] transition-colors"
                          title="تعديل المنتج"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>

                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          title="حذف المنتج"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border-light rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-marhey font-bold text-lg text-[#1F1F1F]">
                تأكيد حذف المنتج
              </h3>
              <p className="font-alexandria text-xs text-muted-text">
                هل أنت متأكد من رغبتك في حذف هذا المنتج نهائيًا من قاعدة البيانات؟
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isPending}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-alexandria font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {isPending ? 'جاري الحذف...' : 'نعم، احذف'}
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isPending}
                className="flex-1 h-11 bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] font-alexandria font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
