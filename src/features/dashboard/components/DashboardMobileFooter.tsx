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
    {
      id: "profile",
      icon: <HiUser className="w-6 h-6" />,
      label: t("dashboard", "sidebar")?.profile || "Profile",
    },
  ];

  if (isDriver) {
    navItems.push({
      id: "driver",
      icon: <HiIdentification className="w-6 h-6" />,
      label: t("dashboard", "sidebar")?.driverProfile || "Driver",
    });
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 relative">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id as any)}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-colors relative z-10",
              activeTab === item.id ? "text-primary" : "text-gray-400"
            )}
          >
            <div className="relative p-1">
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10">{item.icon}</div>
            </div>
            <span
              className={cn(
                "text-[9px] font-semibold uppercase tracking-tighter mt-1 transition-colors relative z-10",
                activeTab === item.id ? "text-primary" : "text-gray-400"
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
