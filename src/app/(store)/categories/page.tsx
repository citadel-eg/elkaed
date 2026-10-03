import Link from "next/link";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { CtaBanner } from "@/components/store/CtaBanner";
import { getWhatsAppUrl, BUCKET_URL } from "@/lib/constants";

export const metadata = {
  title: "كافة الأقسام | متجر القائد للتقنية",
  description:
    "تصفح كافة أقسام متجر القائد — الهواتف الذكية، اللابتوبات، التابلت، الساعات الذكية، الشواحن، الكابلات، والباور بانك.",
};

interface CategoryData {
  id: string;
  tag: string;
  name: string;
  image: string;
  href: string;
}

const CATEGORIES_DATA: CategoryData[] = [
  {
    id: "smartphones",
    tag: "01 / SMARTPHONES",
    name: "الهواتف الذكية",
    image: "/images/categories/cat-smartphones.png",
    href: "/products?category=smartphones",
  },
  {
    id: "laptops",
    tag: "02 / LAPTOPS",
    name: "اللابتوبات",
    image: "/images/categories/cat-laptops.png",
    href: "/products?category=laptops",
  },
  {
    id: "tablets",
    tag: "03 / TABLETS",
    name: "التابلت",
    image: "/images/categories/cat-tablets.png",
    href: "/products?category=tablets",
  },
  {
    id: "wearables",
    tag: "04 / WEARABLES",
    name: "الساعات الذكية",
    image: "/images/categories/cat-smartwatches.png",
    href: "/products?category=wearables",
  },
  {
    id: "audio",
    tag: "05 / AUDIO",
    name: "السماعات",
    image: "/images/categories/cat-audio.png",
    href: "/products?category=audio",
  },
  {
    id: "accessories",
    tag: "06 / PHONE GEAR",
    name: "إكسسوارات الهواتف",
    image: "/images/categories/cat-phone-gear.png",
    href: "/products?category=accessories",
  },
  {
    id: "cables",
    tag: "07 / CABLES",
    name: "الكابلات",
    image: "/images/categories/cat-cables.png",
    href: "/products?category=cables",
  },
  {
    id: "chargers",
    tag: "08 / CHARGERS",
    name: "شواحن",
    image: "/images/categories/cat-chargers.png",
    href: "/products?category=chargers",
  },
  {
    id: "powerbanks",
    tag: "09 / POWER BANKS",
    name: "الباور بانك",
    image: "/images/categories/cat-powerbanks.png",
    href: "/products?category=powerbanks",
  },
  {
    id: "cases",
    tag: "10 / CASES",
    name: "حافظات الهواتف",
    image: "/images/categories/cat-cases.png",
    href: "/products?category=cases",
  },
  {
    id: "screen-protectors",
    tag: "11 / SCREEN CARE",
    name: "واقيات الشاشة",
    image: "/images/categories/cat-screen-care.png",
    href: "/products?category=screen-protectors",
  },
  {
    id: "laptop-accessories",
    tag: "12 / LAPTOP GEAR",
    name: "إكسسوارات اللابتوب",
    image: "/images/categories/cat-laptop-gear.png",
    href: "/products?category=laptop-accessories",
  },
  {
    id: "social-media-creator",
    tag: "13 / CONTENT CREATION",
    name: "أدوات صناعة المحتوى",
    image: "/images/categories/cat-creator.png",
    href: "/products?category=social-media-creator",
  },
];

export default function CategoriesPage() {
  const whatsappUrl = getWhatsAppUrl(
    "مرحبًا القائد، أود الاستفسار عن أقسام ومنتجات المتجر.",
  );

  return (
    <div className="w-full bg-[#FCFBF8]">
      {/* 1. Category Hero Banner (Exact Figma Node 18:872) */}
      <section className="relative w-full min-h-115 sm:min-h-125 lg:min-h-135 flex items-center overflow-hidden bg-dark-card text-white">
        {/* Background Store Photography */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/hero-store.png"
            alt="أقسام متجر القائد"
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
                "linear-gradient(-87.38deg, rgba(0, 0, 0, 0.8) 0.91%, rgba(0, 0, 0, 0.4) 78.43%, rgba(0, 0, 0, 0) 99.08%)",
            }}
          />
        </div>

        {/* Hero Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-20 flex flex-col items-start text-start gap-6 sm:gap-8">
          {/* Eyebrow with gold divider line */}
          <div className="flex items-center gap-3 w-full">
            <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark whitespace-nowrap">
              الأقسام
            </span>
            <div className="flex-1 h-px bg-gold-dark/70" />
          </div>

          {/* Big Headline in Marhey Font */}
          <div className="space-y-1">
            <h1 className="font-marhey font-semibold text-[38px] sm:text-[56px] lg:text-[76px] text-white leading-[1.15] tracking-tight drop-shadow-md">
              <span className="block">كل ما تحتاجه</span>
              <span className="block">في مكان واحد.</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="max-w-lg font-alexandria font-normal text-[15px] sm:text-[18px] lg:text-[22px] text-white/95 leading-relaxed drop-shadow">
            تصفّح أقسامنا واختر ما يناسبك، ولو محتار كلّمنا على واتساب ونرشحلك
            الأنسب.
          </p>

          {/* CTA Button */}
          <div className="pt-2 w-full sm:w-auto">
            <a
              href={whatsappUrl}
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

      {/* 2. Full Categories Grid Section (Exact Figma Node 18:1563) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-zinc-900 flex flex-col justify-end p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
            >
              {/* Category Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Figma Category Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(-69.86deg, rgba(0, 0, 0, 0.85) 1.4%, rgba(0, 0, 0, 0.35) 74.6%, rgba(0, 0, 0, 0.05) 94.7%)",
                  }}
                />
              </div>

              {/* Card Label Content */}
              <div className="relative z-10 text-start space-y-2">
                <p className="font-alexandria font-normal text-[10px] tracking-[1.8px] text-[#EFE2D5] uppercase">
                  {cat.tag}
                </p>
                <h3 className="font-alexandria font-bold text-[20px] sm:text-[24px] text-white group-hover:text-gold-tint transition-colors leading-snug">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-2 pt-1 text-gold font-alexandria font-semibold text-[13px] sm:text-[14px]">
                  <span>استعرض القسم</span>
                  <span className="transition-transform group-hover:-translate-x-1">
                    ←
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Bottom CTA Section */}
      <CtaBanner />
    </div>
  );
}
