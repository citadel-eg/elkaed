export function WhyUsSection() {
  const reasons = [
    {
      number: '01',
      title: 'قريبين منك',
      description: 'فروع تساعدك تلاقي الخدمة والمنتج بسهولة.',
    },
    {
      number: '02',
      title: 'توصيل سريع',
      description: 'نتعاون مع شركة توصيل متخصصة لتوصيل طلباتك بسرعة.',
    },
    {
      number: '03',
      title: 'كل احتياجاتك في مكان واحد',
      description: 'من الهواتف واللابتوبات إلى الإكسسوارات المعتمدة.',
    },
    {
      number: '04',
      title: 'خدمة بعد البيع',
      description: 'مش بنبيعك المنتج ونختفي.',
    },
  ];

  return (
    <section className="w-full bg-gold-tint py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="space-y-1 text-start">
          <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide">
            05 / لماذا القائد
          </span>
          <h2 className="font-marhey font-normal text-[32px] sm:text-[44px] lg:text-[56px] text-[#1F1F1F] leading-tight">
            من القائد لباب بيتك
          </h2>
          <p className="font-alexandria font-medium text-[14px] sm:text-[16px] text-muted-text pt-1">
            توصيل أقل من 24 ساعة للمناطق المتاحة
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {reasons.map((item) => (
            <div
              key={item.number}
              className="group bg-gold-light rounded-xl p-6 transition-all duration-300 flex flex-col justify-between text-start hover:shadow-md hover:-translate-y-1 min-h-43"
            >
              <div className="space-y-2">
                <span className="font-marhey font-normal text-[32px] text-gold block leading-none">
                  {item.number}
                </span>
                <h3 className="font-alexandria font-bold text-[18px] text-[#1F1F1F] leading-7">
                  {item.title}
                </h3>
              </div>
              <p className="font-alexandria font-normal text-[14px] text-[#6B635B] leading-5 pt-4">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
