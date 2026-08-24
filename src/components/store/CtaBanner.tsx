import { WhatsAppIcon } from '@/components/ui/Icons';

export function CtaBanner() {
  const WHATSAPP_NUMBER = '201063905083';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'مرحبًا القائد، أود التواصل معكم بخصوص المنتجات والخدمات.'
  )}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-10 mb-8 sm:mb-12">
      <div className="relative rounded-3xl overflow-hidden bg-[#1F1F1F] text-white p-6 sm:p-12 lg:p-16 text-center flex flex-col items-center justify-center border border-border-light/10 shadow-2xl space-y-5 sm:space-y-6">
        {/* Eyebrow */}
        <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold tracking-wide">
          ابدأ الآن
        </span>

        {/* Heading */}
        <h2 className="font-marhey font-normal text-[28px] sm:text-[42px] lg:text-[56px] text-white leading-[1.2] max-w-2xl">
          <span>تقنية أقرب ليك.</span>
          <br />
          <span>أسرع مما تتوقع.</span>
        </h2>

        {/* Subtitle */}
        <p className="font-alexandria font-normal text-[14px] sm:text-[16px] text-[#C3B9AD] max-w-lg mx-auto leading-relaxed">
          كلّمنا على واتساب، قولنا احتياجاتك وميزانيتك، وسيب علينا الباقي. هنرد عليك بسرعة ونرشحلك الأنسب.
        </p>

        {/* CTA Button */}
        <div className="pt-2 flex justify-center w-full sm:w-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[14px] shadow-lg shadow-gold/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>تواصل معانا</span>
            <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}
