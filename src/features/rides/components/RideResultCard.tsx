import React from "react";
import Link from "next/link";
import { HiStar, HiTruck, HiUserGroup } from "react-icons/hi";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";

interface RideResultCardProps {
  ride: any;
}

const RideResultCard: React.FC<RideResultCardProps> = ({ ride }) => {
  const { language, t } = useLanguageStore();
  const { regions, districts, quarters, resolveLocationName } =
    useLocationStore();

  const fromRegion =
    resolveLocationName(
      ride.start_region,
      ride.start_region_id || ride.from_region_id,
      regions,
      language,
    ) || "---";

  const fromDistrict = resolveLocationName(
    ride.start_district,
    ride.start_district_id || ride.from_district_id,
    districts,
    language,
  );

  const fromQuarter = resolveLocationName(
    ride.start_quarter,
    ride.start_quarter_id || ride.from_quarter_id,
    quarters,
    language,
  );

  const toRegion =
    resolveLocationName(
      ride.end_region,
      ride.end_region_id || ride.to_region_id,
      regions,
      language,
    ) || "---";

  const toDistrict = resolveLocationName(
    ride.end_district,
    ride.end_district_id || ride.to_district_id,
    districts,
    language,
  );

  const toQuarter = resolveLocationName(
    ride.end_quarter,
    ride.end_quarter_id || ride.to_quarter_id,
    quarters,
    language,
  );

  const fullFrom = [fromRegion, fromDistrict, fromQuarter]
    .filter(Boolean)
    .join(", ");
  const fullTo = [toRegion, toDistrict, toQuarter].filter(Boolean).join(", ");

  const driverFirstName = ride.driver?.first_name || "";
  const driverLastName = ride.driver?.last_name || "";
  const driverName =
    driverFirstName || driverLastName
      ? `${driverFirstName} ${driverLastName}`.trim()
      : "Driver";

  return (
    <Link href={`/rides/${ride.id}`} className="block group font-sans">
      <div className="premium-card p-5 md:p-6 hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="grow min-w-0">
            {/* Redesigned Vertical Route Info */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex flex-col items-center self-stretch py-1 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white"></div>
                <div className="flex-1 w-px border-l border-dashed border-border group-hover:border-primary/40 transition-colors my-1"></div>
                <div className="w-2.5 h-2.5 rounded-full border-2 border-secondary bg-white"></div>
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                {/* Departure row */}
                <div>
                  <div className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                    {t("rideDetails", "departure")}
                    <span className="mx-1.5 w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                    <span className="normal-case tracking-normal text-primary">
                      {new Date(ride.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-sm md:text-base font-black text-dark-text leading-tight wrap-break-word">
                    {fullFrom}
                  </div>
                </div>

                {/* Arrival row */}
                <div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                    {t("rideDetails", "destination")}
                  </div>
                  <div className="text-sm md:text-base font-black text-dark-text leading-tight wrap-break-word">
                    {fullTo}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] uppercase border border-primary/20 overflow-hidden shadow-sm mr-3">
                  {driverName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-black leading-tight text-dark-text">
                    {driverName}
                  </div>
                  <div className="flex items-center text-[10px] font-black text-accent mt-0.5">
                    <HiStar className="mr-0.5 shadow-sm" />{" "}
                    {ride.driver?.rating || "4.8"}
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-px h-6 bg-border"></div>
              <div className="flex items-center text-[10px] font-black text-gray-500 bg-light-bg px-2.5 py-1 rounded-lg border border-border/40">
                <HiTruck className="mr-1.5 text-secondary w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">
                  {ride.vehicle?.brand && `${ride.vehicle.brand} `}
                  {ride.vehicle?.model || "Standard"}
                </span>
                {(ride.vehicle?.plate_number || ride.vehicle?.car_number) && (
                  <span className="ml-2 px-1 py-0.5 bg-dark-text text-white text-[8px] rounded font-bold tracking-wider">
                    {ride.vehicle.plate_number || ride.vehicle.car_number}
                  </span>
                )}
              </div>
              <div className="text-[10px] font-bold text-gray-400">
                {formatDate(ride.start_time)}
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
            <div className="text-center md:text-right">
              <div className="text-xl md:text-2xl font-black text-primary leading-none mb-1">
                {formatCurrency(Number(ride.price_per_seat || 0))}
              </div>
              <div className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest justify-center md:justify-end">
                <HiUserGroup className="mr-1 w-3.5 h-3.5 text-secondary/60" />{" "}
                {ride.available_seats} {t("rides", "seatsLeft")}
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              className="shadow-lg shadow-primary/10 group-hover:scale-[1.02] transition-all px-6"
            >
              {t("rides", "joinRide")}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RideResultCard;
