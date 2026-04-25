"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HiMenu } from "react-icons/hi";
import { motion } from "framer-motion";
import MobileSidebar from "./MobileSidebar";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useMe } from "@/src/features/auth/hooks/useAuth";
import { formatCurrency } from "@/src/lib/utils";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { translations } from "@/src/lib/i18n/translations";

const MobileNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const { user: storedUser, token, _hasHydrated } = useAuthStore();
  const { language, t } = useLanguageStore();
  const { data: meData } = useMe(!!token);
  const user = meData?.user || storedUser;
  const balance = user?.balance?.balance ? parseFloat(user.balance.balance) : 0;

  const safeT = (category: any, key: any) => {
    if (!mounted) {
      // @ts-ignore
      return translations.uz?.[category]?.[key] || String(key);
    }
    return t(category, key);
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`md:hidden bg-navbar-bg fixed top-0 left-0 right-0 z-50 h-16 transition-shadow duration-300 ${scrolled
        ? "shadow-md border-b border-border/60"
        : "border-b border-border"
        }`}
    >
      <div className="h-full flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/assets/logo/ketamiz-logo-small.webp" alt="Ketamiz" className="h-10 w-auto" />
        </Link>

        {/* Current route indicator — subtle breadcrumb feel */}
        <div className="flex items-center gap-3">
          {mounted && _hasHydrated && user && (
            <Link 
              href="/dashboard"
              className="flex flex-col items-end px-3 py-1 bg-primary/5 border border-primary/10 rounded-xl active:scale-95 transition-transform"
            >
              <span className="text-[8px] font-black uppercase text-gray-400 leading-none mb-0.5 tracking-tighter">
                {safeT("nav", "balance")}
              </span>
              <span className="text-xs font-black text-primary leading-none">
                {formatCurrency(balance)}
              </span>
            </Link>
          )}

          {/* Hamburger */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-dark-text hover:text-primary transition-colors hover:bg-light-bg rounded-xl"
            aria-label="Open menu"
          >
            <HiMenu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </nav>
  );
};

export default MobileNavbar;
