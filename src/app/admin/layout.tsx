import Link from 'next/link';
import { getAdminSession } from '@/lib/auth/session';

export const metadata = {
  title: 'Admin Dashboard - Store Management',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/products"
              className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Admin Dashboard
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
              <Link
                href="/admin/products"
                className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/admin/products/new"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                + Add Product
              </Link>
              <Link
                href="/products"
                target="_blank"
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
              >
                Storefront ↗
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {session.isLoggedIn && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 hidden md:inline-block">
                  Logged in as <strong className="text-zinc-800 dark:text-zinc-200">{session.username}</strong>
                </span>
                <form action="/admin/logout" method="POST">
                  <button
                    type="submit"
                    className="text-xs font-medium px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </form>
              </div>
            )}
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
