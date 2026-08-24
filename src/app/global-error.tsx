'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Critical root error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#FCFBF8] text-[#1F1F1F] font-sans antialiased m-0 p-0">
        <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-8 py-16">
          <div className="max-w-md w-full text-center space-y-6 bg-white border border-border-light rounded-3xl p-8 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FBF3E8] border-2 border-gold flex items-center justify-center text-gold">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-[#1F1F1F]">
                حدث خطأ في النظام
              </h1>
              <p className="text-sm text-[#6B635B] leading-relaxed">
                نعتذر، حدث خلل أثناء تحميل الصفحة. يرجى إعادة المحاولة.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => reset()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-bold text-sm shadow-md cursor-pointer transition-all"
              >
                إعادة المحاولة
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 rounded-full border border-gold text-gold font-bold text-sm hover:bg-gold/10 transition-all"
              >
                الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
