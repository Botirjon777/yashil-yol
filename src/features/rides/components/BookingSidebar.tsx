"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HiCreditCard, HiChatAlt2 } from "react-icons/hi";
import { formatCurrency } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";

interface BookingSidebarProps {
  trip: any;
  isDriver: boolean;
  isPast: boolean;
  canCancel: boolean;
  numSeats: number;
  setNumSeats: (n: number) => void;
  handleCancel: () => void;
  setIsBookModalOpen: (b: boolean) => void;
  isCanceling: boolean;
  driverName: string;
  rd: (key: string) => string;
}

export const BookingSidebar: React.FC<BookingSidebarProps> = ({
  trip,
  isDriver,
  isPast,
  canCancel,
  numSeats,
  setNumSeats,
  handleCancel,
  setIsBookModalOpen,
  isCanceling,
  driverName,
  rd,
}) => {
  const router = useRouter();

  if (isDriver) {
    return (
      <div className="premium-card p-8 sticky top-28 space-y-6">
        <div className="text-center">
          <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">
            {rd("earningsEstim")}
          </div>
          <div className="text-4xl font-black text-primary">
            {formatCurrency(
              (trip.total_seats - Number(trip.available_seats)) *
                Number(trip.price_per_seat),
            )}
          </div>
        </div>
        <div className="pt-6 border-t border-border">
          <Button
            fullWidth
            variant="secondary"
            onClick={() => router.push("/dashboard")}
          >
            {rd("editTrip")}
          </Button>
        </div>
        {canCancel && (
          <Button
            fullWidth
            variant="outline"
            className="text-error border-error/20 hover:bg-error/5"
            onClick={handleCancel}
            loading={isCanceling}
          >
            {rd("cancelTrip")}
          </Button>
        )}
        {!canCancel && !isPast && String(trip.status) === "active" && (
          <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest px-4">
            {rd("cancelBlocked") || "Cannot cancel trip less than 30 mins before departure"}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="premium-card p-8 sticky top-28">
      <div className="mb-8">
        <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 text-center underline decoration-primary decoration-4 underline-offset-8">
          {rd("pricePerSeat")}
        </div>
        <div className="text-4xl font-black text-primary text-center">
          {formatCurrency(Number(trip.price_per_seat))}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border">
          <span className="text-gray-500 font-bold">{rd("seats")}</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setNumSeats(Math.max(1, numSeats - 1))}
              className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={numSeats <= 1}
            >
              -
            </button>
            <span className="font-black text-dark-text min-w-[20px] text-center">
              {numSeats}
            </span>
            <button
              onClick={() =>
                setNumSeats(
                  Math.min(Number(trip.available_seats), numSeats + 1),
                )
              }
              className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={numSeats >= Number(trip.available_seats)}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border">
          <span className="text-gray-500 font-bold text-sm">{rd("total")}</span>
          <span className="text-xl font-black text-dark-text">
            {formatCurrency(Number(trip.price_per_seat) * numSeats)}
          </span>
        </div>
      </div>

      <Button
        fullWidth
        size="lg"
        disabled={Number(trip.available_seats) === 0 || isPast || isDriver}
        onClick={() => setIsBookModalOpen(true)}
      >
        {isPast
          ? rd("pastTrip") || "Past Trip"
          : isDriver
            ? rd("driverCannotBook") || "Cannot Book Own Ride"
            : Number(trip.available_seats) === 0
              ? rd("fullyBooked")
              : rd("bookRide")}
      </Button>

      {isDriver && !isPast && (
        <p className="mt-3 text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest px-4">
          {rd("driverBookingWarning") || "Drivers cannot book their own rides"}
        </p>
      )}

      <div className="mt-8 pt-8 border-t border-border space-y-4">
        <div className="flex items-center text-sm font-bold text-gray-500">
          <HiCreditCard className="mr-3 text-primary w-5 h-5 shrink-0" />{" "}
          {rd("payBalance")}
        </div>
        <div className="flex items-center text-sm font-bold text-gray-500">
          <HiChatAlt2 className="mr-3 text-primary w-5 h-5 shrink-0" />{" "}
          {rd("chatWith")} {driverName}
        </div>
      </div>
    </div>
  );
};
