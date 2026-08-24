import Image from 'next/image';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { CtaBanner } from '@/components/store/CtaBanner';
import { getWhatsAppUrl } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import type { TeamMember } from '@/types/team';

export const metadata = {
  title: 'عن القائد | متجر القائد للتقنية',
  description:
    'تعرف على قصة متجر القائد للتقنية، رؤيتنا، قيمنا، ومحطات رحلتنا في توفير أفضل الأجهزة والمنتجات الإلكترونية الأصلية.',
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function AboutPage() {
  const supabase = await createClient();
  const whatsappUrl = getWhatsAppUrl(
    'مرحبًا القائد، أود الاستفسار والتواصل معكم.'
  );

  // Fetch team members from Supabase table
  const { data: teamData } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const teamMembers: TeamMember[] = teamData || [];

  const values = [
    {
      number: '01',
      title: 'الصدق',
      description: 'ننصحك بالأنسب لك حتى لو مش الأغلى.',
    },
    {
      number: '02',
      title: 'الجودة',
      description: 'منتجات أصلية وخدمة تليق بثقتك.',
    },
    {
      number: '03',
      title: 'الاحترام',
      description: 'نسمع احتياجك ونتعامل معك كصديق.',
    },
    {
      number: '04',
      title: 'الاستمرارية',
      description: 'معاك قبل الشراء وبعده دائمًا.',
    },
  ];

  const milestones = [
    {
      year: '2011',
      title: 'البداية',
      description: 'افتتحنا أول فرع صغير بحلم كبير: خدمة تقنية صادقة.',
    },
    {
      year: '2015',
      title: 'التوسع',
      description: 'زادت ثقة عملائنا، ففتحنا فروعًا جديدة في سمنود والمحلة.',
    },
    {
      year: '2019',
      title: 'التطوير',
      description: 'طورنا تشكيلاتنا لتشمل أحدث الأجهزة الذكية والإلكترونيات المعتمدة عالمياً.',
    },
    {
      year: '2025',
      title: 'أونلاين',
      description: 'بدأنا خدمة العملاء والطلب الفوري عبر واتساب لتسهيل التواصل معنا.',
    },
    {
      year: '2026',
      title: 'اليوم',
      description: 'أكثر من 12,000 عميل يثقون بالقائد في كل يوم.',
    },
  ];

  const stats = [
    { value: '15+', label: 'عامًا من الخبرة' },
    { value: '40+', label: 'علامة موثوقة' },
    { value: '2', label: 'فروع' },
    { value: '24/7', label: 'دعم عبر واتساب' },
  ];

  return (
    <div className="w-full bg-[#FCFBF8]">
      {/* 1. Hero Section (Exact Figma Node 23:1167) */}
      <section className="relative w-full min-h-120 sm:min-h-140 lg:min-h-160 flex items-center overflow-hidden bg-dark-card text-white">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/images/hero-store.png"
            alt="عن متجر القائد"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
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

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-20 flex flex-col items-start text-start gap-6 sm:gap-8">
          {/* Eyebrow with gold divider line */}
          <div className="flex items-center gap-3 w-full">
            <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark whitespace-nowrap">
              من نحن
            </span>
            <div className="flex-1 h-px bg-gold-dark/70" />
          </div>

          {/* Headline */}
          <div className="space-y-1">
            <h1 className="font-marhey font-semibold text-[38px] sm:text-[56px] lg:text-[76px] text-white leading-[1.15] tracking-tight drop-shadow-md">
              <span className="block">قصة القائد.</span>
              <span className="block">ثقة تبنى كل يوم.</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="max-w-lg font-alexandria font-normal text-[15px] sm:text-[18px] lg:text-[22px] text-white/95 leading-relaxed drop-shadow">
            بدأنا كمتجر صغير، وكبرنا بثقة عملائنا. رحلتنا كلها هدف واحد، نساعدك تختار صح.
          </p>

          {/* CTA Button */}
          <div className="pt-2 w-full sm:w-auto">
            <a
              href={whatsappUrl}
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

      {/* 2. 01 / من نحن (Exact Figma Node 23:1402 - Heading on Right, Paragraphs on Left in RTL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16">
          {/* Heading (Right Side in RTL) */}
          <div className="space-y-2 text-start shrink-0 lg:max-w-md">
            <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide block">
              01 / من نحن
            </span>
            <h2 className="font-marhey font-normal text-[36px] sm:text-[48px] lg:text-[60px] text-[#1F1F1F] leading-[1.2]">
              أكثر من متجر تقنية.
            </h2>
          </div>

          {/* Paragraphs (Left Side in RTL) */}
          <div className="flex-1 space-y-4 text-start max-w-2xl">
            <p className="font-alexandria font-normal text-[18px] sm:text-[22px] lg:text-[24px] text-[#1F1F1F] leading-[1.7]">
              القائد شركة مصرية متخصصة في بيع الأجهزة التقنية والإكسسوارات الأصلية. نؤمن إن التكنولوجيا لازم تكون سهلة وقريبة من الناس.
            </p>
            <p className="font-alexandria font-normal text-[15px] sm:text-[18px] lg:text-[20px] text-muted-text leading-[1.8]">
              على مدار سنوات، بنينا سمعتنا على الصدق وجودة الخدمة. مش بنبيع منتج وخلاص، إحنا بنبني علاقة تدوم مع كل عميل.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission Cards Grid (Exact Figma Node 23:1426) */}
      <section className="w-full bg-gold-tint py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1: رؤيتنا */}
            <div className="bg-[#FCFBF8] rounded-2xl p-8 sm:p-10 space-y-4 text-start shadow-xs">
              <h3 className="font-marhey font-normal text-[28px] sm:text-[32px] text-gold">
                رؤيتنا
              </h3>
              <p className="font-alexandria font-semibold text-[15px] sm:text-[17px] text-[#1F1F1F] leading-[1.8]">
                أن نكون الوجهة الأولى والأكثر ثقة للتقنية في مصر، حيث يجد كل عميل ما يناسبه بسهولة وأمان.
              </p>
            </div>

            {/* Card 2: رسالتنا */}
            <div className="bg-[#FCFBF8] rounded-2xl p-8 sm:p-10 space-y-4 text-start shadow-xs">
              <h3 className="font-marhey font-normal text-[28px] sm:text-[32px] text-gold">
                رسالتنا
              </h3>
              <p className="font-alexandria font-semibold text-[15px] sm:text-[17px] text-[#1F1F1F] leading-[1.8]">
                نقدّم منتجات أصلية واستشارات صادقة، لنجعل تجربة التقنية أبسط وأمتع لكل عميل.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 02 / قيمنا (Exact Figma Node 23:1440) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-20 lg:py-24 space-y-10 sm:space-y-12">
        <div className="space-y-2 text-start">
          <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide block">
            02 / قيمنا
          </span>
          <h2 className="font-marhey font-normal text-[36px] sm:text-[48px] lg:text-[60px] text-[#1F1F1F] leading-[1.2]">
            ما نؤمن به.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {values.map((v) => (
            <div
              key={v.number}
              className="bg-gold-light rounded-xl p-6 sm:p-8 space-y-3 text-start transition-all duration-300 hover:bg-[#EFE8DC] hover:-translate-y-0.5"
            >
              <span className="font-marhey font-normal text-[30px] sm:text-[34px] text-gold block">
                {v.number}
              </span>
              <h3 className="font-alexandria font-bold text-[18px] text-[#1F1F1F]">
                {v.title}
              </h3>
              <p className="font-alexandria font-normal text-[14px] text-[#6B635B] leading-[1.7]">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 03 / رحلتنا (Exact Figma Node 23:1507) */}
      <section className="w-full bg-[#1F1F1F] text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12">
          {/* Header */}
          <div className="space-y-2 text-start">
            <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide block">
              03 / رحلتنا
            </span>
            <h2 className="font-marhey font-normal text-[36px] sm:text-[48px] lg:text-[60px] text-white leading-[1.2]">
              محطات نفخر بها.
            </h2>
          </div>

          {/* Milestones Rows */}
          <div className="divide-y divide-[#3A332D]">
            {milestones.map((m) => (
              <div
                key={m.year}
                className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-8 text-start group"
              >
                <span className="font-marhey font-normal text-[26px] sm:text-[30px] text-gold shrink-0 transition-transform group-hover:scale-105">
                  {m.year}
                </span>
                <div className="flex-1 sm:max-w-3xl space-y-1">
                  <h3 className="font-alexandria font-bold text-[18px] sm:text-[20px] text-white">
                    {m.title}
                  </h3>
                  <p className="font-alexandria font-normal text-[14px] sm:text-[15px] text-[#B7AC9F] leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Stats Bar (Exact Figma Node 23:1656) */}
      <section className="w-full bg-gold-light border-y border-border-light py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-gold-muted">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center text-center space-y-1 ${
                  idx > 1 ? 'pt-6 lg:pt-0' : ''
                }`}
              >
                <span className="font-marhey font-semibold text-[32px] sm:text-[40px] text-gold-dark leading-none">
                  {s.value}
                </span>
                <span className="font-alexandria font-medium text-[13px] sm:text-[14px] text-[#1F1F1F]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 04 / الفريق (Exact Figma Node 23:1783 - Queried Dynamically from Supabase) */}
      {teamMembers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 sm:py-20 lg:py-24 space-y-10 sm:space-y-12">
          <div className="space-y-2 text-start">
            <span className="font-alexandria font-bold text-[13px] sm:text-[14px] text-gold-dark tracking-wide block">
              04 / الفريق
            </span>
            <h2 className="font-marhey font-normal text-[36px] sm:text-[48px] lg:text-[60px] text-[#1F1F1F] leading-[1.2]">
              ناس بتحب شغلها.
            </h2>
          </div>

          {/* Team Cards Grid (5 in row on xl, wrapping smoothly with full responsive support) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-[#D1D5DB] rounded-[20px] p-2.5 space-y-3.5 text-start transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#F2EEE8]">
                  <Image
                    src={member.image_url || '/images/avatar-placeholder.svg'}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="px-2 pb-2 space-y-1">
                  <h3 className="font-marhey font-bold text-[17px] sm:text-[18px] text-[#1F1F1F]">
                    {member.name}
                  </h3>
                  <p className="font-alexandria font-normal text-[13px] text-[#8A7F72]">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Bottom CTA Section */}
      <CtaBanner />
    </div>
  );
}
