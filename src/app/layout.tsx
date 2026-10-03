import type { Metadata, Viewport } from 'next';
import { Alexandria, Marhey } from 'next/font/google';
import './globals.css';

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-alexandria',
});

const marhey = Marhey({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-marhey',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elkaed.com';

export const viewport: Viewport = {
  themeColor: '#B8956A',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | متجر القائد للتقنية',
    default: 'القائد للتقنية | وجهتك المعتمدة للهواتف واللابتوبات والإكسسوارات الأصلية',
  },
  description:
    'متجر القائد للتقنية — الوجهة الرائدة في المحلة الكبرى وسمنود لأحدث الهواتف الذكية، اللابتوبات، والإكسسوارات الأصلية مع ضمان معتمد وخدمة توصيل سريعة.',
  keywords: [
    'القائد للتقنية',
    'متجر القائد',
    'هواتف ذكية المحلة',
    'لابتوبات سمنود',
    'آيفون أصلي',
    'سامسونج',
    'إكسسوارات أصلية',
    'صيانة وضمان هواتف',
    'عروض أجهزة إلكترونية',
  ],
  authors: [{ name: 'متجر القائد للتقنية' }],
  creator: 'القائد للتقنية',
  publisher: 'القائد للتقنية',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'القائد للتقنية | هواتف، لابتوبات، وإكسسوارات أصلية معتمدة',
    description:
      'تسوق أحدث الهواتف واللابتوبات الأصلية والإكسسوارات مع ضمان معتمد في فروع المحلة الكبرى وسمنود.',
    url: siteUrl,
    siteName: 'متجر القائد للتقنية',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 800,
        alt: 'شعار متجر القائد للتقنية',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'القائد للتقنية | متجر الأجهزة والإلكترونيات الأصلية',
    description:
      'وجهتك المعتمدة لأحدث الهواتف الذكية واللابتوبات الأصلية بأفضل الأسعار وضمان معتمد.',
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ElectronicsStore',
  name: 'متجر القائد للتقنية',
  image: `${siteUrl}/images/logo.png`,
  url: siteUrl,
  telephone: '+201062085731',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ش محب الرئيسي',
    addressLocality: 'المحلة الكبرى',
    addressRegion: 'الغربية',
    addressCountry: 'EG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 30.9706,
    longitude: 31.1669,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '10:00',
      closes: '23:00',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${alexandria.variable} ${marhey.variable} ${alexandria.className}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F] font-sans antialiased selection:bg-gold selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
