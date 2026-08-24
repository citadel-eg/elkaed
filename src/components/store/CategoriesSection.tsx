import Link from 'next/link';
import Image from 'next/image';
import { BUCKET_URL } from '@/lib/constants';

interface CategoryItem {
  id: string;
  name: string;
  enTag: string;
  image: string;
  href: string;
}

export function CategoriesSection() {
  const categories: CategoryItem[] = [
    {
      id: '01',
      name: 'الهواتف الذكية',
      enTag: '01 / SMARTPHONES',
      image: `${BUCKET_URL}/cat-smartphones.png`,
      href: '/products?category=smartphones',
    },
    {
      id: '02',
      name: 'اللابتوبات',
      enTag: '02 / LAPTOPS',
      image: `${BUCKET_URL}/cat-laptops.png`,
      href: '/products?category=laptops',
    },
    {
      id: '03',
      name: 'التابلت',
      enTag: '03 / TABLETS',
      image: `${BUCKET_URL}/cat-tablets.png`,
      href: '/products?category=tablets',
    },
    {
      id: '04',
      name: 'الساعات الذكية',
      enTag: '04 / WEARABLES',
      image: `${BUCKET_URL}/cat-smartwatches.png`,
      href: '/products?category=wearables',
    },
    {
      id: '05',
      name: 'السماعات',
      enTag: '05 / AUDIO',
      image: `${BUCKET_URL}/cat-audio.png`,
      href: '/products?category=audio',
    },
    {
      id: '06',
      name: 'إكسسوارات الهواتف',
      enTag: '06 / MOBILE ACCESSORIES',
      image: `${BUCKET_URL}/cat-accessories.png`,
      href: '/products?category=accessories',
    },
  ];

  return (
    <section id="categories" className="w-full bg-[#1F1F1F] text-white py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-8 sm:space-y-10">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 pb-2">
          {/* Section Head (RTL Start) */}
          <div className="space-y-1 text-start">
            <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide">
              02 / استكشف
            </span>
            <h2 className="font-marhey font-normal text-[32px] sm:text-[44px] lg:text-[56px] text-white leading-tight">
              تكنولوجيا تناسبك.
            </h2>
          </div>

          {/* Link (RTL End) */}
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 border-b-2 border-gold pb-1 font-alexandria font-bold text-[14px] sm:text-[16px] text-gold hover:text-gold-hover hover:border-gold-hover transition-all group"
          >
            <span>كل الأقسام</span>
            <span className="transition-transform group-hover:-translate-x-1">←</span>
          </Link>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative h-56 sm:h-64 lg:h-72 rounded-xl overflow-hidden bg-zinc-900 flex flex-col justify-end p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
            >
              {/* Background Category Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Figma Category Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(-64.78deg, rgba(0, 0, 0, 0.85) 1.4%, rgba(0, 0, 0, 0.35) 74.6%, rgba(0, 0, 0, 0.05) 94.7%)',
                  }}
                />
              </div>

              {/* Card Label Content */}
              <div className="relative z-10 text-start space-y-1">
                <p className="font-alexandria font-normal text-[10px] tracking-[1.8px] text-[#EFE2D5] uppercase">
                  {cat.enTag}
                </p>
                <h3 className="font-alexandria font-bold text-[22px] sm:text-[24px] text-white group-hover:text-gold-tint transition-colors leading-8">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
