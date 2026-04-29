import {
  HiUserGroup,
  HiPhone,
  HiTrash,
  HiUserAdd,
  HiMap,
} from "react-icons/hi";
import { cn } from "@/src/lib/utils";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface PassengerListCardProps {
  trip: any;
  rd: (key: string) => string;
  isDriver?: boolean;
  isPublic?: boolean;
  mode?: "driver" | "public" | "passenger";
  myBookingId?: string | number;
  onRemovePassenger?: (passengerId: string | number) => void;
  onAddPassenger?: () => void;
  isRemoving?: boolean;
  disabled?: boolean;
  bookedBy?: any;
}

export const PassengerListCard = ({
  trip,
  rd,
  isDriver = false,
  isPublic = false,
  mode = "public",
  myBookingId,
  onRemovePassenger,
  onAddPassenger,
  isRemoving = false,
  disabled = false,
  bookedBy,
}: PassengerListCardProps) => {
  const { t } = useLanguageStore();
  const isPassengerMode = mode === "passenger";
  const hasAvailableSeats = Number(trip.available_seats) > 0;

  return (
    <div className="premium-card overflow-hidden">
      {/* Header */}
      <div className="px-2.5 md:px-6 pt-2.5 md:pt-6 pb-2.5 md:pb-5 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm md:text-base font-black text-dark-text uppercase tracking-widest">
            {rd("passengerList") || "Passengers"}
          </h3>
        </div>
        <span className="text-[10px] font-black text-gray-400 bg-light-bg px-2.5 py-1 rounded-lg border border-border/40 uppercase tracking-widest">
          {Number(trip.total_seats || 0) - Number(trip.available_seats || 0)} /{" "}
          {Number(trip.total_seats || 0)} {rd("booked") || "Booked"}
        </span>
      </div>

      <div className="p-2.5 md:p-5">
        {trip.bookings && trip.bookings.length > 0 ? (
          <div className="space-y-6">
            {/* Unified Booking Container */}
            <div className="bg-light-bg/50 rounded-[32px] border border-border/60 overflow-hidden">
              {/* Booked By Header Section */}
              {bookedBy && (
                <div className="bg-primary/5 p-4 md:p-6 border-b border-primary/10">
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {rd("bookedBy") || "Booked By"}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary font-black border border-primary/20 shadow-sm text-lg">
                        {bookedBy.first_name?.charAt(0) ||
                          bookedBy.name?.charAt(0) ||
                          "U"}
                      </div>
                      <div>
                        <div className="text-base font-black text-dark-text">
                          {bookedBy.first_name} {bookedBy.last_name}
                        </div>
                        <div className="text-xs font-bold text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <HiPhone className="w-3.5 h-3.5 text-primary/60" />
                          {bookedBy.phone}
                        </div>
                      </div>
                    </div>
                    {bookedBy.phone && (
                      <a
                        href={`tel:${bookedBy.phone}`}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <HiPhone className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Passengers List Section */}
              <div className="p-2.5 md:p-5 space-y-4">
                {bookedBy && (
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                    {rd("passengerDetails") || "Passengers"}
                  </div>
                )}
                <div className="space-y-3">
                  {trip.bookings
                    .flatMap((booking: any) =>
                      (booking.passengers || []).map((p: any) => ({
                        ...p,
                        bookingId: booking.id,
                        isMine:
                          isPassengerMode &&
                          String(booking.id) === String(myBookingId),
                      })),
                    )
                    .filter((passenger: any) => {
                      const st = (
                        passenger.booking_status ||
                        passenger.passenger_status ||
                        passenger.status ||
                        ""
                      ).toLowerCase();
                      return st !== "cancelled" && st !== "canceled";
                    })
                    .map((passenger: any, index: number) => (
                      <div
                        key={`${passenger.bookingId}-${passenger.id || index}`}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                          passenger.isMine
                            ? "bg-white border-primary/20 shadow-sm ring-1 ring-primary/5"
                            : "bg-white/50 border-border/40",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm border shadow-sm shrink-0",
                              passenger.isMine
                                ? "bg-primary text-white border-primary/20"
                                : "bg-white text-gray-400 border-border",
                            )}
                          >
                            {isPublic ? "P" : passenger.name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-black text-dark-text text-sm">
                                {isPublic
                                  ? rd("passenger") || "Passenger"
                                  : passenger.name}
                              </div>
                            </div>
                            {!isPublic && passenger.phone && (
                              <div className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                                <HiPhone className="w-3 h-3 text-primary/60" />
                                {passenger.phone}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {(isDriver || passenger.isMine) &&
                            passenger.latitude &&
                            passenger.longitude && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${passenger.latitude},${passenger.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 bg-white text-emerald-600 rounded-xl border border-border hover:bg-emerald-50 transition-all shadow-sm"
                                title={rd("viewOnMap") || "View on Map"}
                              >
                                <HiMap className="w-4 h-4" />
                              </a>
                            )}
                          {isDriver && passenger.phone && (
                            <a
                              href={`tel:${passenger.phone}`}
                              className="p-2.5 bg-white text-primary rounded-xl border border-border hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                              <HiPhone className="w-4 h-4" />
                            </a>
                          )}

                          {passenger.isMine &&
                            onRemovePassenger &&
                            !disabled && (
                              <button
                                disabled={isRemoving}
                                onClick={() => onRemovePassenger(passenger.id)}
                                className="p-2.5 bg-white text-error rounded-xl border border-error/20 hover:bg-error hover:text-white transition-all shadow-sm disabled:opacity-50"
                                title={
                                  rd("removePassenger") || "Remove Passenger"
                                }
                              >
                                <HiTrash className="w-4 h-4" />
                              </button>
                            )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 px-6 text-center bg-light-bg/50 rounded-[32px] border border-dashed border-border/60">
            <HiUserGroup className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-sm">
              {rd("noBookings") || "No passengers yet"}
            </p>
          </div>
        )}

        {/* Add Passenger Button for Owner */}
        {isPassengerMode &&
          hasAvailableSeats &&
          onAddPassenger &&
          !disabled && (
            <div className="mt-5">
              <button
                onClick={onAddPassenger}
                className="w-full flex items-center justify-center gap-2 p-4 bg-white border-2 border-dashed border-primary/20 rounded-[28px] text-primary font-black text-sm hover:bg-primary/5 hover:border-primary/40 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HiUserAdd className="w-4 h-4" />
                </div>
                {rd("addAnotherPassenger") || "Add Another Passenger"}
              </button>
            </div>
          )}
      </div>
    </div>
  );
};
