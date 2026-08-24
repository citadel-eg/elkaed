import Link from 'next/link';
import Image from 'next/image';
import { getAdminSession } from '@/lib/auth/session';
import { AdminNavLinks } from '@/components/admin/AdminNavLinks';

export const metadata = {
  title: 'لوحة التحكم - متجر القائد للتقنية',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#1F1F1F]" dir="rtl">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-light shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/admin/products" className="flex items-center gap-2.5 group">
              <div className="relative w-7 h-9 shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="شعار القائد"
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </div>
              <div className="text-start">
                <span className="font-marhey font-bold text-xl text-gold block leading-none">
                  لوحة التحكم
                </span>
                <span className="font-alexandria font-normal text-[11px] text-muted-text">
                  متجر القائد للتقنية
                </span>
              </div>
            </Link>

            {/* Navigation items component for active state highlighting */}
            <AdminNavLinks />
          </div>

          {/* User Session & Logout */}
          <div className="flex items-center gap-3">
            {session.isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-start">
                  <span className="font-alexandria font-bold text-xs text-[#1F1F1F]">
                    {session.username}
                  </span>
                  <span className="font-alexandria text-[11px] text-gold font-medium">
                    مشرف النظام
                  </span>
                </div>
                <form action="/admin/logout" method="POST">
                  <button
                    type="submit"
                    className="font-alexandria text-xs font-semibold px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>خروج</span>
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
