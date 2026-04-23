"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { HiUserCircle, HiLogout, HiUsers, HiChatAlt2 } from "react-icons/hi";
import { formatCurrency, cn } from "@/src/lib/utils";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLogout, useMe } from "@/src/features/auth/hooks/useAuth";
import { toast } from "sonner";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { translations } from "@/src/lib/i18n/translations";

const languageConfig = {
  uz: { name: "O'zbekcha", flag: "https://flagcdn.com/w40/uz.png" },
  ru: { name: "Русский", flag: "https://flagcdn.com/w40/ru.png" },
  en: { name: "English", flag: "https://flagcdn.com/w40/us.png" },
};

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const { user: storedUser, token, logout, _hasHydrated } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { mutate: logoutMutation } = useLogout();

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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        logout();
        toast.success(safeT("nav", "logout") + " successfully");
        window.location.href = "/";
      },
      onError: () => {
        logout();
        toast.success("Logged out locally");
        window.location.href = "/";
      },
    });
  };

  return (
    <nav className="hidden md:block bg-white border-b border-border sticky top-0 z-50 h-20">
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/logo/ketamiz-logo.webp" alt="Ketamiz" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {/* Service Group: Carpool | Bus */}
          <div className="flex items-center bg-light-bg border border-border rounded-full px-1 py-1">
            <Link
              href="/carpool"
              className="px-4 py-1.5 text-sm font-bold text-dark-text hover:text-primary transition-colors rounded-full hover:bg-white"
            >
              {safeT("nav", "carpool")}
            </Link>
            <span className="text-gray-300 mx-1">|</span>
            <Link
              href="/bus"
              className="px-4 py-1.5 text-sm font-bold text-dark-text hover:text-primary transition-colors rounded-full hover:bg-white"
            >
              {safeT("nav", "bus")}
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsProfileOpen(false);
              }}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all border border-transparent",
                isLangOpen ? "bg-light-bg border-border" : "hover:bg-light-bg",
              )}
            >
              <img
                src={languageConfig[language].flag}
                alt={languageConfig[language].name}
                className="w-5 h-3.5 object-cover rounded-sm"
              />
              <span className="text-[10px] md:text-xs font-bold uppercase text-dark-text">
                {language}
              </span>
            </button>
            <div
              className={cn(
                "absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-2xl border border-border transition-all duration-200 z-60 py-2",
                isLangOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2",
              )}
            >
              {(["uz", "ru", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setIsLangOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-2 transition-colors text-left",
                    language === lang
                      ? "bg-primary/5 text-primary font-bold"
                      : "text-dark-text hover:bg-light-bg",
                  )}
                >
                  <img
                    src={languageConfig[lang].flag}
                    alt={languageConfig[lang].name}
                    className="w-4 h-2.5 object-cover rounded-sm"
                  />
                  <span className="text-xs">{languageConfig[lang].name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsLangOpen(false);
              }}
              className={cn(
                "p-1 rounded-full transition-all border border-transparent hover:border-border",
                isProfileOpen ? "bg-light-bg border-border" : "hover:bg-light-bg",
              )}
            >
              <HiUserCircle
                className={cn(
                  "w-9 h-9 transition-colors",
                  isProfileOpen ? "text-primary" : "text-gray-400 hover:text-primary",
                )}
              />
            </button>

            <div
              className={cn(
                "absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-3xl border border-border transition-all duration-200 z-60 overflow-hidden",
                isProfileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2",
              )}
            >
              {mounted && _hasHydrated && user ? (
                <>
                  <div className="px-5 py-4 bg-light-bg/50 border-b border-border">
                    <p className="font-bold text-dark-text truncate text-sm md:text-base">
                      {user.first_name} {user.last_name}
                    </p>
                    <div className="mt-2 text-[10px] md:text-xs flex justify-between items-center text-gray-500 font-medium">
                      <span>{safeT("nav", "balance")}</span>
                      <span className="text-primary font-bold">
                        {formatCurrency(balance)}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-xs md:text-sm font-semibold text-gray-600 hover:bg-light-bg hover:text-primary rounded-lg transition-all"
                    >
                      <HiUsers className="w-5 h-5 opacity-70" />
                      <span>{t("nav", "dashboard")}</span>
                    </Link>
                    <Link
                      href="/support"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-xs md:text-sm font-semibold text-gray-600 hover:bg-light-bg hover:text-primary rounded-lg transition-all"
                    >
                      <HiChatAlt2 className="w-5 h-5 opacity-70" />
                      <span>{safeT("nav", "support")}</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs md:text-sm font-bold text-error hover:bg-error/5 rounded-lg transition-all mt-1"
                    >
                      <HiLogout className="w-5 h-5" />
                      <span>{safeT("nav", "logout")}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-2">
                  <div className="px-3 py-3 mb-2">
                    <p className="text-xs md:text-sm font-bold text-dark-text">
                      Welcome to Yashil Yo&apos;l
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                      Sign in to start your journey
                    </p>
                  </div>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 text-xs md:text-sm font-bold text-dark-text hover:bg-light-bg hover:text-primary rounded-lg transition-all"
                  >
                    <HiUsers className="w-5 h-5 opacity-70" />
                    <span>{safeT("nav", "login")}</span>
                  </Link>
                  <Link
                    href="/support"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 text-xs md:text-sm font-bold text-dark-text hover:bg-light-bg hover:text-primary rounded-lg transition-all border-t border-border mt-2 pt-3"
                  >
                    <HiChatAlt2 className="w-5 h-5 opacity-70" />
                    <span>{safeT("nav", "support")}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
