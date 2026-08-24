import Image from 'next/image';

export function BrandLogos() {
  const brands = [
    { name: 'Apple', logo: '/images/brand-apple.svg', width: 52, height: 52 },
    { name: 'Samsung', logo: '/images/brand-samsung.svg', width: 151, height: 24 },
    { name: 'Sony', logo: '/images/brand-sony.svg', width: 131, height: 24 },
    { name: 'Dell', logo: '/images/brand-dell.svg', width: 52, height: 52 },
    { name: 'Xiaomi', logo: '/images/brand-xiaomi.svg', width: 52, height: 52 },
    { name: 'Huawei', logo: '/images/brand-huawei.svg', width: 52, height: 52 },
    { name: 'JBL', logo: '/images/brand-jbl.svg', width: 52, height: 52 },
    { name: 'Lenovo', logo: '/images/brand-lenovo.svg', width: 70, height: 24 },
    { name: 'HP', logo: '/images/brand-hp.svg', width: 52, height: 52 },
    { name: 'Acer', logo: '/images/brand-acer.svg', width: 52, height: 52 },
    { name: 'Intel', logo: '/images/brand-intel.svg', width: 52, height: 52 },
  ];

  return (
    <section className="w-full bg-gold-light border-y border-border-light py-10 sm:py-12 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center space-y-6 sm:space-y-8">
        <p className="font-alexandria font-bold text-[14px] sm:text-[16px] text-gold-dark tracking-wide">
          علامات نفخر بأننا وكلاؤها المعتمدون
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110 cursor-pointer"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={brand.width}
                height={brand.height}
                className="max-h-9 sm:max-h-11 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
