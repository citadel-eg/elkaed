export function TestimonialsSection() {
  const reviews = [
    {
      id: 1,
      name: 'أحمد سمير',
      role: 'مصمم جرافيك',
      rating: 5,
      comment:
        'اشتريت لابتوب من القائد ورشحولي الجهاز المناسب لشغلي وسعره ممتاز. خدمة محترمة جدًا.',
    },
    {
      id: 2,
      name: 'سارة مجدي',
      role: 'محاسبة',
      rating: 5,
      comment:
        'صلّحوا شاشة موبايلي في نفس اليوم وبضمان. أسعار واضحة من الأول ومفيش مفاجآت.',
    },
    {
      id: 3,
      name: 'كريم عبد الله',
      role: 'صاحب عمل',
      rating: 5,
      comment:
        'سألتهم على واتساب وردوا بسرعة وساعدوني أختار موبايل في حدود ميزانيتي. تجربة مريحة جدًا.',
    },
    {
      id: 4,
      name: 'عمر خالد',
      role: 'طالب جامعي',
      rating: 5,
      comment:
        'أفضل مكان تشتري منه إكسسوارات أصلية وأسعارهم ممتازة وخدمة ما بعد البيع فوق الممتازة.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24">
      {/* Header */}
      <div className="mb-8 sm:mb-12 space-y-1 text-start">
        <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide">
          06 / آراء عملائنا
        </span>
        <h2 className="font-marhey font-normal text-[32px] sm:text-[44px] lg:text-[56px] text-[#1F1F1F] leading-tight">
          ثقة تسعدنا كل يوم.
        </h2>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="group bg-white rounded-xl border border-border-light p-6 hover:border-gold/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-start hover:-translate-y-1"
          >
            <div className="space-y-4">
              {/* 5 Stars (RTL start - Right) */}
              <div className="flex items-center gap-0.5 text-[#FFCF0F]">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-[16px] leading-none">
                    ★
                  </span>
                ))}
              </div>

              {/* Review Comment */}
              <p className="font-alexandria font-normal text-[14px] text-[#48433E] leading-7.5">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            {/* Author details (RTL start - Avatar right, text left) */}
            <div className="pt-6 mt-6 border-t border-border-light flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FCEBEA] border border-gold/20 flex items-center justify-center font-bold text-gold text-sm shrink-0">
                {review.name.charAt(0)}
              </div>
              <div className="flex flex-col text-start">
                <span className="font-alexandria font-bold text-[16px] text-[#1F1F1F]">
                  {review.name}
                </span>
                <span className="font-alexandria font-normal text-[12px] text-[#8A7F72]">
                  {review.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
