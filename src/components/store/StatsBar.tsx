export function StatsBar() {
  const stats = [
    { value: '24/7', label: 'دعم عبر واتساب' },
    { value: '40+', label: 'علامة موثوقة' },
    { value: '12K+', label: 'عميل سعيد' },
    { value: '15+', label: 'عامًا من الخبرة' },
  ];

  return (
    <section className="w-full bg-gold-light border-y border-border-light py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => {
            const borderClasses =
              idx === 0
                ? 'border-l border-b lg:border-b-0 border-gold-muted'
                : idx === 1
                ? 'border-b lg:border-b-0 lg:border-l border-gold-muted'
                : idx === 2
                ? 'border-l border-gold-muted'
                : '';

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center text-center px-4 py-3 sm:py-2 ${borderClasses}`}
              >
                <span className="font-marhey font-semibold text-[32px] sm:text-[40px] text-gold-dark leading-tight mb-1">
                  {stat.value}
                </span>
                <span className="font-alexandria font-medium text-[13px] sm:text-[14px] text-[#1F1F1F]">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
