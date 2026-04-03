import Link from "next/link";
import { HiStar, HiTruck, HiUserGroup } from "react-icons/hi";
import { formatCurrency, formatDate, cn } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";

interface RideResultCardProps {
  ride: any;
}

const RideResultCard = ({ ride }: RideResultCardProps) => {
  const { language, t } = useLanguageStore();
  const { regions, districts, quarters, resolveLocationName } =
    useLocationStore();

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
  const driverName =
    driverFirstName || driverLastName
      ? `${driverFirstName} ${driverLastName}`.trim()
      : "Driver";

  const isPast = new Date(ride.start_time).getTime() < Date.now();

  return (
    <div
      className={cn(
        "block group font-sans relative",
        isPast && "opacity-75 select-none",
      )}
    >
      <Link
        href={isPast ? "#" : `/rides/${ride.id}`}
        className={cn("block", isPast && "cursor-default pointer-events-none")}
      >
        <div
          className={cn(
            "premium-card p-5 md:p-6 transition-all duration-300 bg-white border-2",
            isPast
              ? "border-gray-100 grayscale-[0.2]"
              : "hover:border-primary hover:shadow-2xl hover:shadow-primary/5 border-transparent",
          )}
        >
          {isPast && (
            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gray-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
              {t("status", "past") || "PAST"}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="grow min-w-0">
              {/* Redesigned Vertical Route Info */}
              <div className="flex items-start space-x-4 mb-6">
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
                        {new Date(ride.start_time).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                        ,{" "}
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
                    <div className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                      {t("rideDetails", "destination")}
                      <span className="mx-1.5 w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                      <span className="normal-case tracking-normal text-secondary/70">
                        {ride.end_time ? (
                          <>
                            {new Date(ride.end_time).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                            ,{" "}
                            {new Date(ride.end_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </>
                        ) : (
                          "---"
                        )}
                      </span>
                    </div>
                    <div className="text-sm md:text-base font-black text-dark-text leading-tight wrap-break-word">
                      {fullTo}
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
                variant={isPast ? "outline" : "primary"}
                size="md"
                disabled={isPast}
                className={cn(
                  "shadow-lg transition-all px-6",
                  !isPast && "shadow-primary/10 group-hover:scale-[1.02]",
                )}
              >
                {isPast
                  ? t("status", "past") || "PAST"
                  : t("rides", "joinRide")}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RideResultCard;
