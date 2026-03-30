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
      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold transition-all ${
        active ? "bg-white text-primary shadow-lg shadow-gray-200/50" : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
      {active && <HiChevronRight className="ml-auto" />}
    </button>
  );
}
