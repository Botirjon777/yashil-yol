import { HiTruck, HiX, HiTrash, HiExclamation } from "react-icons/hi";
import { formatCurrency, formatDate, cn } from "@/src/lib/utils";
import Link from "next/link";
import { Trip } from "@/src/features/rides/types";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";
import { useEffect, useState } from "react";
import {
  useRegions,
  useDistricts,
  useQuarters,
} from "@/src/features/location/hooks/useLocation";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useCancelTrip } from "@/src/features/rides/hooks/useRides";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";

interface RideCardProps {
  ride: Trip;
  isHistory?: boolean;
}

export function RideCard({ ride, isHistory = false }: RideCardProps) {
  const { user } = useAuthStore();
  const { mutate: cancelTrip, isPending: isCanceling } = useCancelTrip();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Loose check for driver ownership to handle different API schemas
  const isDriver = user?.id != null && (
    String(user.id) === String(ride.driver_id) || 
    String(user.id) === String((ride as any).user_id) ||
    String(user.id) === String(ride.driver?.id)
  );
  const departureDate = new Date(ride.start_time);
  const diffInMinutes = (departureDate.getTime() - Date.now()) / (1000 * 60);
  
  const hasBookings = (ride.bookings?.length || 0) > 0;
  const isTooLate = diffInMinutes < 120 && diffInMinutes > 0;
  
  const canCancel = !isHistory && isDriver && !hasBookings && !isTooLate;
  const cannotCancelReason = hasBookings 
    ? "Has Bookings" 
    : isTooLate 
      ? "Under 2 Hours" 
      : null;

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
    <div className="relative group">
      {/* Absolute Overlay Link for the whole card area */}
      <Link 
        href={`/rides/${ride.id}`} 
        className="absolute inset-0 z-10"
        aria-label="View ride details"
      />

      <div className="premium-card p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 group hover:border-primary transition-all bg-white overflow-hidden relative">
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

        {/* Action Panel - Lifted to z-20 to override the overlay link */}
        <div className="relative z-20 flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-10 shrink-0 space-y-1 gap-4">
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
          {isDriver && String(ride.status) === "active" && (
            <div className="flex flex-col items-center">
              <Button
                variant={canCancel ? "danger" : "outline"}
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (canCancel) {
                    setIsDeleteModalOpen(true);
                  }
                }}
                disabled={!canCancel}
                className={cn(
                  "mt-1 shadow-md font-black uppercase text-[10px] tracking-widest min-w-[120px]",
                  canCancel ? "shadow-error/10" : "opacity-60 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400"
                )}
                icon={canCancel ? <HiTrash className="w-3.5 h-3.5" /> : <HiExclamation className="w-3.5 h-3.5" />}
              >
                {cannotCancelReason || "Delete Ride"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Ride"
        size="md"
      >
        <div className="p-1 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-error/5 rounded-2xl border border-error/10">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center shrink-0">
              <HiTrash className="w-6 h-6 text-error" />
            </div>
            <div>
              <h3 className="font-black text-dark-text leading-tight">Are you absolutely sure?</h3>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone. This trip will be removed from future searches.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-light-bg rounded-2xl border border-border/40">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ride Summary</div>
              <div className="text-sm font-bold text-dark-text truncate">{fullFrom}</div>
              <div className="text-[10px] text-gray-500 mt-1">Departure: {new Date(ride.start_time).toLocaleString()}</div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={isCanceling}
              onClick={() => {
                cancelTrip(ride.id, {
                  onSuccess: () => setIsDeleteModalOpen(false),
                });
              }}
              icon={<HiTrash className="w-4 h-4" />}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
