'use client';

import { useTransition, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { ProductsGridSkeleton } from '@/components/ui/ProductCardSkeleton';
import { WHATSAPP_NUMBER, getWhatsAppUrl } from '@/lib/constants';
import type { Product } from '@/types/product';

interface ProductsCatalogProps {
  products?: Product[];
  initialProducts?: Product[];
  totalCount?: number;
  availableBrands?: string[];
  currentCategory?: string;
  initialCategory?: string;
  currentBrand?: string;
  currentSearch?: string;
  currentSort?: string;
  currentInStock?: boolean;
  currentOffers?: boolean;
}

const CATEGORIES = [
  { id: 'all', name: 'كل الأقسام' },
  { id: 'smartphones', name: 'الهواتف الذكية' },
  { id: 'laptops', name: 'اللابتوبات' },
  { id: 'tablets', name: 'التابلت' },
  { id: 'wearables', name: 'الساعات الذكية' },
  { id: 'audio', name: 'السماعات' },
  { id: 'accessories', name: 'إكسسوارات الهواتف' },
  { id: 'chargers', name: 'شواحن' },
  { id: 'cables', name: 'الكابلات' },
  { id: 'powerbanks', name: 'الباور بانك' },
  { id: 'cases', name: 'حافظات الهواتف' },
  { id: 'screen-protectors', name: 'واقيات الشاشة' },
  { id: 'laptop-accessories', name: 'إكسسوارات اللابتوب' },
  { id: 'social-media-creator', name: 'أدوات صناعة المحتوى' },
];

export function ProductsCatalog({
  products = [],
  initialProducts = [],
  totalCount,
  availableBrands = [],
  currentCategory,
  initialCategory = 'all',
  currentBrand = 'all',
  currentSearch = '',
  currentSort = 'featured',
  currentInStock = false,
  currentOffers = false,
}: ProductsCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const effectiveProducts = products ?? initialProducts;
  const effectiveCategory = currentCategory ?? initialCategory;
  const effectiveTotalCount = totalCount ?? effectiveProducts.length;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [prevSearch, setPrevSearch] = useState(currentSearch);
  const isInitialMount = useRef(true);

  // Sync search input if currentSearch prop changes (React recommended pattern without useEffect)
  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch);
    setSearchInput(currentSearch);
  }

  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');

    if (updates && typeof updates === 'object') {
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all' || value === 'false') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
    }

    startTransition(() => {
      const queryStr = params.toString();
      router.push(queryStr ? `${pathname}?${queryStr}` : pathname, { scroll: false });
    });
  }, [searchParams, pathname, router]);

  // Debounced search effect (350ms delay)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      const currentQuery = searchParams.get('search') || '';
      if (trimmed !== currentQuery) {
        updateFilters({ search: trimmed || null });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, searchParams, updateFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const activeFiltersCount = [
    effectiveCategory !== 'all',
    currentBrand !== 'all',
    currentInStock,
    currentOffers,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
      {/* Mobile Filters Toggle Button (Shown on mobile only) */}
      <div className="lg:hidden w-full mb-6">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-between gap-3 p-4 bg-white border border-[#E2D9CD] rounded-xl shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="font-alexandria font-bold text-[14px] text-[#1F1F1F]">
              تصفية الأقسام والعلامات
            </span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-gold text-white text-[11px] font-bold">
                {activeFiltersCount} مفعل
              </span>
            )}
          </div>
          <div className="inline-flex items-center gap-1.5 text-[13px] font-alexandria font-bold text-gold">
            <span>{mobileFiltersOpen ? 'إغلاق الفلاتر' : 'عرض الفلاتر'}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                mobileFiltersOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-14">
        {/* 1. Sidebar Filters (Collapsible on mobile, always visible on desktop) */}
        <aside
          className={`${
            mobileFiltersOpen ? 'block' : 'hidden'
          } lg:block w-full lg:w-72 shrink-0 space-y-6 text-start transition-all`}
        >
          {/* Category Filter Group (Exact Node 18:3253) */}
          <div className="space-y-2">
            <h3 className="font-alexandria font-bold text-[14px] text-gold-dark">
              القسم
            </h3>
            <div className="relative">
              <select
                value={effectiveCategory}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="w-full appearance-none bg-white border border-[#E2D9CD] h-12 pr-4 pl-10 rounded-lg text-[#1F1F1F] font-alexandria text-[14px] focus:outline-none focus:border-gold cursor-pointer shadow-xs text-start"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1F1F1F]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Brand Filter Group (Exact Node 18:3262) */}
          <div className="space-y-2">
            <h3 className="font-alexandria font-bold text-[14px] text-gold-dark">
              العلامة
            </h3>
            <div className="relative">
              <select
                value={currentBrand}
                onChange={(e) => updateFilters({ brand: e.target.value })}
                className="w-full appearance-none bg-white border border-[#E2D9CD] h-12 pr-4 pl-10 rounded-lg text-[#1F1F1F] font-alexandria text-[14px] focus:outline-none focus:border-gold cursor-pointer shadow-xs text-start"
              >
                <option value="all">كل العلامات</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1F1F1F]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Options Checkboxes (Exact Node 18:3271) */}
          <div className="space-y-3 pt-1">
            <h3 className="font-alexandria font-bold text-[14px] text-gold-dark">
              خيارات
            </h3>
            <label className="flex items-center gap-3 cursor-pointer text-[#4A443D] text-[14px] font-alexandria select-none group">
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={(e) =>
                  updateFilters({ inStock: e.target.checked ? 'true' : null })
                }
                className="w-4 h-4 rounded border-zinc-300 text-gold focus:ring-gold accent-gold cursor-pointer"
              />
              <span className="group-hover:text-[#1F1F1F] transition-colors">المتوفر فقط</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-[#4A443D] text-[14px] font-alexandria select-none group">
              <input
                type="checkbox"
                checked={currentOffers}
                onChange={(e) =>
                  updateFilters({ offers: e.target.checked ? 'true' : null })
                }
                className="w-4 h-4 rounded border-zinc-300 text-gold focus:ring-gold accent-gold cursor-pointer"
              />
              <span className="group-hover:text-[#1F1F1F] transition-colors">العروض فقط</span>
            </label>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={handleResetFilters}
            className="w-full text-center font-alexandria font-bold text-[14px] text-gold hover:text-gold-hover transition-colors cursor-pointer py-1"
          >
            إعادة ضبط الفلاتر
          </button>

          {/* WhatsApp Custom Inquiry Box (Exact Figma Node 18:3289) */}
          <div className="bg-[#1F1F1F] rounded-3xl p-6 text-white text-start space-y-4 shadow-xl">
            <div className="space-y-2">
              <h4 className="font-alexandria font-bold text-[14px] text-white">
                مش لاقي اللي بتدور عليه؟
              </h4>
              <p className="font-alexandria font-normal text-[12px] text-white/80 leading-6">
                اطلب ترشيحًا يناسب احتياجك على واتساب.
              </p>
            </div>

            <a
              href={getWhatsAppUrl('مرحبًا القائد، أبحث عن منتج معين غير معروض.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[20px] bg-gold hover:bg-gold-hover text-white text-[12px] font-alexandria font-bold transition-all shadow-md cursor-pointer"
            >
              <span>تواصل معانا</span>
              <WhatsAppIcon className="w-4 h-4 text-white" />
            </a>
          </div>
        </aside>

        {/* 2. Main Content Area (Products Grid & Top Controls) */}
        <div className="flex-1 w-full space-y-8">
          {/* Top Bar Controls (Exact Figma Node 19:3812) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 lg:gap-13 w-full">
              {/* Search Pill Input (Exact Node 19:3787) */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex-1 w-full bg-white border border-[#E2D9CD] h-12 px-4 rounded-full flex items-center gap-3 shadow-xs hover:border-gold focus-within:border-gold transition-colors"
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="ابحث هنا"
                  className="flex-1 bg-transparent text-[#1F1F1F] placeholder-muted-text text-[14px] font-alexandria focus:outline-none text-start"
                />
                <button
                  type="submit"
                  aria-label="بحث"
                  className="text-muted-text hover:text-gold transition-colors shrink-0 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>

              {/* Sort Dropdown Block (Exact Node 19:3802) */}
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                <span className="font-alexandria font-normal text-[14px] text-muted-text whitespace-nowrap">
                  ترتيب:
                </span>
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={currentSort}
                    onChange={(e) => updateFilters({ sort: e.target.value })}
                    className="w-full sm:w-auto appearance-none bg-white border border-[#E2D9CD] h-12 pr-4 pl-10 rounded-lg text-[#1F1F1F] font-alexandria text-[14px] focus:outline-none focus:border-gold cursor-pointer shadow-xs min-w-44 text-start"
                  >
                    <option value="featured">المميزة أولًا</option>
                    <option value="price-asc">السعر: من الأقل للأعلى</option>
                    <option value="price-desc">السعر: من الأعلى للأقل</option>
                    <option value="newest">الأحدث وصولًا</option>
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#1F1F1F]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Count Indicator */}
            <div className="flex items-center justify-between text-start pt-1">
              <span className="font-alexandria font-normal text-[14px] text-muted-text">
                {effectiveTotalCount} منتج
              </span>
            </div>
          </div>

          {/* Products Grid or Shimmer Loading */}
          {isPending ? (
            <ProductsGridSkeleton count={6} />
          ) : effectiveProducts.length === 0 ? (
            <div className="text-center py-20 border border-[#E2D9CD] rounded-2xl bg-white p-8 space-y-4 shadow-sm">
              <p className="font-marhey text-xl font-bold text-[#1F1F1F]">
                لا توجد منتجات تطابق خيارات البحث
              </p>
              <p className="font-alexandria text-sm text-muted-text max-w-md mx-auto">
                جرب تغيير كلمات البحث أو إعادة ضبط الفلاتر، أو تواصل معنا عبر واتساب للمساعدة في طلب أي منتج.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-sm shadow transition-all cursor-pointer"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {effectiveProducts.map((product) => {
                const productWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `مرحبًا القائد، أود الاستفسار عن تفاصيل وسعر: ${product.name}`
                )}`;

                return (
                  <div
                    key={product.id}
                    className="group bg-[#F2EEE8] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block relative h-72 w-full overflow-hidden bg-transparent"
                    >
                      <Image
                        src={product.image_url || '/images/product-placeholder.svg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-start">
                      <div className="space-y-1">
                        <p className="font-alexandria font-bold text-[10px] tracking-[1.5px] text-[#A78463] uppercase">
                          {product.brand || product.category || 'القائد'}
                        </p>
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-alexandria font-bold text-[18px] text-[#1F1F1F] group-hover:text-gold transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="font-alexandria font-normal text-[14px] text-muted-text line-clamp-2 leading-6">
                          {product.description ||
                            'أحدث التقنيات والمواصفات المعتمدة بأفضل الأسعار.'}
                        </p>
                      </div>

                      {/* Stock & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-marhey font-semibold text-[24px] text-[#1F1F1F]">
                          {product.price.toLocaleString('ar-EG')} ج.م
                        </span>
                        <div className="flex items-center gap-1.5 text-[12px] font-alexandria font-normal text-[#6B635B]">
                          <span className="w-2 h-2 rounded-full bg-[#4B8B5A]" />
                          <span>متوفر</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={productWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[20px] bg-gold hover:bg-gold-hover text-white text-[13px] font-alexandria font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span className="whitespace-nowrap">اطلب</span>
                          <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                        </a>

                        <Link
                          href={`/products/${product.id}`}
                          className="h-10 px-4 inline-flex items-center justify-center rounded-[20px] border border-[#DCD4CA] hover:border-[#1F1F1F] text-[#1F1F1F] text-[13px] font-alexandria font-bold transition-colors whitespace-nowrap shrink-0"
                        >
                          التفاصيل
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
