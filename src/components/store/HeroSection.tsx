import Link from 'next/link';
import Image from 'next/image';
import { WhatsAppIcon } from '@/components/ui/Icons';

export function HeroSection() {
  const WHATSAPP_NUMBER = '201063905083';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'مرحبًا القائد، أود التحدث معكم بخصوص المنتجات والخدمات المتاحة.'
  )}`;

  return (
    <section className="relative w-full min-h-120 sm:min-h-140 lg:min-h-160 flex items-center overflow-hidden bg-dark-card text-white">
      {/* Background Store Photography */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/hero-store.png"
          alt="متجر القائد للتقنية"
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
              'linear-gradient(-87.38deg, rgba(0, 0, 0, 0.82) 0.91%, rgba(0, 0, 0, 0.45) 78.43%, rgba(0, 0, 0, 0.1) 99.08%)',
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-20 flex flex-col items-start text-start gap-6 sm:gap-8">
        {/* Top Gold Divider with Eyebrow */}
        <div className="flex items-center gap-3 w-full">
          <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark whitespace-nowrap">
            تكنولوجيا مختارة بعناية
          </span>
          <div className="flex-1 h-px bg-gold-dark/70" />
        </div>

        {/* Big Headline in Marhey font */}
        <div className="space-y-1">
          <h1 className="font-marhey font-semibold text-[38px] sm:text-[56px] lg:text-[76px] text-white leading-[1.15] tracking-tight drop-shadow-md">
            <span className="block">القائد</span>
            <span className="block">وجهتك للتقنية</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="max-w-135 font-alexandria font-normal text-[15px] sm:text-[18px] lg:text-[22px] text-white/95 leading-relaxed drop-shadow">
          موبايلات، لابتوبات، وإكسسوارات أصلية — اختار اللي تحتاجه وتواصل معنا، ونجهز طلبك ونوصلهولك بسرعة.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
          {/* WhatsApp CTA Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-6 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[15px] sm:text-[16px] shadow-lg shadow-gold/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>تحدث معنا عبر واتساب</span>
            <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
          </a>

          {/* Browse Products Button */}
          <Link
            href="/products"
            className="inline-flex items-center justify-center h-12 sm:h-14 px-6 rounded-[20px] border border-white hover:bg-white/15 text-white font-alexandria font-bold text-[15px] sm:text-[16px] backdrop-blur-sm transition-all hover:scale-105 active:scale-95 text-center"
          >
            استعرض المنتجات
          </Link>
        </div>
      </div>
    </section>
  );
}
