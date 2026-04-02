import React from "react";
import { HiChevronRight } from "react-icons/hi";

interface DashboardNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function DashboardNavItem({ icon, label, active, onClick }: DashboardNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md font-bold transition-all ${
        active 
          ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]" 
          : "bg-gray-50/80 text-gray-500 hover:bg-gray-100/80 active:scale-95"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
      {active && <HiChevronRight className="ml-auto" />}
    </button>
  );
}
