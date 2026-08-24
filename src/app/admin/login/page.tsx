import { getAdminSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';

interface LoginPageProps {
  searchParams: Promise<{ from?: string }>;
}

export const metadata = {
  title: 'Admin Login - Store Management',
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const session = await getAdminSession();
  const params = await searchParams;

  if (session.isLoggedIn) {
    redirect('/admin/products');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Admin Portal</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Sign in with server-configured administrator credentials
          </p>
        </div>

        <LoginForm redirectTo={params.from} />
      </div>
    </div>
  );
}
