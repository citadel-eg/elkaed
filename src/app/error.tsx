'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { WhatsAppIcon, ArrowLeftIcon } from '@/components/ui/Icons';
import { WHATSAPP_NUMBER } from '@/lib/constants';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `مرحبًا القائد، واجهت خطأ أثناء تصفح الموقع: ${error.message || 'خطأ غير معروف'}${
      error.digest ? ` (رمز الخطأ: ${error.digest})` : ''
    }`
  )}`;

  return (
    <div className="min-h-[75vh] w-full bg-[#FCFBF8] flex items-center justify-center px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
      <div className="max-w-xl w-full text-center space-y-8 bg-white border border-border-light rounded-3xl p-8 sm:p-12 shadow-sm">
        {/* Error Badge / Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#FBF3E8] border-2 border-gold flex items-center justify-center text-gold shadow-sm">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Heading & Details */}
        <div className="space-y-3">
          <h1 className="font-marhey font-semibold text-[26px] sm:text-[32px] text-[#1F1F1F] leading-snug">
            حدث خطأ غير متوقع
          </h1>
          <p className="font-alexandria font-normal text-[14px] sm:text-[16px] text-[#6B635B] leading-relaxed">
            نعتذر عن هذا العطل المؤقت. يمكنك الضغط على زر إعادة المحاولة، أو العودة للصفحة الرئيسية.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[14px] sm:text-[15px] shadow-md shadow-gold/20 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>إعادة المحاولة</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-gold hover:bg-gold/10 text-gold font-alexandria font-bold text-[14px] transition-all cursor-pointer whitespace-nowrap"
          >
            <span>الرئيسية</span>
            <ArrowLeftIcon className="w-4 h-4 text-gold shrink-0" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full border border-[#DCD4CA] hover:border-[#1F1F1F] text-[#1F1F1F] font-alexandria font-medium text-[13px] transition-all cursor-pointer whitespace-nowrap"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>إبلاغ بالخطأ</span>
          </a>
        </div>

        {error.digest && (
          <p className="font-alexandria font-normal text-[11px] text-[#A69B8F] pt-2" dir="ltr">
            Digest Code: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
