import Image from 'next/image';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  ExternalLinkIcon,
  WhatsAppIcon,
} from '@/components/ui/Icons';
import { CtaBanner } from '@/components/store/CtaBanner';
import {
  STORE_PHONE,
  WHATSAPP_NUMBER,
  STORE_LOCATION_MAHALLA,
  STORE_LOCATION_SAMANOUD,
  STORE_HOURS,
  getWhatsAppUrl,
} from '@/lib/constants';

export const metadata = {
  title: 'فروعنا | متجر القائد للتقنية',
  description:
    'تعرف على فروع متجر القائد في المحلة الكبرى وسمنود، مواعيد العمل، وأرقام التواصل وخرائط الموقع.',
};

export default function BranchesPage() {
  const whatsappHeroUrl = getWhatsAppUrl(
    'مرحبًا القائد، أود الاستفسار عن فروع المتجر والوصول لأقرب فرع.'
  );

  const branches = [
    {
      id: 'mahalla',
      name: 'فرع المحلة الكبرى',
      city: 'المحله الكبرى',
      address: STORE_LOCATION_MAHALLA,
      phone: STORE_PHONE,
      hours: STORE_HOURS,
      image: '/images/hero-store.png',
      mapUrl: 'https://maps.app.goo.gl/Mahalla',
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'مرحبًا، أود التواصل مع فرع المحلة الكبرى.'
      )}`,
      reversed: false,
    },
    {
      id: 'samanoud',
      name: 'فرع سمنود',
      city: 'سمنود',
      address: STORE_LOCATION_SAMANOUD,
      phone: STORE_PHONE,
      hours: STORE_HOURS,
      image: '/images/hero-store.png',
      mapUrl: 'https://maps.app.goo.gl/Samanoud',
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'مرحبًا، أود التواصل مع فرع سمنود.'
      )}`,
      reversed: true,
    },
  ];

  return (
    <div className="w-full bg-[#FCFBF8]">
      {/* 1. Hero Section (Exact Figma Node 22:311) */}
      <section className="relative w-full min-h-120 sm:min-h-140 lg:min-h-160 flex items-center overflow-hidden bg-dark-card text-white">
        {/* Background Store Photography */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/hero-store.png"
            alt="فروع متجر القائد"
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
                'linear-gradient(-87.38deg, rgba(0, 0, 0, 0.8) 0.91%, rgba(0, 0, 0, 0.4) 78.43%, rgba(0, 0, 0, 0) 99.08%)',
            }}
          />
        </div>

        {/* Hero Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-20 flex flex-col items-start text-start gap-6 sm:gap-8">
          {/* Eyebrow with gold divider line */}
          <div className="flex items-center gap-3 w-full">
            <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark whitespace-nowrap">
              الفروع
            </span>
            <div className="flex-1 h-px bg-gold-dark/70" />
          </div>

          {/* Big Headline in Marhey font */}
          <div className="space-y-1">
            <h1 className="font-marhey font-semibold text-[38px] sm:text-[56px] lg:text-[76px] text-white leading-[1.15] tracking-tight drop-shadow-md">
              <span className="block">تعال</span>
              <span className="block">جرّب بنفسك.</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="max-w-lg font-alexandria font-normal text-[15px] sm:text-[18px] lg:text-[22px] text-white/95 leading-relaxed drop-shadow">
            زرنا في أقرب فرع، جرّب الأجهزة، وخذ رأي فريقنا قبل ما تقرر. نحب نسمع احتياجك أولًا.
          </p>

          {/* CTA Button */}
          <div className="pt-2 w-full sm:w-auto">
            <a
              href={whatsappHeroUrl}
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

      {/* 2. Branches Showcase Section (Exact Figma Node 22:330) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-20 lg:py-24 space-y-10 sm:space-y-12">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className={`group bg-[#F2EEE8] rounded-[20px] overflow-hidden flex flex-col ${
              branch.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
            } items-stretch transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border-light`}
          >
            {/* Branch Photography Half */}
            <div className="relative w-full lg:w-1/2 min-h-64 sm:min-h-80 lg:min-h-96 bg-zinc-200 overflow-hidden">
              <Image
                src={branch.image}
                alt={branch.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-alexandria font-bold text-white border border-white/10">
                {branch.city}
              </div>
            </div>

            {/* Branch Details Half */}
            <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 text-start">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="font-marhey font-normal text-[26px] sm:text-[30px] text-[#1F1F1F]">
                    {branch.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm font-alexandria text-muted-text">
                    <MapPinIcon className="w-4 h-4 text-gold shrink-0" />
                    <span>{branch.city}</span>
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-3 pt-4 border-t border-[#E5EAF1] font-alexandria text-[13px] sm:text-[14px] text-[#6B635B]">
                  <div className="flex items-center gap-2.5">
                    <MapPinIcon className="w-4 h-4 text-gold shrink-0" />
                    <span>{branch.address}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <PhoneIcon className="w-4 h-4 text-gold shrink-0" />
                    <span dir="ltr" className="font-medium text-[#1F1F1F]">
                      {branch.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <ClockIcon className="w-4 h-4 text-gold shrink-0" />
                    <span>{branch.hours}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full border border-gold hover:bg-gold/10 text-gold font-alexandria font-medium text-[13px] sm:text-[14px] transition-all text-center cursor-pointer"
                >
                  <ExternalLinkIcon className="w-4 h-4 text-gold shrink-0" />
                  <span>خرائط Google</span>
                </a>

                <a
                  href={branch.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[13px] sm:text-[14px] shadow-sm transition-all text-center cursor-pointer whitespace-nowrap"
                >
                  <span>واتساب</span>
                  <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Bottom CTA Section */}
      <CtaBanner />
    </div>
  );
}
