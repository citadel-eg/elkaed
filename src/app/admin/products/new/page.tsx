import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = {
  title: 'إضافة منتج جديد | لوحة تحكم القائد',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6 text-start" dir="rtl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-alexandria text-muted-text">
        <Link href="/admin/products" className="hover:text-gold transition-colors">
          المنتجات
        </Link>
        <span>/</span>
        <span className="text-[#1F1F1F] font-bold">منتج جديد</span>
      </div>

      <div>
        <h1 className="font-marhey font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
          إضافة منتج جديد
        </h1>
        <p className="font-alexandria text-xs text-muted-text mt-1">
          أدخل بيانات المنتج، الأسعار، المخزون، المواصفات، وارفع الصور
        </p>
      </div>

      <ProductForm isEditing={false} />
    </div>
  );
}
