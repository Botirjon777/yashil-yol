"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTelegram, FaInstagram, FaFacebook } from "react-icons/fa";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { translations } from "@/src/lib/i18n/translations";

const Footer = () => {
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
    <footer className="hidden md:block bg-white border-t border-border pt-10 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <span className="text-xl md:text-2xl font-black text-dark-text tracking-tight uppercase">
                Yashil <span className="text-primary">Yo&apos;l</span>
              </span>
            </Link>
            <p className="text-gray-500 leading-relaxed font-medium">
              {safeT("footer", "tagline")}
            </p>
          </div>

          <div>
            <h4 className="text-dark-text font-bold text-lg mb-6">
              {safeT("footer", "explore")}
            </h4>
            <ul className="space-y-2.5 md:space-y-5">
              <li>
                <Link
                  href="/rides"
                  className="text-gray-500 hover:text-primary font-medium transition-colors"
                >
                  {safeT("nav", "findRide")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-primary font-medium transition-colors"
                >
                  {safeT("footer", "howItWorks")}
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-gray-500 hover:text-primary font-medium transition-colors"
                >
                  {safeT("footer", "becomeDriver")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-dark-text font-bold text-lg mb-6">
              {safeT("footer", "company")}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-primary font-medium transition-colors"
                >
                  {safeT("footer", "about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-primary font-medium transition-colors"
                >
                  {safeT("footer", "contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-primary font-medium transition-colors"
                >
                  {safeT("footer", "terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-dark-text font-bold text-lg mb-6">
              {safeT("footer", "connect")}
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-light-bg flex items-center justify-center rounded-xl text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <FaTelegram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-light-bg flex items-center justify-center rounded-xl text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-light-bg flex items-center justify-center rounded-xl text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <FaFacebook size={20} />
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400 font-medium">
              {safeT("footer", "coverage")}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-400 text-sm font-medium mb-4 md:mb-0">
            © {new Date().getFullYear()} Yashil Yo&apos;l.{" "}
            {safeT("footer", "rights")}
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              {safeT("footer", "privacy")}
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              {safeT("footer", "cookie")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
