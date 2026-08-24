'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import type { Product } from '@/types/product';

interface ProductDetailsViewProps {
  product: Product;
  suggestedAccessories: Product[];
  relatedProducts: Product[];
}

export function ProductDetailsView({
  product,
  suggestedAccessories,
  relatedProducts,
}: ProductDetailsViewProps) {
  // Gallery images from DB
  const mainImage = product.image_url || '/images/product-placeholder.svg';
  const galleryImages = (product.gallery_images && Array.isArray(product.gallery_images) && product.gallery_images.length > 0)
    ? product.gallery_images
    : [mainImage];
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Available colors from DB only (no dummy fallback)
  const availableColors = (product.colors && Array.isArray(product.colors) && product.colors.length > 0)
    ? product.colors
    : [];
  const [selectedColor, setSelectedColor] = useState(availableColors[0]?.name || '');

  // Specifications from DB only (no dummy fallback)
  const specs = product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0
    ? Object.entries(product.specs).map(([label, value]) => ({ label, value: String(value) }))
    : [];

  // Highlights from DB only (no dummy fallback)
  const highlights = (product.highlights && Array.isArray(product.highlights) && product.highlights.length > 0)
    ? product.highlights
    : [];

  const hasHighlights = highlights.length > 0;
  const hasSpecs = specs.length > 0;

  const currentWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `مرحبًا القائد، أود الاستفسار وطلب شراء: ${product.name}${selectedColor ? ` (اللون: ${selectedColor})` : ''} بسعر ${product.price.toLocaleString('ar-EG')} ج.م`
  )}`;

  return (
    <div className="w-full bg-[#FCFBF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-14 space-y-16 lg:space-y-20">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-[13px] text-muted-text font-alexandria">
          <Link href="/" className="hover:text-gold transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold transition-colors">
            المنتجات
          </Link>
          <span>/</span>
          <span className="text-[#1F1F1F] font-bold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* 1. Main Product Showcase (Exact Figma Node 19:4289) */}
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-20 justify-between">
          {/* Right Column in RTL: Details & Purchasing Info */}
          <div className="flex-1 w-full space-y-6 text-start order-2 lg:order-1">
            <div className="space-y-2">
              {product.brand && (
                <span className="font-alexandria font-bold text-[14px] text-gold-dark uppercase tracking-wider block">
                  {product.brand}
                </span>
              )}
              <h1 className="font-marhey font-normal text-[36px] sm:text-[44px] lg:text-[48px] text-[#1F1F1F] leading-tight">
                {product.name}
              </h1>
              {product.description && (
                <p className="font-alexandria font-normal text-[16px] sm:text-[18px] text-[#48433E] leading-relaxed pt-1">
                  {product.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="pt-2">
              <span className="font-marhey font-semibold text-[40px] sm:text-[52px] text-[#1F1F1F] block leading-none">
                {product.price.toLocaleString('ar-EG')} ج.م
              </span>
            </div>

            {/* Colors Section (Rendered only when DB has colors) */}
            {availableColors.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="font-alexandria font-bold text-[12px] text-[#9B8B78] block">
                  الألوان المتاحة
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {availableColors.map((col) => {
                    const isSelected = selectedColor === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        className={`inline-flex items-center gap-2 h-11 px-4 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gold-light border-gold text-[#1F1F1F] shadow-xs'
                            : 'bg-white border-[#E2D9CD] text-[#1F1F1F] hover:border-gold'
                        }`}
                      >
                        <span className="font-alexandria text-[13px] font-normal">
                          {col.name}
                        </span>
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WhatsApp Inquiry / Order Button */}
            <div className="pt-4">
              <a
                href={currentWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 h-14 px-6 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[16px] shadow-lg shadow-gold/20 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>استفسر عن المنتج</span>
                <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
              </a>
            </div>
          </div>

          {/* Left Column in RTL: Product Images Gallery */}
          <div className="w-full lg:w-130 shrink-0 space-y-4 order-1 lg:order-2">
            {/* Main Featured Image Card */}
            <div className="relative h-96 sm:h-120 w-full rounded-2xl bg-[#F2EEE8] overflow-hidden flex items-center justify-center p-6 group">
              <Image
                src={galleryImages[selectedImageIdx] || mainImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Thumbnails Row (Rendered only if > 1 image in DB) */}
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative h-20 rounded-lg overflow-hidden bg-white transition-all cursor-pointer ${
                      selectedImageIdx === idx
                        ? 'border-2 border-gold shadow-sm'
                        : 'border border-[#E2D9CD] hover:border-gold opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. Highlights & Specifications (Exact Figma Node 22:13 - Specs on Right, Highlights on Left in RTL) */}
        {(hasHighlights || hasSpecs) && (
          <div className="pt-10 border-t border-border-light">
            <div className={`grid grid-cols-1 ${hasHighlights && hasSpecs ? 'lg:grid-cols-2' : ''} gap-12 lg:gap-20 items-start`}>
              {/* 1. Specifications Table (المواصفات - Right Side in RTL) */}
              {hasSpecs && (
                <div className="space-y-6 text-start">
                  <h2 className="font-marhey font-normal text-[28px] sm:text-[30px] text-[#1F1F1F]">
                    المواصفات
                  </h2>
                  <div className="divide-y divide-border-light border-t border-border-light">
                    {specs.map((item, idx) => (
                      <div key={idx} className="py-4 flex items-center justify-between gap-4">
                        <span className="font-alexandria font-normal text-[14px] sm:text-[15px] text-[#8A7F72] shrink-0 text-start">
                          {item.label}
                        </span>
                        <span className="font-alexandria font-semibold text-[14px] sm:text-[15px] text-[#1F1F1F] text-end">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Highlights (أبرز المميزات - Left Side in RTL) */}
              {hasHighlights && (
                <div className="space-y-6 text-start">
                  <h2 className="font-marhey font-normal text-[28px] sm:text-[30px] text-[#1F1F1F]">
                    أبرز المميزات
                  </h2>
                  <ul className="space-y-4">
                    {highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-3 text-start">
                        <span className="text-gold font-bold text-base select-none">◆</span>
                        <span className="font-alexandria font-normal text-[15px] sm:text-[16px] text-[#48433E]">
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Recommended Accessories (Exact Figma Node 22:103) */}
        {suggestedAccessories.length > 0 && (
          <div className="space-y-8 pt-10 border-t border-border-light">
            <div className="text-start">
              <h2 className="font-marhey font-normal text-[28px] sm:text-[30px] text-[#1F1F1F]">
                إكسسوارات مقترحة
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {suggestedAccessories.map((item) => {
                const askPriceWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `مرحبًا القائد، أود الاستفسار عن تفاصيل وسعر: ${item.name}`
                )}`;

                return (
                  <div
                    key={item.id}
                    className="group bg-[#F2EEE8] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <Link
                      href={`/products/${item.id}`}
                      className="block relative h-64 sm:h-72 w-full overflow-hidden bg-transparent"
                    >
                      <Image
                        src={item.image_url || '/images/product-placeholder.svg'}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-start">
                      <div className="space-y-1">
                        <p className="font-alexandria font-bold text-[10px] tracking-[1.5px] text-[#A78463] uppercase">
                          {item.brand || item.category || 'القائد'}
                        </p>
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-alexandria font-bold text-[18px] text-[#1F1F1F] group-hover:text-gold transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="font-alexandria font-normal text-[14px] text-muted-text line-clamp-2 leading-6">
                          {item.description || 'أحدث التقنيات والمواصفات المعتمدة بأفضل الأسعار.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-marhey font-semibold text-[22px] text-[#1F1F1F]">
                          {item.price.toLocaleString('ar-EG')} ج.م
                        </span>
                        <div className="flex items-center gap-1.5 text-[12px] font-alexandria font-normal text-[#6B635B]">
                          <span className="w-2 h-2 rounded-full bg-[#4B8B5A]" />
                          <span>متوفر</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={askPriceWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[20px] bg-gold hover:bg-gold-hover text-white text-[13px] font-alexandria font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span className="whitespace-nowrap">اطلب</span>
                          <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                        </a>

                        <Link
                          href={`/products/${item.id}`}
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
          </div>
        )}

        {/* 4. Related Products (Exact Figma Node 22:163) */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8 pt-10 border-t border-border-light">
            <div className="text-start">
              <h2 className="font-marhey font-normal text-[28px] sm:text-[30px] text-[#1F1F1F]">
                منتجات ذات صلة
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedProducts.map((item) => {
                const askPriceWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `مرحبًا القائد، أود الاستفسار عن تفاصيل وسعر: ${item.name}`
                )}`;

                return (
                  <div
                    key={item.id}
                    className="group bg-[#F2EEE8] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <Link
                      href={`/products/${item.id}`}
                      className="block relative h-64 sm:h-72 w-full overflow-hidden bg-transparent"
                    >
                      <Image
                        src={item.image_url || '/images/product-placeholder.svg'}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-start">
                      <div className="space-y-1">
                        <p className="font-alexandria font-bold text-[10px] tracking-[1.5px] text-[#A78463] uppercase">
                          {item.brand || item.category || 'القائد'}
                        </p>
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-alexandria font-bold text-[18px] text-[#1F1F1F] group-hover:text-gold transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="font-alexandria font-normal text-[14px] text-muted-text line-clamp-2 leading-6">
                          {item.description || 'أحدث التقنيات والمواصفات المعتمدة بأفضل الأسعار.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-marhey font-semibold text-[22px] text-[#1F1F1F]">
                          {item.price.toLocaleString('ar-EG')} ج.م
                        </span>
                        <div className="flex items-center gap-1.5 text-[12px] font-alexandria font-normal text-[#6B635B]">
                          <span className="w-2 h-2 rounded-full bg-[#4B8B5A]" />
                          <span>متوفر</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={askPriceWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-[20px] bg-gold hover:bg-gold-hover text-white text-[13px] font-alexandria font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span className="whitespace-nowrap">اطلب</span>
                          <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                        </a>

                        <Link
                          href={`/products/${item.id}`}
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
          </div>
        )}
      </div>
    </div>
  );
}
