"use client";

import { HiShieldCheck, HiStar } from "react-icons/hi";
import { cn } from "@/src/lib/utils";

interface RideInfoCardProps {
  trip: any;
  isDriver: boolean;
  driverName: string;
  carColor: string;
  rd: (key: string) => string;
  showDriverInfo?: boolean;
}

export const RideInfoCard = ({
  trip,
  isDriver,
  driverName,
  carColor,
  rd,
  showDriverInfo = true,
}: RideInfoCardProps) => {
  return (
    <div className="premium-card p-8 group">
      <h3 className="text-xl font-black text-dark-text mb-8 flex items-center">
        <HiShieldCheck className="mr-2 text-primary w-6 h-6" /> {rd("rideInfo")}
      </h3>

      {!isDriver && (
        <div className="flex items-center mb-8">
          <div>
            {showDriverInfo && (
              <div className="text-2xl font-black text-dark-text mb-1">
                {driverName}
              </div>
            )}
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm font-black text-accent">
                <HiStar className="mr-1 w-4 h-4" />{" "}
                {trip.driver?.rating || "4.8"}
              </div>
              <div className="text-gray-300">|</div>
              <div className="text-sm font-bold text-gray-400">
                {rd("verifiedDriver")}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "bg-light-bg rounded-[32px] p-6 grid gap-6",
          showDriverInfo
            ? "grid-cols-2 md:grid-cols-4"
            : "grid-cols-2 md:grid-cols-3",
        )}
      >
        <div className="text-center md:border-r border-border">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
            {rd("carModel")}
          </div>
          <div className="text-dark-text font-black">
            {trip.vehicle?.brand} {trip.vehicle?.model || "Standard"}
          </div>
        </div>
        <div className="text-center md:border-r border-border">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
            {rd("carColor")}
          </div>
          <div className="text-dark-text font-black">{carColor}</div>
        </div>

        {showDriverInfo && (
          <div className="text-center md:border-r border-border">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
              {rd("plateNumber")}
            </div>
            <div className="text-dark-text font-black">
              {trip.vehicle?.plate_number || trip.vehicle?.car_number || "---"}
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
            {rd("seats")}
          </div>
          <div className="text-dark-text font-black">
            {trip.available_seats} {rd("of")} {trip.total_seats}
          </div>
        </div>
      </div>
    </div>
  );
};
