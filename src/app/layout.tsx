import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: {
    template: '%s | القائد للتقنية',
    default: 'القائد | وجهتك للتقنية — هواتف، لابتوبات، وإكسسوارات أصلية',
  },
  description:
    'القائد للتقنية — موبايلات، لابتوبات، وإكسسوارات معتمدة. نختار اللي تحتاجه ونتواصل معك ونوصله لك بسرعة.',
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
    >
      <body className="min-h-screen bg-[#FAF8F5] text-[#1F1F1F] font-sans antialiased selection:bg-gold selection:text-white">
        {children}
      </body>
    </html>
  );
}
