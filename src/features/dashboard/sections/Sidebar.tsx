import { HiUser, HiCreditCard, HiStar, HiIdentification } from "react-icons/hi";
import { DashboardNavItem } from "../components/DashboardNavItem";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface SidebarProps {
  user: any;
  activeTab: "rides" | "balance" | "profile" | "driver";
  handleTabChange: (tab: "rides" | "balance" | "profile" | "driver") => void;
  isDriver: boolean;
}

export function Sidebar({
  user,
  activeTab,
  handleTabChange,
  isDriver,
}: SidebarProps) {
  const { t } = useLanguageStore();

  return (
    <div className="lg:col-span-1 space-y-3">
      <div className="flex items-center gap-3 px-1 mb-4">
        <div className="w-[25px] h-[25px] bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0 overflow-hidden shadow-sm shadow-primary/20">
          {user?.image ? (
            <img
              src={user.image}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user?.first_name?.[0] || "U"
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-black text-dark-text truncate leading-none mb-1">
            {user?.first_name} {user?.last_name}
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
            {isDriver
              ? t("dashboard", "sidebar")?.driver
              : t("dashboard", "sidebar")?.traveler}
          </p>
        </div>
      </div>

      <nav className="space-y-1.5">
        <DashboardNavItem
          icon={<HiStar />}
          label={t("dashboard", "sidebar")?.myRides}
          active={activeTab === "rides"}
          onClick={() => handleTabChange("rides")}
        />
        <DashboardNavItem
          icon={<HiCreditCard />}
          label={t("dashboard", "sidebar")?.balance}
          active={activeTab === "balance"}
          onClick={() => handleTabChange("balance")}
        />
        <DashboardNavItem
          icon={<HiUser />}
          label={t("dashboard", "sidebar")?.profile}
          active={activeTab === "profile"}
          onClick={() => handleTabChange("profile")}
        />
        {isDriver && (
          <DashboardNavItem
            icon={<HiIdentification />}
            label={t("dashboard", "sidebar")?.driverProfile}
            active={activeTab === "driver"}
            onClick={() => handleTabChange("driver")}
          />
        )}
      </nav>
    </div>
  );
}
