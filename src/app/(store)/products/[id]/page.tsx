import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductDetailsView } from '@/components/store/ProductDetailsView';
import type { Product } from '@/types/product';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  let query = supabase.from('products').select('name, description').eq('is_active', true);
  if (isUUID) {
    query = query.eq('id', id);
  } else {
    query = query.eq('slug', id);
  }

  const { data: product } = await query.single();

  if (!product) {
    return { title: 'المنتج غير متوفر | القائد للتقنية' };
  }

  return {
    title: `${product.name} | القائد للتقنية`,
    description: product.description || undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  let query = supabase.from('products').select('*').eq('is_active', true);
  if (isUUID) {
    query = query.eq('id', id);
  } else {
    query = query.eq('slug', id);
  }

  const { data: product, error } = await query.single();

  if (error || !product) {
    notFound();
  }

  const typedProduct = product as Product;

  // 1. Fetch Suggested Accessories (accessories, audio, chargers, cables, cases, powerbanks)
  const { data: accessoriesData } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .neq('id', typedProduct.id)
    .in('category', ['accessories', 'audio', 'chargers', 'cables', 'cases', 'powerbanks'])
    .limit(3);

  // 2. Fetch Related Products (same brand or same category or newest)
  let relatedQuery = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .neq('id', typedProduct.id);

  if (typedProduct.category) {
    relatedQuery = relatedQuery.eq('category', typedProduct.category);
  }

  const { data: relatedData } = await relatedQuery.limit(3);

  const suggestedAccessories = (accessoriesData && accessoriesData.length > 0)
    ? (accessoriesData as Product[])
    : [];

  const relatedProducts = (relatedData && relatedData.length > 0)
    ? (relatedData as Product[])
    : [];

  return (
    <ProductDetailsView
      product={typedProduct}
      suggestedAccessories={suggestedAccessories}
      relatedProducts={relatedProducts}
    />
  );
}
