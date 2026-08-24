import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { ProductTable } from '@/components/admin/ProductTable';
import type { Product } from '@/types/product';

export const metadata = {
  title: 'إدارة المنتجات | لوحة تحكم القائد',
};

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = createAdminClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin products:', error.message || error);
  }

  const productList: Product[] = products || [];

  return (
    <div className="space-y-6 text-start" dir="rtl">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-marhey font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
            المنتجات ({productList.length})
          </h1>
          <p className="font-alexandria text-xs text-muted-text mt-1">
            إدارة المخزون، الأسعار، المواصفات، وحالة الظهور في المتجر
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-xs shadow-md shadow-gold/20 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <span>+ إضافة منتج جديد</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl font-alexandria text-xs text-red-700">
          <p className="font-bold">حدث خطأ أثناء تحميل المنتجات من قاعدة البيانات</p>
          <p className="mt-0.5">{error.message}</p>
        </div>
      )}

      {/* Products Table */}
      <ProductTable products={productList} />
    </div>
  );
}
