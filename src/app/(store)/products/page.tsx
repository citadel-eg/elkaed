import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { CtaBanner } from '@/components/store/CtaBanner';
import { ProductsCatalog } from '@/components/store/ProductsCatalog';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import type { Product } from '@/types/product';

export const metadata = {
  title: 'تشكيلة المنتجات | متجر القائد للتقنية',
  description: 'اكتشف تشكيلة متجر القائد — الهواتف الذكية، اللابتوبات، الإكسسوارات، الشواحن، والباور بانك.',
};

export const revalidate = 0;

interface StoreProductsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    search?: string;
    sort?: string;
    inStock?: string;
    offers?: string;
  }>;
}

export default async function StoreProductsPage({ searchParams }: StoreProductsPageProps) {
  const {
    category = 'all',
    brand = 'all',
    search = '',
    sort = 'featured',
    inStock = 'false',
    offers = 'false',
  } = await searchParams;

  const supabase = await createClient();

  const whatsappHeroUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'مرحبًا القائد، أود ترشيح أجهزة ومنتجات مناسبة لاحتياجي.'
  )}`;

  // 1. Fetch available brands directly from Supabase
  const { data: allBrandsData } = await supabase
    .from('products')
    .select('brand')
    .eq('is_active', true);

  const availableBrands = Array.from(
    new Set((allBrandsData || []).map((p) => p.brand).filter(Boolean))
  ) as string[];

  // 2. Build Supabase query with all filters
  let query = supabase.from('products').select('*', { count: 'exact' }).eq('is_active', true);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (brand && brand !== 'all') {
    query = query.eq('brand', brand);
  }

  if (search && search.trim()) {
    const q = search.trim();
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,brand.ilike.%${q}%`);
  }

  if (inStock === 'true') {
    query = query.gt('stock', 0);
  }

  if (offers === 'true') {
    query = query.not('compare_at_price', 'is', null);
  }

  // 3. Sorting on Supabase
  if (sort === 'price-asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false });
  } else if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    // Featured first, then newest
    query = query
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
  }

  const { data: products, count, error } = await query;

  if (error) {
    console.error('Error querying products from Supabase:', error.message || error);
  }

  const productList: Product[] = products || [];
  const totalCount = count ?? productList.length;

  return (
    <div className="w-full bg-[#FCFBF8]">
      {/* 1. Products Hero Banner (Exact Figma Node 18:2289) */}
      <section className="relative w-full min-h-115 sm:min-h-125 lg:min-h-135 flex items-center overflow-hidden bg-dark-card text-white">
        {/* Background Store Photography */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/hero-store.png"
            alt="تشكيلة منتجات القائد"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-100"
          />
          {/* Exact Figma Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(-87.38deg, rgba(0, 0, 0, 0.8) 0.91%, rgba(0, 0, 0, 0.4) 78.43%, rgba(0, 0, 0, 0) 99.08%)',
            }}
          />
        </div>

        {/* Hero Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-20 flex flex-col items-start text-start gap-6 sm:gap-8">
          {/* Eyebrow with gold divider line */}
          <div className="flex items-center gap-3 w-full">
            <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark whitespace-nowrap">
              المنتجات
            </span>
            <div className="flex-1 h-px bg-gold-dark/70" />
          </div>

          {/* Big Headline in Marhey Font */}
          <div className="space-y-1">
            <h1 className="font-marhey font-semibold text-[38px] sm:text-[56px] lg:text-[76px] text-white leading-[1.15] tracking-tight drop-shadow-md">
              <span className="block">اكتشف</span>
              <span className="block">تشكيلتنا.</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="max-w-lg font-alexandria font-normal text-[15px] sm:text-[18px] lg:text-[22px] text-white/95 leading-relaxed drop-shadow">
            ابحث، فلتر، وقارن براحتك. ولو حابب ترشيح مخصص، فريقنا جاهز على واتساب.
          </p>

          {/* CTA Button */}
          <div className="pt-2 w-full sm:w-auto">
            <a
              href={whatsappHeroUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-6 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[15px] sm:text-[16px] shadow-lg shadow-gold/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>تحدث معنا عبر واتساب</span>
              <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Direct Supabase Query Products Catalog */}
      <ProductsCatalog
        products={productList}
        totalCount={totalCount}
        availableBrands={availableBrands}
        currentCategory={category}
        currentBrand={brand}
        currentSearch={search}
        currentSort={sort}
        currentInStock={inStock === 'true'}
        currentOffers={offers === 'true'}
      />

      {/* 3. Bottom CTA Section */}
      <CtaBanner />
    </div>
  );
}
