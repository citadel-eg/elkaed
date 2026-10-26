import Image from 'next/image';
import { MapPinIcon, PhoneIcon, ClockIcon, ExternalLinkIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { STORE_PHONE, WHATSAPP_NUMBER } from '@/lib/constants';

export function BranchesSection() {
  const branches = [
    {
      id: 'mahalla',
      name: 'فرع المحلة الكبرى',
      city: 'المحله الكبرى',
      address: 'شارع البحر المحلة',
      phone: STORE_PHONE,
      hours: 'يوميًا 11ص – 11م',
      image: '/images/hero-store.png',
      mapUrl: 'https://maps.app.goo.gl/Mahalla',
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'مرحبًا، أود التواصل مع فرع المحلة الكبرى.'
      )}`,
    },
    {
      id: 'samanoud',
      name: 'فرع سمنود',
      city: 'سمنود',
      address: 'سمنود',
      phone: STORE_PHONE,
      hours: 'يوميًا 11ص – 11م',
      image: '/images/hero-store.png',
      mapUrl: 'https://maps.app.goo.gl/Samanoud',
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'مرحبًا، أود التواصل مع فرع سمنود.'
      )}`,
    },
  ];

  return (
    <section id="branches" className="w-full bg-gold-light border-y border-border-light py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-12 lg:gap-16">
          {/* Section Head (RTL Start - Right) */}
          <div className="lg:w-105 shrink-0 text-start space-y-2">
            <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide">
              07 / قربنا منك
            </span>
            <h2 className="font-marhey font-normal text-[32px] sm:text-[44px] lg:text-[56px] text-[#1F1F1F] leading-tight">
              زرنا في أقرب فرع.
            </h2>
            <p className="font-alexandria font-medium text-[14px] sm:text-[16px] text-muted-text leading-relaxed pt-1">
              مش بعيد عنك. اختار أقرب فرع ليك وتواصل معانا.
            </p>
          </div>

          {/* 2 Branch Cards (RTL End - Left) */}
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="group bg-white rounded-[20px] border border-border-light overflow-hidden hover:border-gold/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                {/* Branch Image */}
                <div className="relative h-55 sm:h-60 w-full bg-zinc-100 overflow-hidden">
                  <Image
                    src={branch.image}
                    alt={branch.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-alexandria font-bold text-white border border-white/10">
                    {branch.city}
                  </div>
                </div>

                {/* Branch Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 text-start">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-marhey font-semibold text-[20px] sm:text-[22px] text-[#1F1F1F]">
                        {branch.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-alexandria text-muted-text">
                        <MapPinIcon className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{branch.city}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-alexandria text-muted-text pt-3 border-t border-border-light">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{branch.address}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span dir="ltr" className="font-medium text-[#1F1F1F]">
                          {branch.phone}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{branch.hours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <a
                      href={branch.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[12px] transition-all shadow-sm cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                      <span>واتساب</span>
                    </a>

                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-[20px] border border-gold text-gold hover:bg-gold/10 font-alexandria font-medium text-[12px] transition-all text-center"
                    >
                      <ExternalLinkIcon className="w-3.5 h-3.5 text-gold" />
                      <span>خرائط Google</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
