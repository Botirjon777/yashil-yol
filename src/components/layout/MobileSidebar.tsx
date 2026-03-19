"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiX,
  HiSearch,
  HiUsers,
  HiTicket,
  HiUserCircle,
  HiLogout,
  HiChatAlt2,
  HiChevronRight,
} from "react-icons/hi";
import { cn, formatCurrency } from "@/src/lib/utils";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { translations } from "@/src/lib/i18n/translations";
import { useLogout } from "@/src/features/auth/hooks/useAuth";
import { toast } from "sonner";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const languageConfig = {
  uz: { name: "O'zbekcha", flag: "https://flagcdn.com/w40/uz.png" },
  ru: { name: "Русский", flag: "https://flagcdn.com/w40/ru.png" },
  en: { name: "English", flag: "https://flagcdn.com/w40/us.png" },
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { mutate: logoutMutation } = useLogout();
  const [mounted, setMounted] = useState(false);
  const [balance] = useState(150000);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const safeT = (category: any, key: any) => {
    if (!mounted) {
      // @ts-ignore
      return translations.uz?.[category]?.[key] || String(key);
    }
    return t(category, key);
  };

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        logout();
        toast.success(safeT("nav", "logout") + " successfully");
        onClose();
        window.location.href = "/";
      },
      onError: () => {
        logout();
        onClose();
        window.location.href = "/";
      },
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-dark-text/40 backdrop-blur-sm z-60 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-70 shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="p-2.5 flex items-center justify-between border-b border-border bg-light-bg/30">
          <span className="text-lg font-black text-dark-text uppercase">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-primary transition-colors"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 md:space-y-5">
          {/* User Section */}
          <div className="space-y-2.5 md:space-y-5">
            {mounted && user ? (
              <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg border border-primary/20 flex items-center justify-center overflow-hidden">
                    <HiUserCircle className="w-10 h-10 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-dark-text truncate text-sm md:text-base">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider truncate">
                      Member since 2024
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/60 p-2 rounded-lg border border-primary/5">
                    <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-tighter mb-1">
                      {safeT("nav", "balance")}
                    </p>
                    <p className="text-xs md:text-sm font-black text-primary">
                      {formatCurrency(150000)}
                    </p>
                  </div>
                  <Link 
                    href="/dashboard"
                    onClick={onClose}
                    className="bg-primary text-white p-2 rounded-lg flex flex-col justify-center items-center hover:bg-secondary transition-colors"
                  >
                    <HiUsers className="w-4 h-4 mb-1" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter">
                      Dashboard
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/auth/login"
                  onClick={onClose}
                  className="flex items-center justify-center p-2.5 bg-light-bg rounded-lg border border-border text-xs font-bold text-dark-text"
                >
                  {safeT("nav", "login")}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={onClose}
                  className="flex items-center justify-center p-2.5 bg-primary rounded-lg text-xs font-bold text-white shadow-lg shadow-primary/20"
                >
                  {safeT("nav", "signup")}
                </Link>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5 md:space-y-5">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">
              Services
            </p>
            <Link
              href="/rides"
              onClick={onClose}
              className="flex items-center space-x-4 p-2.5 hover:bg-light-bg rounded-lg transition-colors border border-transparent hover:border-border"
            >
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <HiSearch className="w-5 h-5" />
              </div>
              <span className="font-bold text-dark-text">
                {safeT("nav", "findRide")}
              </span>
            </Link>
            <Link
              href="/carpool"
              onClick={onClose}
              className="flex items-center space-x-4 p-2.5 hover:bg-light-bg rounded-lg transition-colors border border-transparent hover:border-border"
            >
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                <HiUsers className="w-5 h-5" />
              </div>
              <span className="font-bold text-dark-text">
                {safeT("nav", "carpool")}
              </span>
            </Link>
            <Link
              href="/bus"
              onClick={onClose}
              className="flex items-center space-x-4 p-2.5 hover:bg-light-bg rounded-lg transition-colors border border-transparent hover:border-border"
            >
              <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
                <HiTicket className="w-5 h-5" />
              </div>
              <span className="font-bold text-dark-text">
                {safeT("nav", "bus")}
              </span>
            </Link>
            <Link
              href="/support"
              onClick={onClose}
              className="flex items-center space-x-4 p-2.5 hover:bg-light-bg rounded-2xl transition-colors border border-transparent hover:border-border"
            >
              <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center">
                <HiChatAlt2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-dark-text">Support Center</span>
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="space-y-2.5 md:space-y-5 pt-4 border-t border-border">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
              Language
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(["uz", "ru", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    onClose();
                  }}
                  className={cn(
                    "flex flex-col items-center p-2.5 rounded-2xl border transition-all",
                    language === lang
                      ? "bg-primary text-white border-primary shadow-lg"
                      : "bg-white text-gray-500 border-border",
                  )}
                >
                  <img
                    src={languageConfig[lang].flag}
                    alt={lang}
                    className="w-7 h-5 object-cover rounded shadow-sm mb-1.5"
                  />
                  <span className="text-[10px] font-black uppercase">
                    {lang}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        {mounted && user && (
          <div className="p-2.5 border-t border-border bg-light-bg/30">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full p-2.5 bg-error/10 text-error rounded-2xl font-bold hover:bg-error/20 transition-colors"
            >
              <HiLogout className="w-5 h-5" />
              <span>{safeT("nav", "logout")}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileSidebar;
