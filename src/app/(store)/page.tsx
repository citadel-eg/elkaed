import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/store/HeroSection';
import { StatsBar } from '@/components/store/StatsBar';
import { AboutSection } from '@/components/store/AboutSection';
import { CategoriesSection } from '@/components/store/CategoriesSection';
import { FeaturedProductsSection } from '@/components/store/FeaturedProductsSection';
import { BrandLogos } from '@/components/store/BrandLogos';
import { WhyUsSection } from '@/components/store/WhyUsSection';
import { BranchesSection } from '@/components/store/BranchesSection';
import { TestimonialsSection } from '@/components/store/TestimonialsSection';
import { CtaBanner } from '@/components/store/CtaBanner';
import type { Product } from '@/types/product';

export const metadata = {
  title: 'القائد | وجهتك الأولى للتقنية والهواتف والأجهزة الذكية',
  description:
    'متجر القائد للتقنية — موبايلات، لابتوبات، وإكسسوارات أصلية. نختار اللي تحتاجه ونتواصل معك ونوصلهولك بسرعة.',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient();

  let { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(6);

  // Fallback if is_featured or created_at column is not yet present
  if (error && error.code === '42703') {
    const fallback = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(6);
    products = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error('Error fetching featured products:', error.message || error);
  }

  const productList: Product[] = products || [];

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Stats Bar */}
      <StatsBar />

      {/* 3. 01 / عن القائد (About Us) */}
      <AboutSection />

      {/* 4. 02 / استكشف (Categories Dark Grid) */}
      <CategoriesSection />

      {/* 5. 03 / مختارات القائد (Featured Products) */}
      <FeaturedProductsSection products={productList} />

      {/* 6. Brand Logos Strip */}
      <BrandLogos />

      {/* 7. 04 / لماذا القائد (Why Choose Us) */}
      <WhyUsSection />

      {/* 8. 05 / زرنا في أقرب فرع (Branches) */}
      <BranchesSection />

      {/* 9. 06 / ثقة تسعدنا كل يوم (Testimonials) */}
      <TestimonialsSection />

      {/* 10. Call to Action Banner */}
      <CtaBanner />
    </div>
  );
}
