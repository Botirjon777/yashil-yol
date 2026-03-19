"use client";

import React, { useState, useEffect } from "react";
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
  HiChevronDown,
} from "react-icons/hi";
import { formatCurrency, cn } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLogout } from "@/src/features/auth/hooks/useAuth";
import { toast } from "sonner";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
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

  const safeT = (category: any, key: any) => {
    if (!mounted) {
      // @ts-ignore
      return translations.uz?.[category]?.[key] || String(key);
    }
    return t(category, key);
  };

  useEffect(() => {
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
        logout();
        toast.success("Logged out locally");
        window.location.href = "/";
      },
    });
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl md:text-2xl font-black text-dark-text tracking-tight uppercase">
                Yashil <span className="text-primary">Yo&apos;l</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {/* Search Icon Only */}
            <Link
              href="/rides"
              className="p-2 text-dark-text hover:text-primary transition-colors hover:bg-light-bg rounded-full"
              title={safeT("nav", "findRide")}
            >
              <HiSearch className="w-6 h-6" />
            </Link>

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
            <div className="relative group/lang">
              <button className="flex items-center space-x-2 px-3 py-1.5 hover:bg-light-bg rounded-xl transition-all border border-transparent hover:border-border">
                <img
                  src={languageConfig[language].flag}
                  alt={languageConfig[language].name}
                  className="w-5 h-3.5 object-cover rounded-sm"
                />
                <span className="text-xs font-bold uppercase text-dark-text">
                  {language}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-border opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-200 z-60 py-2">
                {(["uz", "ru", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-2 transition-colors text-left",
                      language === lang ? "bg-primary/5 text-primary font-bold" : "text-dark-text hover:bg-light-bg"
                    )}
                  >
                    <img src={languageConfig[lang].flag} alt={languageConfig[lang].name} className="w-4 h-2.5 object-cover rounded-sm" />
                    <span className="text-xs">{languageConfig[lang].name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative group/profile">
              <button className="p-1 hover:bg-light-bg rounded-full transition-all border border-transparent hover:border-border">
                <HiUserCircle className="w-9 h-9 text-gray-400 group-hover/profile:text-primary transition-colors" />
              </button>

              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-3xl border border-border opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 z-60 overflow-hidden">
                {mounted && user ? (
                  <>
                    <div className="px-5 py-4 bg-light-bg/50 border-b border-border">
                      <p className="font-bold text-dark-text truncate">{user.first_name} {user.last_name}</p>
                      <div className="mt-2 text-xs flex justify-between items-center text-gray-500 font-medium">
                        <span>{safeT("nav", "balance")}</span>
                        <span className="text-primary font-bold">{formatCurrency(balance)}</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-light-bg hover:text-primary rounded-xl transition-all">
                        <HiUsers className="w-5 h-5 opacity-70" />
                        <span>Dashboard</span>
                      </Link>
                      <Link href="/support" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-light-bg hover:text-primary rounded-xl transition-all">
                        <HiChatAlt2 className="w-5 h-5 opacity-70" />
                        <span>Support Center</span>
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-bold text-error hover:bg-error/5 rounded-xl transition-all mt-1">
                        <HiLogout className="w-5 h-5" />
                        <span>{safeT("nav", "logout")}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-2">
                    <div className="px-3 py-3 mb-2">
                      <p className="text-sm font-bold text-dark-text">Welcome to Yashil Yo&apos;l</p>
                      <p className="text-xs text-gray-500 mt-1">Sign in to start your journey</p>
                    </div>
                    <Link href="/auth/login" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-bold text-dark-text hover:bg-light-bg hover:text-primary rounded-xl transition-all">
                      <HiUsers className="w-5 h-5 opacity-70" />
                      <span>{safeT("nav", "login")}</span>
                    </Link>
                    <Link href="/auth/register" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-bold text-dark-text hover:bg-light-bg hover:text-primary rounded-xl transition-all">
                      <HiUsers className="w-5 h-5 opacity-70" />
                      <span>{safeT("nav", "signup")}</span>
                    </Link>
                    <Link href="/support" className="flex items-center space-x-3 px-3 py-2.5 text-sm font-bold text-dark-text hover:bg-light-bg hover:text-primary rounded-xl transition-all border-t border-border mt-2 pt-3">
                      <HiChatAlt2 className="w-5 h-5 opacity-70" />
                      <span>{safeT("nav", "support")}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
             {/* Profile icon for quick access on mobile could be here, but let's stick to the hamburger menu as standard */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-light-bg transition-colors"
            >
              {isOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-border animate-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-6">
               <Link href="/carpool" onClick={() => setIsOpen(false)} className="flex flex-col items-center justify-center p-4 bg-light-bg rounded-2xl border border-border">
                  <HiUsers className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs font-bold">{safeT("nav", "carpool")}</span>
               </Link>
               <Link href="/bus" onClick={() => setIsOpen(false)} className="flex flex-col items-center justify-center p-4 bg-light-bg rounded-2xl border border-border">
                  <HiTicket className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs font-bold">{safeT("nav", "bus")}</span>
               </Link>
            </div>

            <Link href="/rides" className="flex items-center space-x-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-bold" onClick={() => setIsOpen(false)}>
              <HiSearch className="w-5 h-5" />
              <span>{safeT("nav", "findRide")}</span>
            </Link>

            <div className="border-t border-border pt-4">
              {mounted && user ? (
                <div className="space-y-3">
                   <div className="flex items-center space-x-4 px-4 py-2">
                      <HiUserCircle className="w-12 h-12 text-primary" />
                      <div>
                        <p className="font-bold text-dark-text leading-none">{user.first_name}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatCurrency(balance)}</p>
                      </div>
                   </div>
                   <Link href="/dashboard" className="block px-4 py-3 text-gray-600 font-semibold hover:bg-light-bg rounded-xl" onClick={() => setIsOpen(false)}>Dashboard</Link>
                   <Link href="/support" className="block px-4 py-3 text-gray-600 font-semibold hover:bg-light-bg rounded-xl" onClick={() => setIsOpen(false)}>Support</Link>
                   <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-error font-bold hover:bg-error/5 rounded-xl">Logout</button>
                </div>
              ) : (
                <div className="space-y-3">
                   <Link href="/auth/login" className="block px-4 py-3 text-dark-text font-bold hover:bg-light-bg rounded-xl" onClick={() => setIsOpen(false)}>Login</Link>
                   <Link href="/auth/register" className="block px-4 py-3 text-white bg-primary text-center rounded-xl font-bold" onClick={() => setIsOpen(false)}>Sign Up</Link>
                   <Link href="/support" className="block px-4 py-3 text-dark-text font-bold hover:bg-light-bg rounded-xl" onClick={() => setIsOpen(false)}>Support Center</Link>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border">
              {(["uz", "ru", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setIsOpen(false); }}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-2xl border transition-all",
                    language === lang ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-gray-500 border-border"
                  )}
                >
                  <img src={languageConfig[lang].flag} alt={lang} className="w-6 h-4 object-cover rounded shadow-sm mb-1" />
                  <span className="text-[10px] font-bold uppercase">{lang}</span>
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
