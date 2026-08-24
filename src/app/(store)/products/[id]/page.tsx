import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductDetailsView } from '@/components/store/ProductDetailsView';
import type { Product } from '@/types/product';
import type { Metadata } from 'next';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  let query = supabase.from('products').select('*').eq('is_active', true);
  if (isUUID) {
    query = query.eq('id', id);
  } else {
    query = query.eq('slug', id);
  }

  const { data: product } = await query.single();

  if (!product) {
    return { title: 'المنتج غير متوفر | القائد للتقنية' };
  }

  const title = `${product.name} | متجر القائد للتقنية`;
  const description =
    product.description ||
    `اشتري ${product.name} بأفضل سعر من متجر القائد للتقنية مع ضمان معتمد وخدمة توصيل سريعة.`;
  const imageUrl = product.image_url || '/images/product-placeholder.svg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
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

  // 1. Fetch Suggested Accessories
  const { data: accessoriesData } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .neq('id', typedProduct.id)
    .in('category', ['accessories', 'audio', 'chargers', 'cables', 'cases', 'powerbanks'])
    .limit(3);

  // 2. Fetch Related Products
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

  // Structured Data Schema for Google Rich Snippets
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: typedProduct.name,
    image: typedProduct.image_url ? [typedProduct.image_url] : [],
    description: typedProduct.description || `${typedProduct.name} من متجر القائد للتقنية`,
    brand: {
      '@type': 'Brand',
      name: typedProduct.brand || 'القائد للتقنية',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EGP',
      price: typedProduct.price,
      availability:
        typedProduct.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'متجر القائد للتقنية',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailsView
        product={typedProduct}
        suggestedAccessories={suggestedAccessories}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
