import Link from "next/link";
import { HiIdentification } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";

interface DriverStatusBannerProps {
  user: any;
  isDriver: boolean;
}

export function DriverStatusBanner({
  user,
  isDriver,
}: DriverStatusBannerProps) {
  if (isDriver) return null;

  if (user?.driving_verification_status) {
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
              Driver Application Status
            </h3>
            <p className="text-sm font-bold text-gray-500 capitalize">
              {user.driving_verification_status} –{" "}
              {user.driving_verification_status === "pending"
                ? "We're reviewing your information."
                : user.driving_verification_status === "approved"
                  ? "Congratulations! You can now start driving."
                  : user.driving_verification_status === "rejected"
                    ? "Your application was rejected. Please contact support."
                    : "Your account has been blocked."}
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
          🚗
        </div>
        <div>
          <h3 className="text-xl font-black text-dark-text">
            Want to earn with us?
          </h3>
          <p className="text-gray-500 font-medium">
            Become a driver and start earning by sharing your rides!
          </p>
        </div>
      </div>
      <Link href="/become-a-driver">
        <Button
          variant="primary"
          size="lg"
          className="px-8 shadow-lg shadow-primary/20"
        >
          Become a Driver
        </Button>
      </Link>
    </div>
  );
}
