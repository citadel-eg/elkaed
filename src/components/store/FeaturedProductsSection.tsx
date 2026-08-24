import Link from "next/link";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/ui/Icons";
import type { Product } from "@/types/product";

interface FeaturedProductsSectionProps {
  products?: Product[];
}

export function FeaturedProductsSection({
  products = [],
}: FeaturedProductsSectionProps) {
  const WHATSAPP_NUMBER = "201063905083";

  // If live backend products exist and have items, map them or fallback to exact figma cards
  const displayItems = products.length > 0 ? products.slice(0, 6) : [];

  return (
    <section
      id="products"
      className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 pb-2">
        {/* Section Head (RTL Start) */}
        <div className="space-y-1 text-right">
          <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide">
            03 / مختارات القائد
          </span>
          <h2 className="font-marhey font-normal text-[32px] sm:text-[44px] lg:text-[56px] text-[#1F1F1F] leading-tight">
            أحدث ما وصلنا.
          </h2>
        </div>

        {/* Link (RTL End) */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 border-b-2 border-gold pb-1 font-alexandria font-bold text-[14px] sm:text-[16px] text-gold hover:text-gold-hover hover:border-gold-hover transition-all group"
        >
          <span>عرض الكل</span>
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
        </Link>
      </div>

      {/* 6 Products Grid (3x2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {displayItems.map((item) => {
          const itemName = item.name;
          const itemBrand =
            (item as Product).brand || item.category || "القائد";
          const itemDesc =
            item.description ||
            "شريحة A18 Pro، كاميرا احترافية، وشاشة أنعم للاستخدام اليومي.";
          const itemPrice =
            typeof item.price === "number"
              ? `${item.price.toLocaleString("ar-EG")} ج.م`
              : item.price || "1.390 ج.م";
          const itemImg = item.image_url || "/images/product-placeholder.svg";
          const itemId = item.id || "iphone-16-pro";

          const askPriceWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            `مرحبًا القائد، أود الاستفسار عن تفاصيل وسعر: ${itemName}`,
          )}`;

          return (
            <div
              key={itemId}
              className="group bg-[#F2EEE8] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Product Image Area */}
              <Link
                href={`/products/${itemId}`}
                className="block relative h-72 w-full overflow-hidden bg-transparent"
              >
                <Image
                  src={itemImg}
                  alt={itemName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-right">
                <div className="space-y-1">
                  <p className="font-alexandria font-bold text-[10px] tracking-[1.5px] text-[#A78463] uppercase">
                    {itemBrand}
                  </p>
                  <Link href={`/products/${itemId}`} className="block">
                    <h3 className="font-alexandria font-bold text-[18px] text-[#1F1F1F] leading-7 group-hover:text-gold transition-colors line-clamp-1">
                      {itemName}
                    </h3>
                  </Link>
                  <p className="font-alexandria font-normal text-[14px] text-muted-text leading-6 line-clamp-2">
                    {itemDesc}
                  </p>
                </div>

                {/* Status & Price Row */}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-marhey font-semibold text-[22px] sm:text-[24px] text-[#1F1F1F]">
                    {itemPrice}
                  </span>
                  <div className="inline-flex items-center gap-2">
                    <span className="font-alexandria font-normal text-[12px] text-[#6B635B]">
                      متوفر
                    </span>
                    <span className="size-2 rounded-full bg-[#4B8B5A]" />
                  </div>
                </div>

                {/* Actions: Details & WhatsApp buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={askPriceWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[13px] transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span className="whitespace-nowrap">اطلب</span>
                    <WhatsAppIcon className="w-3.5 h-3.5 text-white shrink-0" />
                  </a>

                  <Link
                    href={`/products/${itemId}`}
                    className="px-4 py-3 rounded-[20px] border border-[#DCD4CA] hover:border-[#1F1F1F] text-[#1F1F1F] font-alexandria font-bold text-[13px] transition-colors text-center whitespace-nowrap shrink-0"
                  >
                    التفاصيل
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
