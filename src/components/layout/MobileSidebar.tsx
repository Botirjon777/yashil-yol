"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiX,
  HiSearch,
  HiUsers,
  HiTicket,
  HiLogout,
  HiChatAlt2,
  HiHome,
  HiTruck,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatCurrency } from "@/src/lib/utils";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { translations } from "@/src/lib/i18n/translations";
import { useLogout, useMe } from "@/src/features/auth/hooks/useAuth";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const languageConfig = {
  uz: { name: "O'zbekcha", flag: "https://flagcdn.com/w40/uz.png" },
  ru: { name: "Русский", flag: "https://flagcdn.com/w40/ru.png" },
  en: { name: "English", flag: "https://flagcdn.com/w40/us.png" },
};

const navLinks = [
  {
    href: "/",
    label: "home",
    icon: HiHome,
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/rides",
    label: "findRide",
    icon: HiSearch,
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/carpool",
    label: "carpool",
    icon: HiUsers,
    color: "bg-accent/10 text-accent",
  },
  {
    href: "/bus",
    label: "bus",
    icon: HiTicket,
    color: "bg-secondary/10 text-secondary",
  },
  {
    href: "/become-a-driver",
    label: "becomeDriver",
    icon: HiTruck,
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/support",
    label: "support",
    icon: HiChatAlt2,
    color: "bg-gray-100 text-gray-500",
  },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 320,
      damping: 32,
      mass: 0.9,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "spring" as const,
      stiffness: 380,
      damping: 40,
      mass: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.045 + 0.1,
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
    },
  }),
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { user: storedUser, token, logout, _hasHydrated } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { mutate: logoutMutation } = useLogout();
  const [mounted, setMounted] = useState(false);

  const { data: meData } = useMe(!!token);
  const user = meData?.user || storedUser;
  const balance = user?.balance?.balance ? parseFloat(user.balance.balance) : 0;
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sidebar-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-dark-text/50 backdrop-blur-[3px] z-60"
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.div
            key="sidebar-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-white z-70 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-border bg-linear-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-black text-[10px] tracking-tight">
                    YY
                  </span>
                </div>
                <span className="text-sm font-black text-dark-text uppercase tracking-tight">
                  Yashil <span className="text-primary">Yo'l</span>
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.88, rotate: 90 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
              >
                <HiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* User Section */}
              <motion.div
                custom={0}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="p-4"
              >
                {mounted && _hasHydrated && user ? (
                  <div className="p-4 bg-linear-to-br from-primary/8 to-secondary/5 rounded-2xl border border-primary/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-white border-2 border-primary/20 flex items-center justify-center text-primary font-black shadow-sm">
                        {user.first_name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-dark-text text-sm truncate">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
                          {user.role === "driver" ? "Driver" : "Passenger"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/70 p-3 rounded-xl border border-primary/5">
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">
                          {safeT("nav", "balance")}
                        </p>
                        <p className="text-sm font-black text-primary">
                          {formatCurrency(balance)}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="bg-primary text-white p-3 rounded-xl flex flex-col justify-center items-center hover:bg-primary/90 transition-colors active:scale-95"
                      >
                        <HiUsers className="w-4 h-4 mb-1" />
                        <span className="text-[9px] font-black uppercase tracking-tight">
                          {t("nav", "dashboard")}
                        </span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center p-3 bg-light-bg rounded-xl border border-border text-xs font-bold text-dark-text active:scale-95 transition-transform"
                    >
                      {safeT("nav", "login")}
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center justify-center p-3 bg-primary rounded-xl text-xs font-bold text-white shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                    >
                      {safeT("nav", "signup")}
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Divider */}
              <div className="mx-4 border-t border-border/60" />

              {/* Navigation Links */}
              <div className="p-4 space-y-1">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 px-1">
                  {safeT("nav", "services")}
                </p>
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      custom={i + 1}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3.5 p-3 rounded-xl transition-all active:scale-[0.98]",
                          isActive
                            ? "bg-primary/8 border border-primary/15"
                            : "hover:bg-light-bg border border-transparent",
                        )}
                      >
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                            link.color,
                          )}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <span
                          className={cn(
                            "font-bold text-sm",
                            isActive ? "text-primary" : "text-dark-text",
                          )}
                        >
                          {safeT("nav", link.label)}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="mx-4 border-t border-border/60" />

              {/* Language Switcher */}
              <motion.div
                custom={navLinks.length + 2}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="p-4 space-y-3"
              >
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">
                  {safeT("nav", "language")}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(["uz", "ru", "en"] as const).map((lang) => (
                    <motion.button
                      key={lang}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => {
                        setLanguage(lang);
                        onClose();
                      }}
                      className={cn(
                        "flex flex-col items-center p-2.5 rounded-xl border transition-all",
                        language === lang
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                          : "bg-white text-gray-500 border-border",
                      )}
                    >
                      <img
                        src={languageConfig[lang].flag}
                        alt={lang}
                        className="w-7 h-[18px] object-cover rounded shadow-sm mb-1.5"
                      />
                      <span className="text-[9px] font-black uppercase">
                        {lang}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer Actions */}
            {mounted && user && (
              <div className="p-4 border-t border-border bg-light-bg/40">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2.5 w-full p-3 bg-error/8 text-error rounded-xl font-bold text-sm hover:bg-error/15 transition-colors border border-error/15"
                >
                  <HiLogout className="w-4.5 h-4.5" />
                  <span>{safeT("nav", "logout")}</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
