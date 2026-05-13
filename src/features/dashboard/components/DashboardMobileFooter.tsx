"use client";

import React from "react";
import {
  HiStar,
  HiCreditCard,
  HiUser,
  HiIdentification,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { cn } from "@/src/lib/utils";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { motion } from "framer-motion";

interface DashboardMobileFooterProps {
  activeTab: "rides" | "balance" | "transactions" | "profile" | "driver";
  handleTabChange: (
    tab: "rides" | "balance" | "transactions" | "profile" | "driver"
  ) => void;
  isDriver: boolean;
}

export const DashboardMobileFooter: React.FC<DashboardMobileFooterProps> = ({
  activeTab,
  handleTabChange,
  isDriver,
}) => {
  const { t } = useLanguageStore();

  const navItems = [
    {
      id: "rides",
      icon: <HiStar className="w-6 h-6" />,
      label: t("dashboard", "sidebar")?.myRides || "Rides",
    },
    {
      id: "balance",
      icon: <HiCreditCard className="w-6 h-6" />,
      label: t("dashboard", "sidebar")?.balance || "Wallet",
    },
    {
      id: "transactions",
      icon: <HiOutlineDocumentText className="w-6 h-6" />,
      label: t("nav", "transactions") || "History",
    },
  ];

  if (isDriver) {
    navItems.push({
      id: "driver",
      icon: <HiIdentification className="w-6 h-6" />,
      label: t("dashboard", "sidebar")?.driverProfile || "Driver",
    });
  }

  // Profile is always last
  navItems.push({
    id: "profile",
    icon: <HiUser className="w-6 h-6" />,
    label: t("dashboard", "sidebar")?.profile || "Profile",
  });

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 pb-safe">
      <div className="bg-secondary rounded-[2.5rem] shadow-[0_20px_50px_rgba(14,165,233,0.4)] border border-white/20 p-1">
        <div className="bg-[#0369a1] rounded-[2.2rem] flex justify-around items-center h-16 px-2 relative">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                <div
                  className={cn(
                    "relative p-3 rounded-full transition-all duration-500 flex items-center justify-center",
                    isActive
                      ? "bg-white text-secondary -translate-y-6 shadow-[0_15px_30px_rgba(0,0,0,0.3)] border-4 border-[#0369a1] scale-110"
                      : "text-white hover:text-white"
                  )}
                >
                  {item.icon}
                  {isActive && (
                    <motion.div
                      layoutId="active-glow"
                      className="absolute -inset-2 bg-white/20 blur-2xl rounded-full -z-10"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[8px] font-medium uppercase tracking-tighter transition-all duration-300 absolute bottom-1.5",
                    isActive ? "text-white opacity-100 font-semibold" : "text-white"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
