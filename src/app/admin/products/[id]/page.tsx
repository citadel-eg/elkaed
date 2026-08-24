import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { ProductForm } from '@/components/admin/ProductForm';
import type { Product } from '@/types/product';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata() {
  return {
    title: 'تعديل المنتج | لوحة تحكم القائد',
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

  const typedProduct = product as Product;

  return (
    <div className="space-y-6 text-start" dir="rtl">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-alexandria text-muted-text">
          <Link href="/admin/products" className="hover:text-gold transition-colors">
            المنتجات
          </Link>
          <span>/</span>
          <span className="text-[#1F1F1F] font-bold">تعديل: {typedProduct.name}</span>
        </div>

        <Link
          href={`/products/${typedProduct.slug || typedProduct.id}`}
          target="_blank"
          className="font-alexandria text-xs font-medium text-gold hover:underline inline-flex items-center gap-1"
        >
          <span>عرض في المتجر</span>
          <span>↗</span>
        </Link>
      </div>

      <div>
        <h1 className="font-marhey font-bold text-2xl sm:text-3xl text-[#1F1F1F]">
          تعديل المنتج: {typedProduct.name}
        </h1>
        <p className="font-alexandria text-xs text-muted-text mt-1">
          تعديل الأسعار، المخزون، الألوان، المواصفات، أو استبدال صور المنتج
        </p>
      </div>

      <ProductForm product={typedProduct} isEditing={true} />
    </div>
  );
}
