'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNavLinks() {
  const pathname = usePathname();

  const links = [
    { name: 'المنتجات', href: '/admin/products', match: '/admin/products' },
    { name: 'فريق العمل', href: '/admin/team', match: '/admin/team' },
  ];

  return (
    <nav className="hidden sm:flex items-center gap-2">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.match);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`font-alexandria text-[13px] font-semibold px-4 py-2 rounded-xl transition-all ${
              isActive
                ? 'bg-gold text-white shadow-xs'
                : 'text-[#6B635B] hover:text-[#1F1F1F] hover:bg-[#F2EEE8]'
            }`}
          >
            {link.name}
          </Link>
        );
      })}

      <Link
        href="/products"
        target="_blank"
        className="font-alexandria text-[13px] font-medium text-muted-text hover:text-gold px-3 py-2 transition-colors inline-flex items-center gap-1.5"
      >
        <span>معاينة المتجر</span>
        <span className="text-xs">↗</span>
      </Link>
    </nav>
  );
}
