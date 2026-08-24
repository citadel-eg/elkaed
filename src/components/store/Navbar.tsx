"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/Icons";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const WHATSAPP_NUMBER = "201063905083";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "مرحبًا القائد، أود الاستفسار عن المنتجات والخدمات.",
  )}`;

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "الأقسام", href: "/categories" },
    { name: "المنتجات", href: "/products" },
    { name: "الفروع", href: "/branches" },
    { name: "من نحن", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-border-light transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-3.5 flex items-center justify-between">
        {/* Right side (RTL): Logo + Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8.5 h-10.5 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/images/logo.png"
              alt="شعار متجر القائد للتقنية"
              fill
              sizes="34px"
              priority
              className="object-cover"
            />
          </div>
          <span className="font-marhey font-bold text-[24px] text-gold tracking-tight">
            القائد
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link, idx) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={idx}
                href={link.href}
                className={`relative py-1 font-alexandria text-[14px] transition-colors ${
                  isActive
                    ? "text-[#1F1F1F] font-bold after:absolute after:-bottom-0.5 after:right-0 after:left-0 after:h-0.5 after:bg-gold"
                    : "text-[#6B635B] hover:text-gold"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Left side (RTL): WhatsApp CTA button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] bg-gold hover:bg-gold-hover text-white font-alexandria font-bold text-[14px] shadow-sm transition-all hover:shadow hover:-translate-y-0.5 cursor-pointer"
          >
            <span>تواصل معنا</span>
            <WhatsAppIcon className="w-4 h-4 text-white" />
          </a>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="القائمة الرئيسية"
            className="lg:hidden p-2 rounded-xl border border-border-light bg-white text-[#1F1F1F] hover:text-gold hover:border-gold transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-light bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-alexandria font-bold text-[#1F1F1F] hover:bg-black/5 hover:text-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-border-light">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[20px] bg-gold hover:bg-gold-hover text-white text-sm font-alexandria font-bold shadow-sm transition-all"
            >
              <span>تواصل معنا عبر واتساب</span>
              <WhatsAppIcon className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
