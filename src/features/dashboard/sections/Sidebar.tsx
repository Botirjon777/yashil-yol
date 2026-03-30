import React from "react";
import { HiUser, HiCreditCard, HiStar, HiIdentification } from "react-icons/hi";
import { DashboardNavItem } from "../components/DashboardNavItem";

interface SidebarProps {
  user: any;
  activeTab: "rides" | "balance" | "profile" | "driver";
  handleTabChange: (tab: "rides" | "balance" | "profile" | "driver") => void;
  isDriver: boolean;
}

export function Sidebar({ user, activeTab, handleTabChange, isDriver }: SidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="premium-card p-8 mb-8 text-center bg-primary text-white border-none shadow-primary/20">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black backdrop-blur-md overflow-hidden">
          {user?.image ? (
            <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            user?.first_name?.[0] || "U"
          )}
        </div>
        <h2 className="text-xl font-black">{user?.first_name} {user?.last_name}</h2>
        <p className="text-indigo-100 text-sm font-medium uppercase tracking-widest">
          {user?.role || "Traveler"}
        </p>
      </div>

      <nav className="space-y-2.5">
        <DashboardNavItem
          icon={<HiStar />}
          label="My Rides"
          active={activeTab === "rides"}
          onClick={() => handleTabChange("rides")}
        />
        <DashboardNavItem
          icon={<HiCreditCard />}
          label="Balance & Cards"
          active={activeTab === "balance"}
          onClick={() => handleTabChange("balance")}
        />
        <DashboardNavItem
          icon={<HiUser />}
          label="Profile Settings"
          active={activeTab === "profile"}
          onClick={() => handleTabChange("profile")}
        />
        {isDriver && (
          <DashboardNavItem
            icon={<HiIdentification />}
            label="Driver Profile"
            active={activeTab === "driver"}
            onClick={() => handleTabChange("driver")}
          />
        )}
      </nav>
    </div>
  );
}
