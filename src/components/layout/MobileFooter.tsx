"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTelegram, FaInstagram, FaFacebook } from "react-icons/fa";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { translations } from "@/src/lib/i18n/translations";
import { usePathname } from "next/navigation";

const MobileFooter = () => {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguageStore();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith("/dashboard")) return null;

  const safeT = (category: any, key: any) => {
    if (!mounted) {
      // @ts-ignore
      return translations.uz?.[category]?.[key] || String(key);
    }
    return t(category, key);
  };

  return (
    <footer className="md:hidden bg-navbar-bg border-t border-border pt-2.5 pb-5">
      <div className="container-custom px-2.5">
        <div className="space-y-2.5 md:space-y-5">
          {/* Brand */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <img
                src="/assets/logo/ketamiz-logo.webp"
                alt="Ketamiz"
                className="h-18 w-auto mx-auto"
              />
            </Link>
            <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
              {safeT("footer", "tagline")}
            </p>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center space-y-2.5 md:space-y-5">
            <div className="flex justify-center space-x-6">
              <a
                href="#"
                className="w-12 h-12 bg-light-bg flex items-center justify-center rounded-2xl text-primary border border-border"
              >
                <FaTelegram size={24} />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-light-bg flex items-center justify-center rounded-2xl text-primary border border-border"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-light-bg flex items-center justify-center rounded-2xl text-primary border border-border"
              >
                <FaFacebook size={24} />
              </a>
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="space-y-2.5 md:space-y-5 pt-6 border-t border-border text-center">
            <div
              className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-500"
              suppressHydrationWarning
            >
              <Link href="/about-us">{safeT("footer", "about")}</Link>
              <Link href="/support">{safeT("footer", "contact")}</Link>
              <Link href="/terms">{safeT("footer", "terms")}</Link>
            </div>
            <p className="text-gray-400 text-sm font-medium">
              &copy; {new Date().getFullYear()} Ketamiz.{" "}
              {safeT("footer", "rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
