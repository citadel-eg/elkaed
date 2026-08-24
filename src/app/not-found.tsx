import Link from 'next/link';
import { WhatsAppIcon, ArrowLeftIcon } from '@/components/ui/Icons';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export const metadata = {
  title: '404 - الصفحة غير موجودة | متجر القائد للتقنية',
  description: 'عذرًا، الصفحة التي تبحث عنها غير موجودة في متجر القائد للتقنية.',
};

export default function NotFound() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'مرحبًا القائد، واجهت مشكلة في الوصول لصفحة على الموقع وأحتاج للمساعدة.'
  )}`;

  const quickLinks = [
    { label: 'الهواتف الذكية', href: '/products?category=smartphones' },
    { label: 'اللابتوبات', href: '/products?category=laptops' },
    { label: 'الإكسسوارات', href: '/products?category=accessories' },
    { label: 'الفروع', href: '/branches' },
    { label: 'من نحن', href: '/about' },
  ];

  return (
    <div className="min-h-[75vh] w-full bg-[#FCFBF8] flex items-center justify-center px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Large Decorative 404 Badge */}
        <div className="relative inline-flex items-center justify-center">
          <span className="font-marhey font-bold text-[90px] sm:text-[140px] lg:text-[160px] text-gold/20 leading-none select-none tracking-tight">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-marhey font-semibold text-[32px] sm:text-[44px] text-[#1F1F1F] drop-shadow-xs">
              الصفحة غير موجودة
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="max-w-lg mx-auto font-alexandria font-normal text-[15px] sm:text-[17px] text-[#6B635B] leading-relaxed">
          عذرًا، الصفحة التي تبحث عنها قد تكون انتقلت، حُذفت، أو لم تعد متوفرة. يمكنك العودة واستكشاف أحدث المنتجات والعروض.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[14px] sm:text-[15px] shadow-lg shadow-gold/20 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>العودة للرئيسية</span>
            <ArrowLeftIcon className="w-4 h-4 text-white shrink-0" />
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full border border-gold hover:bg-gold/10 text-gold font-alexandria font-bold text-[14px] sm:text-[15px] transition-all cursor-pointer whitespace-nowrap"
          >
            <span>تصفح المنتجات</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-[#DCD4CA] hover:border-[#1F1F1F] text-[#1F1F1F] font-alexandria font-medium text-[14px] transition-all cursor-pointer whitespace-nowrap"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>طلب مساعدة</span>
          </a>
        </div>

        {/* Quick Links Suggestions */}
        <div className="pt-6 border-t border-border-light space-y-3">
          <p className="font-alexandria font-medium text-xs text-[#8A7F72]">
            أو يمكنك تصفح الأقسام الشائعة:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="px-3.5 py-1.5 rounded-full bg-[#F2EEE8] hover:bg-gold-tint text-[#1F1F1F] font-alexandria text-xs font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
