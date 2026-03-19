"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HiMenu,
  HiX,
  HiSearch,
  HiUserCircle,
  HiLogout,
  HiUsers,
  HiTicket,
  HiChatAlt2,
} from "react-icons/hi";
import { formatCurrency, cn } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLogout } from "@/src/features/auth/hooks/useAuth";
import { toast } from "sonner";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { HiChevronDown } from "react-icons/hi";
import { translations } from "@/src/lib/i18n/translations";

const languageConfig = {
  uz: { name: "O'zbekcha", flag: "https://flagcdn.com/w40/uz.png" },
  ru: { name: "Русский", flag: "https://flagcdn.com/w40/ru.png" },
  en: { name: "English", flag: "https://flagcdn.com/w40/us.png" },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { mutate: logoutMutation } = useLogout();
  const [balance] = useState(150000); // Mock balance for now

  // Use Uzbek for SSR and initial client render to avoid hydration mismatch,
  // then switch to user's preferred language after mounting.
  const safeT = (category: any, key: any) => {
    if (!mounted) {
      // @ts-ignore
      return translations.uz?.[category]?.[key] || String(key);
    }
    return t(category, key);
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        logout();
        toast.success(safeT("nav", "logout") + " successfully");
        window.location.href = "/";
      },
      onError: () => {
        // Even if API fails, we might want to logout locally
        logout();
        toast.success("Logged out locally");
        window.location.href = "/";
      },
    });
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                Y
              </div>
              <span className="text-2xl font-black text-dark-text tracking-tight">
                Yashil <span className="text-primary">Yo&apos;l</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/rides"
              className="text-dark-text font-semibold hover:text-primary transition-colors flex items-center"
            >
              <HiSearch className="mr-2 w-5 h-5" />
              {safeT("nav", "findRide")}
            </Link>

            <Link
              href="/carpool"
              className="text-dark-text font-semibold hover:text-primary transition-colors flex items-center"
            >
              <HiUsers className="mr-2 w-5 h-5" />
              {safeT("nav", "carpool")}
            </Link>

            <Link
              href="/bus"
              className="text-dark-text font-semibold hover:text-primary transition-colors flex items-center"
            >
              <HiTicket className="mr-2 w-5 h-5" />
              {safeT("nav", "bus")}
            </Link>

            <Link
              href="/support"
              className="text-dark-text font-semibold hover:text-primary transition-colors flex items-center"
            >
              <HiChatAlt2 className="mr-2 w-5 h-5" />
              {safeT("nav", "support")}
            </Link>

            {mounted && user ? (
              <div className="flex items-center space-x-6">
                <div className="bg-light-bg px-4 py-2 rounded-xl border border-border">
                  <span className="text-xs text-gray-500 block leading-none mb-1">
                    {safeT("nav", "balance")}
                  </span>
                  <span className="text-dark-text font-bold leading-none">
                    {mounted ? formatCurrency(balance) : "---"}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 bg-white hover:bg-light-bg p-1 pr-3 rounded-full border border-border transition-all"
                  >
                    <HiUserCircle className="w-9 h-9 text-primary" />
                    <span className="font-semibold text-dark-text">
                      {user.first_name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-error hover:bg-error/5 rounded-xl transition-all"
                    title="Logout"
                  >
                    <HiLogout className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-dark-text font-semibold hover:text-primary transition-colors px-4 py-2"
                >
                  {safeT("nav", "login")}
                </Link>
                <Link href="/auth/register">
                  <Button size="md">{safeT("nav", "joinFree")}</Button>
                </Link>
              </div>
            )}

            {/* Language Switcher Dropdown */}
            <div className="relative group ml-4 border-l border-border pl-4">
              <button className="flex items-center space-x-2 px-3 py-2 hover:bg-light-bg rounded-xl transition-all border border-transparent hover:border-border">
                <img
                  src={languageConfig[language].flag}
                  alt={languageConfig[language].name}
                  className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                />
                <span className="text-xs font-bold uppercase text-dark-text">
                  {language}
                </span>
                <HiChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-60 py-2">
                {(["uz", "ru", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 transition-colors text-left",
                      language === lang
                        ? "bg-primary/5 text-primary font-bold"
                        : "text-dark-text hover:bg-light-bg",
                    )}
                  >
                    <img
                      src={languageConfig[lang].flag}
                      alt={languageConfig[lang].name}
                      className="w-5 h-3.5 object-cover rounded-sm"
                    />
                    <span className="text-sm">{languageConfig[lang].name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-light-bg transition-colors"
            >
              {isOpen ? (
                <HiX className="w-7 h-7" />
              ) : (
                <HiMenu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-border animate-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <Link
              href="/rides"
              className="block px-4 py-3 text-lg font-semibold text-dark-text hover:bg-light-bg rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {safeT("nav", "findRide")}
            </Link>
            <Link
              href="/carpool"
              className="block px-4 py-3 text-lg font-semibold text-dark-text hover:bg-light-bg rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {safeT("nav", "carpool")}
            </Link>
            <Link
              href="/bus"
              className="block px-4 py-3 text-lg font-semibold text-dark-text hover:bg-light-bg rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {safeT("nav", "bus")}
            </Link>
            <Link
              href="/support"
              className="block px-4 py-3 text-lg font-semibold text-dark-text hover:bg-light-bg rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {safeT("nav", "support")}
            </Link>
            {mounted && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-lg font-semibold text-dark-text hover:bg-light-bg rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Dashboard ({user.first_name})
                </Link>
                <div className="px-4 py-3 bg-light-bg rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      {safeT("nav", "balance")}
                    </span>
                    <span className="text-xl font-bold text-dark-text">
                      {mounted ? formatCurrency(balance) : "---"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-error font-bold px-4 py-2 hover:bg-error/5 rounded-xl transition-all"
                  >
                    <HiLogout className="w-5 h-5" />
                    <span>{safeT("nav", "logout")}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" fullWidth>
                    {safeT("nav", "login")}
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                  <Button fullWidth>{safeT("nav", "signup")}</Button>
                </Link>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
              {(["uz", "ru", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex flex-col items-center space-y-2 p-3 rounded-2xl transition-all border",
                    language === lang
                      ? "bg-primary text-white border-primary shadow-xl shadow-primary/20"
                      : "bg-white text-gray-500 border-border hover:border-primary/50",
                  )}
                >
                  <img
                    src={languageConfig[lang].flag}
                    alt={languageConfig[lang].name}
                    className="w-8 h-5 object-cover rounded shadow-sm"
                  />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {lang}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
