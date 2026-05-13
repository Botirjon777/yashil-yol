"use client";

import {
  HiCreditCard,
  HiShieldCheck,
  HiMinusSm,
  HiPlusSm,
  HiX,
  HiQuestionMarkCircle,
  HiMap,
} from "react-icons/hi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatCurrency } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import SlideButton from "@/src/components/ui/SlideButton";

interface BookingSidebarProps {
  trip: any;
  isDriver: boolean;
  isPast: boolean;
  canCancel: boolean;
  canCancelReason?: string | null;
  numSeats: number;
  setNumSeats: (n: number) => void;
  handleCancel: () => void;
  setIsBookModalOpen: (b: boolean) => void;
  isCanceling: boolean;
  driverName: string;
  rd: (key: string) => string;
  showDriverInfo?: boolean;
  handleStartTrip?: () => void;
  handleFinishTrip?: () => void;
  isStartingTrip?: boolean;
  isFinishingTrip?: boolean;
}

export const BookingSidebar = ({
  trip,
  isDriver,
  isPast,
  canCancel,
  canCancelReason,
  numSeats,
  setNumSeats,
  handleCancel,
  setIsBookModalOpen,
  isCanceling,
  driverName,
  rd,
  showDriverInfo = true,
  handleStartTrip,
  handleFinishTrip,
  isStartingTrip,
  isFinishingTrip,
}: BookingSidebarProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (isDriver) {
    const earned =
      (trip.total_seats - Number(trip.available_seats)) *
      Number(trip.price_per_seat);
    const bookedSeats = trip.total_seats - Number(trip.available_seats);

    return (
      <div className="premium-card sticky top-28">
        <div className="px-6 pt-6 pb-5 border-b border-border/60 bg-linear-to-r from-primary/5 to-transparent rounded-t-lg">
          <div className="relative flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            {rd("earningsEstim")}
            <div
              className="relative cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <HiQuestionMarkCircle className="w-3.5 h-3.5 text-gray-400/80 hover:text-primary transition-colors" />
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-dark-text text-[10px] text-white font-medium normal-case tracking-normal rounded-xl shadow-xl z-50 pointer-events-none"
                  >
                    <div className="relative">
                      {rd("earningsTooltip") ||
                        "This calculation is before service fees and taxes."}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-dark-text" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="text-4xl font-black text-primary">
            {formatCurrency(earned)}
          </div>
          <div className="text-xs font-bold text-gray-400 mt-1">
            {bookedSeats} / {trip.total_seats}{" "}
            {rd("seatsBooked") || "seats booked"}
          </div>
        </div>
        <div className="p-6 space-y-3">
          {isDriver &&
            !isPast &&
            ((String(trip.status) === "active" &&
              (trip.google_map_url ||
                (trip.start_lat && trip.start_long) ||
                (trip.starting_point?.lat && trip.starting_point?.long))) ||
              String(trip.status) === "in_progress") && (
              <div className="mb-4">
                <SlideButton
                  label={
                    String(trip.status) === "active"
                      ? rd("googleMaps") || "Open in Google Maps"
                      : rd("finishTrip") || "Slide to Finish"
                  }
                  icon={
                    String(trip.status) === "active" ? (
                      <HiMap className="w-6 h-6" />
                    ) : undefined
                  }
                  onSuccess={() => {
                    if (String(trip.status) === "active") {
                      // We don't call handleStartTrip here because the user wants it to ONLY open the map
                      const googleMapsUrl =
                        trip.google_map_url ||
                        `https://www.google.com/maps/dir/?api=1&origin=${trip.start_lat || trip.starting_point?.lat},${trip.start_long || trip.starting_point?.long}&destination=${trip.end_lat || trip.ending_point?.lat},${trip.end_long || trip.ending_point?.long}&mode=driving`;

                      // Small delay to allow the "Success!" animation state to be visible
                      setTimeout(() => {
                        window.open(googleMapsUrl, "_blank");
                      }, 500);
                    } else {
                      if (handleFinishTrip) handleFinishTrip();
                    }
                  }}
                  isLoading={isStartingTrip || isFinishingTrip}
                  successLabel={
                    String(trip.status) === "active"
                      ? rd("googleMaps") || "Opening Maps..."
                      : "Trip Finished!"
                  }
                />
              </div>
            )}
          {canCancel && (
            <Button
              fullWidth
              variant="outline"
              className="text-error border-error/30 hover:bg-error/5"
              onClick={handleCancel}
              loading={isCanceling}
              icon={<HiX className="w-4 h-4" />}
            >
              {rd("cancelTrip")}
            </Button>
          )}
          {!canCancel && !isPast && String(trip.status) === "active" && (
            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest px-2 leading-relaxed">
              {canCancelReason ||
                rd("cancelBlocked") ||
                "Cannot cancel trip less than 30 minutes before departure"}
            </p>
          )}
        </div>
      </div>
    );
  }

  const total = Number(trip.price_per_seat) * numSeats;
  const isFullyBooked = Number(trip.available_seats) === 0;
  const isDisabled = isFullyBooked || isPast || isDriver;

  return (
    <div className="premium-card overflow-hidden sticky top-28">
      {/* Price header */}
      <div className="px-6 pt-6 pb-5 border-b border-border/60 bg-linear-to-r from-primary/5 to-transparent">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
          {rd("pricePerSeat")}
        </div>
        <div className="text-4xl font-black text-primary">
          {formatCurrency(Number(trip.price_per_seat))}
        </div>
        <div className="text-xs font-bold text-gray-400 mt-1">
          {trip.available_seats} {rd("seats")} {rd("of") || "of"}{" "}
          {trip.total_seats} {rd("available") || "available"}
        </div>
      </div>

      <div className="p-2.5 md:p-5 space-y-4">
        {/* Seat counter */}
        <div className="bg-light-bg rounded-2xl border border-border/60 p-2.5 md:p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {rd("seats")}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNumSeats(Math.max(1, numSeats - 1))}
              disabled={numSeats <= 1}
              className="w-8 h-8 rounded-full bg-white border-2 border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            >
              <HiMinusSm className="w-4 h-4" />
            </button>
            <span className="font-black text-dark-text text-lg min-w-[28px] text-center">
              {numSeats}
            </span>
            <button
              onClick={() =>
                setNumSeats(
                  Math.min(Number(trip.available_seats), numSeats + 1),
                )
              }
              disabled={numSeats >= Number(trip.available_seats)}
              className="w-8 h-8 rounded-full bg-white border-2 border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            >
              <HiPlusSm className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="bg-dark-text/5 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-sm font-black text-gray-500 uppercase tracking-widest">
            {rd("total")}
          </span>
          <span className="text-2xl font-black text-dark-text">
            {formatCurrency(total)}
          </span>
        </div>

        {/* Book button */}
        <Button
          fullWidth
          size="lg"
          disabled={isDisabled}
          onClick={() => setIsBookModalOpen(true)}
          className="shadow-xl shadow-primary/20"
        >
          {isPast
            ? rd("pastTrip") || "Past Trip"
            : isFullyBooked
              ? rd("fullyBooked")
              : rd("bookRide")}
        </Button>
        <p className="text-[10px] text-gray-400 font-medium text-center leading-relaxed px-1">
          {rd("smsNotice")}
        </p>

        {/* Trust badges */}
        <div className="pt-2 space-y-2.5 border-t border-border/60 mt-2">
          <div className="flex items-center gap-2.5 text-xs font-bold text-gray-500">
            <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <HiCreditCard className="w-3.5 h-3.5 text-primary" />
            </div>
            {rd("payBalance")}
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-gray-500">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <HiShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            {rd("chatWith")}{" "}
            {showDriverInfo ? driverName : rd("verifiedDriver")}
          </div>
        </div>
      </div>
    </div>
  );
};
