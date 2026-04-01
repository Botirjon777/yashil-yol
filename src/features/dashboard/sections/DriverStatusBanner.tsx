import Link from "next/link";
import { HiIdentification, HiTruck } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface DriverStatusBannerProps {
  user: any;
  isDriver: boolean;
}

export function DriverStatusBanner({
  user,
  isDriver,
}: DriverStatusBannerProps) {
  const { t } = useLanguageStore();

  if (isDriver) return null;

  if (user?.driving_verification_status && user.driving_verification_status !== "none") {
    return (
      <div
        className={cn(
          "premium-card p-6 flex items-center justify-between border-l-8 animate-in fade-in slide-in-from-top-4 duration-500",
          user.driving_verification_status === "pending" &&
            "border-warning bg-warning/5",
          user.driving_verification_status === "approved" &&
            "border-success bg-success/5",
          user.driving_verification_status === "rejected" &&
            "border-error bg-error/5",
          user.driving_verification_status === "blocked" &&
            "border-gray-400 bg-gray-50",
        )}
      >
        <div className="flex items-center space-x-5">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm",
              user.driving_verification_status === "pending" &&
                "bg-warning/20 text-warning",
              user.driving_verification_status === "approved" &&
                "bg-success/20 text-success",
              user.driving_verification_status === "rejected" &&
                "bg-error/20 text-error",
              user.driving_verification_status === "blocked" &&
                "bg-gray-200 text-gray-500",
            )}
          >
            <HiIdentification />
          </div>
          <div>
            <h3 className="font-black text-dark-text">
              {t("dashboard", "driver")?.statusTitle}
            </h3>
            <p className="text-sm font-bold text-gray-500 capitalize">
              {user.driving_verification_status} –{" "}
              {user.driving_verification_status === "pending"
                ? t("dashboard", "driver")?.pending
                : user.driving_verification_status === "approved"
                  ? t("dashboard", "driver")?.approved
                  : user.driving_verification_status === "rejected"
                    ? t("dashboard", "driver")?.rejected
                    : t("dashboard", "driver")?.blocked}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card p-8 bg-linear-to-r from-accent/10 to-primary/10 border-accent/20 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center space-x-5">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl text-accent shadow-sm">
          <HiTruck />
        </div>
        <div>
          <h3 className="text-xl font-black text-dark-text">
            {t("dashboard", "driver")?.noneTitle}
          </h3>
          <p className="text-gray-500 font-medium">
            {t("dashboard", "driver")?.noneDesc}
          </p>
        </div>
      </div>
      <Link href="/become-a-driver">
        <Button
          variant="primary"
          size="lg"
          className="px-8 shadow-lg shadow-primary/20"
        >
          {t("dashboard", "driver")?.becomeDriver}
        </Button>
      </Link>
    </div>
  );
}
