import Link from 'next/link';
import Image from 'next/image';
import {
  PhoneIcon,
  ClockIcon,
  MapPinIcon,
  WhatsAppIcon,
  FacebookIcon,
  TikTokIcon,
} from '@/components/ui/Icons';
import {
  STORE_PHONE,
  WHATSAPP_NUMBER,
  FACEBOOK_URL,
  TIKTOK_URL,
  STORE_LOCATION_MAHALLA,
  STORE_LOCATION_SAMANOUD,
  STORE_HOURS,
} from '@/lib/constants';

export function Footer() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'مرحبًا القائد، أود التواصل معكم.'
  )}`;

  return (
    <footer className="bg-[#1F1F1F] border-t border-[#E8E0D7]/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16">
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-start lg:justify-between gap-8 sm:gap-10 lg:gap-8 pb-10 sm:pb-14 text-start">
          {/* Column 1 (RTL Right): Brand, Description & Socials */}
          <div className="w-full lg:max-w-85 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-8.5 h-10.5 shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="شعار متجر القائد للتقنية"
                  fill
                  sizes="34px"
                  className="object-cover"
                />
              </div>
              <span className="font-marhey font-bold text-[24px] text-[#CCCCCC] tracking-tight">
                القائد
              </span>
            </Link>

            <p className="font-alexandria font-normal text-[16px] text-[#CCCCCC] leading-7.5 max-w-78">
              تكنولوجيا مختارة بثقة، وخدمة قريبة منك. نساعدك تختار الأنسب قبل ما تشتري.
            </p>

            {/* Social Badges matching Figma Icon Groups */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center text-white transition-all hover:scale-105"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center text-white transition-all hover:scale-105"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center text-white transition-all hover:scale-105"
              >
                <WhatsAppIcon className="w-4.5 h-4.5" />
              </a>

              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                aria-label="Phone"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center text-white transition-all hover:scale-105"
              >
                <PhoneIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 (RTL Mid-Right): تصفح */}
          <div className="space-y-4 min-w-30">
            <h4 className="font-alexandria font-bold text-[14px] text-gold-dark uppercase tracking-wider">
              تصفح
            </h4>
            <ul className="space-y-2.5 font-alexandria font-normal text-[14px] text-[#B7AC9F]">
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  الأقسام
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors">
                  الفروع
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  من نحن
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 (RTL Mid-Left): فروعنا */}
          <div className="space-y-4 min-w-37.5">
            <h4 className="font-alexandria font-bold text-[14px] text-gold-dark uppercase tracking-wider">
              فروعنا
            </h4>
            <div className="space-y-3 font-alexandria font-normal text-[14px] text-[#B7AC9F]">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-gold shrink-0" />
                <span>{STORE_LOCATION_MAHALLA}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-gold shrink-0" />
                <span>{STORE_LOCATION_SAMANOUD}</span>
              </div>
            </div>
          </div>

          {/* Column 4 (RTL Far-Left): تواصل معنا */}
          <div className="space-y-4 min-w-42.5">
            <h4 className="font-alexandria font-bold text-[14px] text-gold-dark uppercase tracking-wider">
              تواصل معنا
            </h4>
            <div className="space-y-3 font-alexandria font-normal text-[14px] text-[#B7AC9F]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <PhoneIcon className="w-4 h-4 text-gold shrink-0" />
                <span dir="ltr">{STORE_PHONE}</span>
              </a>

              <div className="flex items-center gap-2 text-[#B7AC9F]">
                <ClockIcon className="w-4 h-4 text-gold shrink-0" />
                <span>{STORE_HOURS}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-7 border-t border-[#3A332D] flex flex-col sm:flex-row items-center justify-between gap-4 font-alexandria text-[13px] text-[#8F857A]">
          <p>© 2026 متجر القائد للتقنية · مصر · جميع الحقوق محفوظة</p>

          <div className="flex items-center gap-2 text-xs">
            <span>تم التصميم والتطوير بواسطة</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 text-white font-bold tracking-wider hover:text-gold transition-all duration-300 shadow-sm cursor-default group">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-semibold text-[13px] tracking-wide text-zinc-100 group-hover:text-gold transition-colors">
                Citadel
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
