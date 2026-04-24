"use client";

import { HiArrowRight, HiCash } from "react-icons/hi";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
  from: string;
  to: string;
  numSeats: number;
  passengers: {
    name: string;
    phone: string;
    latitude: string;
    longitude: string;
  }[];
  updatePassenger: (
    index: number,
    field: "name" | "phone" | "latitude" | "longitude",
    value: string,
  ) => void;
  sameLocation: boolean;
  setSameLocation: (val: boolean) => void;
  isBooking: boolean;
  handleBook: (paymentMethod: string) => void;
  rd: (key: string) => string;
}

export const BookingModal = ({
  isOpen,
  onClose,
  trip,
  from,
  to,
  numSeats,
  passengers,
  updatePassenger,
  sameLocation,
  setSameLocation,
  isBooking,
  handleBook,
  rd,
}: BookingModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rd("confirmBooking") || "Confirm Booking"}
    >
      <div className="space-y-6">
        {/* Trip Summary */}
        <div className="bg-light-bg p-4 rounded-3xl border border-border space-y-2">
          <div className="flex items-start justify-between text-xs">
            <span className="text-gray-500 font-bold">
              {rd("route") || "Route"}
            </span>
            <span className="text-dark-text font-black flex items-center gap-2 text-right truncate ml-4">
              {from} <HiArrowRight /> {to}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-bold">
              {rd("date") || "Date"}
            </span>
            <span className="text-dark-text font-black">
              {formatDate(trip.start_time)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-gray-600 font-black text-sm">
              {rd("amountToPay") || "Total"}
            </span>
            <span className="text-xl font-black text-primary">
              {formatCurrency(Number(trip.price_per_seat) * numSeats)}
            </span>
          </div>
        </div>

        {/* Passengers Data */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
              {rd("passengerDetails") || "Passenger Details"}
            </p>
            {numSeats > 1 && (
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={sameLocation}
                  onChange={(e) => setSameLocation(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                />
                <span className="text-[10px] font-black text-gray-400 group-hover:text-primary transition-colors">
                  {rd("sameLocationForAll") || "Same pick-up for all"}
                </span>
              </label>
            )}
          </div>
          
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {passengers.map((p, i) => {
              const showLocation = !sameLocation || i === 0;
              
              return (
                <div
                  key={i}
                  className="p-4 bg-white border border-border rounded-2xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-primary">
                      {rd("passenger") || "Passenger"} {i + 1}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">
                        {rd("fullName") || "Full Name"}
                      </label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) =>
                          updatePassenger(i, "name", e.target.value)
                        }
                        className="w-full bg-light-bg border-none rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder={rd("enterName") || "Enter name"}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">
                        {rd("phone") || "Phone"}
                      </label>
                      <input
                        type="text"
                        value={p.phone}
                        onChange={(e) =>
                          updatePassenger(i, "phone", e.target.value)
                        }
                        className="w-full bg-light-bg border-none rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder={rd("phonePlaceholder") || "+998..."}
                      />
                    </div>
                  </div>

                  {showLocation && (
                    <div className="pt-2 space-y-3 border-t border-dashed border-border">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest">
                        {rd("pickupLocation") || "Pick-up Location"}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">
                            {rd("latitude") || "Latitude"}
                          </label>
                          <input
                            type="text"
                            value={p.latitude}
                            onChange={(e) =>
                              updatePassenger(i, "latitude", e.target.value)
                            }
                            className="w-full bg-light-bg border-none rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="e.g. 41.2995"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase">
                            {rd("longitude") || "Longitude"}
                          </label>
                          <input
                            type="text"
                            value={p.longitude}
                            onChange={(e) =>
                              updatePassenger(i, "longitude", e.target.value)
                            }
                            className="w-full bg-light-bg border-none rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="e.g. 69.2401"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Confirmation */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/20">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <HiCash className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-black text-dark-text">
                {rd("paymentMethod") || "Payment Method"}
              </p>
              <p className="text-xs font-bold text-gray-500">
                {rd("paymentFromBalance") ||
                  "Payment will be deducted from your account balance."}
              </p>
            </div>
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          loading={isBooking}
          onClick={() => handleBook("balance")}
        >
          {rd("confirmBooking") || "Confirm Booking"}
        </Button>
      </div>
    </Modal>
  );
};
