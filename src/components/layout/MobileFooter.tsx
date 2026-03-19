"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaTelegram, FaInstagram, FaFacebook } from "react-icons/fa";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { translations } from "@/src/lib/i18n/translations";

const MobileFooter = () => {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeT = (category: any, key: any) => {
    if (!mounted) {
      // @ts-ignore
      return translations.uz?.[category]?.[key] || String(key);
    }
    return t(category, key);
  };

  return (
    <footer className="md:hidden bg-white border-t border-border pt-12 pb-8">
      <div className="container-custom px-2.5">
        <div className="space-y-2.5 md:space-y-5">
          {/* Brand */}
          <div className="text-center">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black text-dark-text tracking-tight uppercase">
                Yashil <span className="text-primary">Yo&apos;l</span>
              </span>
            </Link>
            <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
              {safeT("footer", "tagline")}
            </p>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center space-y-2.5 md:space-y-5">
             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest underline decoration-primary/30 underline-offset-4 decoration-2">
                Connect with us
             </p>
             <div className="flex justify-center space-x-6">
                <a href="#" className="w-12 h-12 bg-light-bg flex items-center justify-center rounded-2xl text-primary border border-border">
                  <FaTelegram size={24} />
                </a>
                <a href="#" className="w-12 h-12 bg-light-bg flex items-center justify-center rounded-2xl text-primary border border-border">
                  <FaInstagram size={24} />
                </a>
                <a href="#" className="w-12 h-12 bg-light-bg flex items-center justify-center rounded-2xl text-primary border border-border">
                  <FaFacebook size={24} />
                </a>
             </div>
          </div>

          {/* Region Coverage */}
          <div className="p-2.5 bg-light-bg rounded-3xl border border-border text-center">
             <p className="text-xs font-bold text-gray-600">
                {safeT("footer", "coverage")}
             </p>
          </div>

          {/* Copyright & Links */}
          <div className="space-y-2.5 md:space-y-5 pt-6 border-t border-border text-center">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-bold text-gray-400 uppercase tracking-tighter">
              <Link href="/">{safeT("footer", "privacy")}</Link>
              <Link href="/">{safeT("footer", "cookie")}</Link>
              <Link href="/">{safeT("footer", "terms")}</Link>
            </div>
            <p className="text-gray-400 text-[10px] font-bold">
              © {new Date().getFullYear()} Yashil Yo&apos;l. {safeT("footer", "rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
