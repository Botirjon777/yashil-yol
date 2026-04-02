import { HiTruck, HiX } from "react-icons/hi";
import { formatCurrency, formatDate, cn } from "@/src/lib/utils";
import Link from "next/link";
import { Trip } from "@/src/features/rides/types";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";
import { useEffect } from "react";
import {
  useRegions,
  useDistricts,
  useQuarters,
} from "@/src/features/location/hooks/useLocation";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useCancelTrip } from "@/src/features/rides/hooks/useRides";
import Button from "@/src/components/ui/Button";

interface RideCardProps {
  ride: Trip;
  isHistory?: boolean;
}

export function RideCard({ ride, isHistory = false }: RideCardProps) {
  const { user } = useAuthStore();
  const { mutate: cancelTrip, isPending: isCanceling } = useCancelTrip();
  
  const isDriver = user?.id === ride.driver_id;
  const departureDate = new Date(ride.start_time);
  const diffInMinutes = (departureDate.getTime() - Date.now()) / (1000 * 60);
  const canCancel = !isHistory && isDriver && diffInMinutes > 30;

  const { language, t } = useLanguageStore();
  const {
    regions,
    districts,
    quarters,
    resolveLocationName,
    setRegions,
    setDistricts,
    setQuarters,
  } = useLocationStore();

  const { data: regionsData } = useRegions();
  const { data: districtsData } = useDistricts();
  const { data: quartersData } = useQuarters();

  useEffect(() => {
    if (regionsData) setRegions(regionsData);
    if (districtsData) setDistricts(districtsData);
    if (quartersData) setQuarters(quartersData);
  }, [
    regionsData,
    districtsData,
    quartersData,
    setRegions,
    setDistricts,
    setQuarters,
  ]);

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

  const price = ride.price_per_seat || 0;

  return (
    <Link href={`/rides/${ride.id}`}>
      <div className="premium-card p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 group hover:border-primary transition-all cursor-pointer active:scale-[0.99] bg-white overflow-hidden relative">
        {/* Status indicator line */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1",
            String(ride.status) === "active"
              ? "bg-success"
              : String(ride.status) === "completed"
                ? "bg-primary"
                : "bg-error",
          )}
        ></div>

        <div className="flex items-start md:items-center space-x-5 flex-1 min-w-0 pl-2">
          {/* Vertical Route Indicator - now reactive to height */}
          <div className="flex flex-col items-center self-stretch py-2 shrink-0">
            <div className="w-3 h-3 rounded-full border-[3px] border-primary bg-white shadow-sm shadow-primary/20"></div>
            <div className="flex-1 w-0.5 border-l-2 border-dashed border-border group-hover:border-primary/40 transition-colors my-1"></div>
            <div className="w-3 h-3 rounded-full border-[3px] border-secondary bg-white shadow-sm shadow-secondary/20"></div>
          </div>

              <div className="min-w-0 flex-1 space-y-4">
                {/* Locations Timeline */}
                <div className="space-y-4">
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 flex items-center">
                      {t("rideDetails", "departure")}
                      <span className="mx-2 w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="normal-case tracking-normal text-primary">
                        {new Date(ride.start_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}, {new Date(ride.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className="text-sm md:text-[15px] font-black text-dark-text leading-snug wrap-break-word"
                      title={fullFrom}
                    >
                      {fullFrom}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 flex items-center">
                      {t("rideDetails", "destination")}
                      <span className="mx-2 w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="normal-case tracking-normal text-secondary/70">
                        {ride.end_time ? (
                          <>
                            {new Date(ride.end_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}, {new Date(ride.end_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </>
                        ) : "---"}
                      </span>
                    </div>
                    <div
                      className="text-sm md:text-[15px] font-black text-dark-text leading-tight wrap-break-word"
                      title={fullTo}
                    >
                      {fullTo}
                    </div>
                  </div>
                </div>

            {/* Car Meta Info & Date */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-light-bg">
              {ride.vehicle && (
                <div className="flex items-center text-[10px] font-black text-gray-500 bg-light-bg/80 px-2.5 py-1.5 rounded-xl border border-border/40 shadow-xs">
                  <HiTruck className="mr-2 text-secondary w-3.5 h-3.5" />
                  <span className="break-all whitespace-normal">
                    {ride.vehicle.brand && `${ride.vehicle.brand} `}
                    {ride.vehicle.model}
                  </span>
                  {(ride.vehicle.plate_number || ride.vehicle.car_number) && (
                    <span className="ml-2 px-1.5 py-0.5 bg-dark-text text-white text-[8px] rounded-md font-bold tracking-wider shrink-0">
                      {ride.vehicle.plate_number || ride.vehicle.car_number}
                    </span>
                  )}
                </div>
              )}
              <div className="text-[10px] font-bold text-gray-400">
                {formatDate(ride.start_time)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-10 shrink-0 space-y-1 gap-4">
          <div className="text-center md:text-right">
            <div className="text-2xl font-black text-primary">
              {formatCurrency(Number(price))}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {t("rideDetails", "perSeat")}
            </div>
          </div>
          <div
            className={cn(
              "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full",
              isHistory
                ? "bg-gray-100 text-gray-400"
                : String(ride.status) === "active"
                  ? "bg-success/10 text-success"
                  : String(ride.status) === "completed"
                    ? "bg-primary/10 text-primary"
                    : "bg-error/10 text-error",
            )}
          >
            {t("status", ride.status) || ride.status}
          </div>
          {canCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.confirm("Are you sure you want to cancel this trip?")) {
                  cancelTrip(ride.id);
                }
              }}
              loading={isCanceling}
              className="mt-1 shadow-md shadow-error/10"
            >
              Cancel Trip
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
