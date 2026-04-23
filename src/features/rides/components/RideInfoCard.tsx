"use client";

import {
  HiShieldCheck,
  HiStar,
  HiTruck,
  HiColorSwatch,
  HiIdentification,
  HiUserGroup,
} from "react-icons/hi";
import { getVehicleColorHex } from "@/src/lib/utils";

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
  const colorHex = getVehicleColorHex(carColor);
  const initials = driverName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stats = [
    {
      icon: <HiTruck className="w-4 h-4" />,
      label: rd("carModel"),
      value:
        [trip.vehicle?.brand, trip.vehicle?.model].filter(Boolean).join(" ") ||
        "Standard",
    },
    {
      icon: <HiColorSwatch className="w-4 h-4" />,
      label: rd("carColor"),
      value: carColor || "---",
      dot: colorHex,
    },
    ...(showDriverInfo
      ? [
          {
            icon: <HiIdentification className="w-4 h-4" />,
            label: rd("plateNumber"),
            value:
              trip.vehicle?.plate_number || trip.vehicle?.car_number || "---",
            mono: true,
          },
        ]
      : []),
    {
      icon: <HiUserGroup className="w-4 h-4" />,
      label: rd("seats"),
      value: `${trip.available_seats} / ${trip.total_seats}`,
    },
  ];

  return (
    <div className="premium-card overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-border/60 flex items-center gap-3">
        <HiShieldCheck className="text-primary w-5 h-5 shrink-0" />
        <h3 className="text-base font-black text-dark-text uppercase tracking-widest">
          {rd("rideInfo")}
        </h3>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Driver avatar row */}
        {!isDriver && (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/25 shrink-0">
              {initials || "D"}
            </div>
            <div>
              {showDriverInfo && (
                <div className="text-lg font-black text-dark-text leading-tight">
                  {driverName}
                </div>
              )}
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm font-black text-amber-500">
                  <HiStar className="w-4 h-4" />
                  {trip.driver?.rating || "4.8"}
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                  <HiShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {rd("verifiedDriver")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-light-bg rounded-2xl p-4 flex flex-col gap-1.5 border border-border/40"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="text-primary">{s.icon}</span>
                {s.label}
              </div>
              <div className="flex items-center gap-2">
                {s.dot && (
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ background: s.dot }}
                  />
                )}
                <span
                  className={`font-black text-dark-text text-sm leading-tight ${s.mono ? "font-mono tracking-widest" : ""}`}
                >
                  {s.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
