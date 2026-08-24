import { getAdminSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { LoginForm } from './LoginForm';

interface LoginPageProps {
  searchParams: Promise<{ from?: string }>;
}

export const metadata = {
  title: 'تسجيل دخول الإدارة | متجر القائد للتقنية',
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const session = await getAdminSession();
  const params = await searchParams;

  if (session.isLoggedIn) {
    redirect('/admin/products');
  }

  return (
    <div className="h-svh w-full overflow-hidden flex items-center justify-center bg-[#FCFBF8] p-4" dir="rtl">
      <div className="w-full max-w-md bg-white border border-border-light rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-12 h-14 mx-auto">
            <Image
              src="/images/logo.png"
              alt="شعار القائد"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-1">
            <h1 className="font-marhey font-bold text-2xl text-[#1F1F1F]">
              لوحة تحكم القائد
            </h1>
            <p className="font-alexandria font-normal text-xs text-muted-text">
              سجل الدخول باستخدام بيانات المشرف لإدارة المتجر
            </p>
          </div>
        </div>

        <LoginForm redirectTo={params.from} />
      </div>
    </div>
  );
}
