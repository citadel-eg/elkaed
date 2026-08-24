import Link from 'next/link';

export function AboutSection() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-10 lg:gap-14">
        {/* Right side (RTL start): Section Title & Eyebrow */}
        <div className="flex flex-col items-start text-start space-y-2 shrink-0">
          <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide">
            01 / عن القائد
          </span>
          <h2 className="font-marhey font-normal text-[32px] sm:text-[44px] lg:text-[56px] text-[#1F1F1F] leading-[1.2]">
            <span>كل ما تحتاجه،</span>
            <br />
            <span>أقرب مما تتخيل.</span>
          </h2>
        </div>

        {/* Left side (RTL end): Content & Action */}
        <div className="flex-1 flex flex-col items-start text-start space-y-4 max-w-2xl">
          <h3 className="font-alexandria font-bold text-[18px] sm:text-[22px] lg:text-[24px] text-[#1F1F1F] leading-[1.4]">
            خبرة يمكنك الاعتماد عليها
          </h3>

          <p className="font-alexandria font-normal text-[15px] sm:text-[17px] lg:text-[19px] text-muted-text leading-[1.8]">
            من الهواتف واللابتوبات إلى الإكسسوارات الأصلية، نجمع لك احتياجاتك التقنية في مكان واحد، بخدمة موثوقة وفروع قريبة وتوصيل سريع للمناطق المتاحة.
          </p>

          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 border-b-2 border-gold pb-1 font-alexandria font-bold text-[14px] sm:text-[16px] text-gold hover:text-gold-hover hover:border-gold-hover transition-all group"
            >
              <span>تعرّف على القائد</span>
              <span className="transition-transform group-hover:-translate-x-1">←</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
