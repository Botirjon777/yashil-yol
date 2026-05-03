import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { HiStar, HiTruck, HiUserGroup, HiMap } from "react-icons/hi";
import { formatCurrency, formatDate, formatDateTime, cn } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";
import { RideMapModal } from "./RideMapModal";

const RideMap = dynamic(
  () => import("./RideMap").then((mod) => mod.RideMap),
  { 
    ssr: false, 
    loading: () => <div className="w-full h-full bg-gray-50 animate-pulse rounded-xl" /> 
  }
);

interface RideResultCardProps {
  ride: any;
  showDriverInfo?: boolean;
}

const RideResultCard = ({ ride, showDriverInfo = false }: RideResultCardProps) => {
  const { language, t } = useLanguageStore();
  const { regions, districts, quarters, resolveLocationName } =
    useLocationStore();

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const rd = (key: string) => t("rides", key);
  
  const fromRegion =
    typeof ride.start_region === "string"
      ? ride.start_region
      : resolveLocationName(
          ride.start_region,
          ride.start_region_id || ride.from_region_id,
          regions,
          language,
        ) || "---";

  const fromDistrict =
    typeof ride.start_district === "string"
      ? ride.start_district
      : resolveLocationName(
          ride.start_district,
          ride.start_district_id || ride.from_district_id,
          districts,
          language,
        );

  const fromQuarter =
    typeof ride.start_quarter === "string"
      ? ride.start_quarter
      : resolveLocationName(
          ride.start_quarter,
          ride.start_quarter_id || ride.from_quarter_id,
          quarters,
          language,
        );

  const toRegion =
    typeof ride.end_region === "string"
      ? ride.end_region
      : resolveLocationName(
          ride.end_region,
          ride.end_region_id || ride.to_region_id,
          regions,
          language,
        ) || "---";

  const toDistrict =
    typeof ride.end_district === "string"
      ? ride.end_district
      : resolveLocationName(
          ride.end_district,
          ride.end_district_id || ride.to_district_id,
          districts,
          language,
        );

  const toQuarter =
    typeof ride.end_quarter === "string"
      ? ride.end_quarter
      : resolveLocationName(
          ride.end_quarter,
          ride.end_quarter_id || ride.to_quarter_id,
          quarters,
          language,
        );

  const fullFrom = [fromRegion, fromDistrict, fromQuarter]
    .filter(Boolean)
    .join(", ");
  const fullTo = [toRegion, toDistrict, toQuarter].filter(Boolean).join(", ");

  const driverFirstName = ride.driver?.name || ride.driver?.first_name || "";
  const driverLastName = ride.driver?.last_name || "";
  const actualDriverName =
    driverFirstName || driverLastName
      ? `${driverFirstName} ${driverLastName}`.trim()
      : "Driver";

  const driverName = showDriverInfo 
    ? actualDriverName 
    : (t("rideDetails", "verifiedDriver") || "Driver");

  const isPast = new Date(ride.start_time).getTime() < Date.now();
  const isFull = Number(ride.available_seats || 0) === 0;
  const isClickable = !isPast && !isFull;

  return (
    <div
      className={cn(
        "block group font-sans relative",
        isPast && "opacity-75 select-none",
      )}
    >
      <div
        className={cn(
          "premium-card p-5 md:p-6 transition-all duration-300 bg-white border-2",
          isPast
             ? "border-gray-100 grayscale-[0.2]"
            : "hover:border-primary hover:shadow-2xl hover:shadow-primary/5 border-transparent",
        )}
      >
        <Link
          href={isClickable ? `/rides/${ride.id}` : "#"}
          className={cn("absolute inset-0 z-20", !isClickable && "cursor-default pointer-events-none")}
        />

        <div className="flex justify-center mb-4">
          {isPast ? (
            <div className="px-3 py-1 bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-gray-200">
              {t("status", "past") || "PAST"}
            </div>
          ) : isFull ? (
            <div className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
              {t("status", "full") || "FULL"}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="grow min-w-0">
            {/* Redesigned Vertical Route Info + Map Preview */}
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex flex-col items-center self-stretch py-1 shrink-0">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full border-2 bg-white",
                      isPast ? "border-gray-400" : "border-primary",
                    )}
                  ></div>
                  <div className="flex-1 w-px border-l border-dashed border-border group-hover:border-primary/40 transition-colors my-1"></div>
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full border-2 bg-white",
                      isPast ? "border-gray-300" : "border-secondary",
                    )}
                  ></div>
                </div>

                <div className="flex-1 min-w-0 space-y-4">
                  {/* Departure row */}
                  <div>
                    <div className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                      {t("rideDetails", "departure")}
                      <span className="mx-1.5 w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                      <span
                        className={cn(
                          "normal-case tracking-normal",
                          isPast ? "text-gray-500" : "text-primary",
                        )}
                      >
                        {formatDateTime(ride.start_time)}
                      </span>
                    </div>
                    <div className="text-sm md:text-base font-black text-dark-text leading-tight wrap-break-word">
                      {fullFrom}
                    </div>
                  </div>

                  {/* Arrival row */}
                  <div>
                    <div className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                      {t("rideDetails", "destination")}
                      <span className="mx-1.5 w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                      <span className="normal-case tracking-normal text-secondary/70">
                        {ride.end_time ? formatDateTime(ride.end_time) : "---"}
                      </span>
                    </div>
                    <div className="text-sm md:text-base font-black text-dark-text leading-tight wrap-break-word">
                      {fullTo}
                    </div>
                  </div>
                </div>
              </div>

            </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center font-black text-[10px] uppercase border overflow-hidden shadow-sm mr-3",
                      isPast
                        ? "bg-gray-100 text-gray-400 border-gray-200"
                        : "bg-primary/10 text-primary border-primary/20",
                    )}
                  >
                    {driverName.charAt(0)}
                  </div>
                  <div>
                    {showDriverInfo && (
                      <div className="text-xs font-black leading-tight text-dark-text">
                        {driverName}
                      </div>
                    )}
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
                  {showDriverInfo && (ride.vehicle?.plate_number || ride.vehicle?.car_number) && (
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

            <div className="flex flex-col items-stretch md:items-end justify-center gap-3 shrink-0 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0 border-border/50">
              <div className="text-center md:text-right">
                <div
                  className={cn(
                    "text-xl md:text-2xl font-black leading-none mb-1",
                    isPast ? "text-gray-400" : "text-primary",
                  )}
                >
                  {formatCurrency(Number(ride.price_per_seat || 0))}
                </div>
                <div className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest justify-center md:justify-end">
                  <HiUserGroup className="mr-1 w-3.5 h-3.5 text-secondary/60" />{" "}
                  {ride.available_seats} {t("rides", "seatsLeft")}
                </div>
              </div>
              <Button
                variant={isPast || isFull ? "outline" : "primary"}
                size="md"
                disabled={!isClickable}
                className={cn(
                  "shadow-lg transition-all w-full md:w-auto md:px-8 py-3 relative z-30",
                  !isPast && "shadow-primary/10 group-hover:scale-[1.02]",
                )}
              >
                {isPast
                  ? t("status", "past") || "PAST"
                  : isFull
                    ? t("status", "full") || "FULL"
                    : t("rides", "joinRide")}
            </Button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMapModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-primary/20 relative z-30"
            >
              <HiMap className="w-3.5 h-3.5" />
              {t("rideDetails", "viewOnMap")}
            </button>
          </div>
        </div>

        <RideMapModal 
          isOpen={isMapModalOpen} 
          onClose={() => setIsMapModalOpen(false)} 
          ride={ride} 
          obfuscated={true}
        />
      </div>
    </div>
  );
};

export default RideResultCard;
