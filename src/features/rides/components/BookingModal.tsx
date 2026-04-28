"use client";

import { HiArrowRight, HiCash, HiShieldCheck } from "react-icons/hi";
import { formatCurrency, formatDate, cn } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import dynamic from "next/dynamic";
const MapPicker = dynamic(() => import("@/src/components/ui/MapPicker"), {
  ssr: false,
});
import { useState } from "react";
import { HiMap } from "react-icons/hi";

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
  const [activePickerIndex, setActivePickerIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    passengers.forEach((p, i) => {
      if (!p.name.trim()) newErrors[`name_${i}`] = rd("nameRequired") || "Name is required";
      if (!p.phone.trim()) newErrors[`phone_${i}`] = rd("phoneRequired") || "Phone is required";
      if (!p.latitude || !p.longitude) newErrors[`location_${i}`] = rd("locationRequired") || "Location is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onConfirm = () => {
    if (validate()) {
      handleBook("balance");
    }
  };

  if (activePickerIndex !== null) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setActivePickerIndex(null)}
        title={rd("selectLocation") || "Select Location"}
      >
        <MapPicker
          initialLat={passengers[activePickerIndex].latitude}
          initialLng={passengers[activePickerIndex].longitude}
          onCancel={() => setActivePickerIndex(null)}
          rd={rd}
          onSelect={(lat, lng) => {
            updatePassenger(activePickerIndex, "latitude", lat);
            updatePassenger(activePickerIndex, "longitude", lng);
            setActivePickerIndex(null);
          }}
        />
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rd("confirmBooking") || "Confirm Booking"}
    >
      <div className="space-y-6">
        {/* Trip Summary */}
        <div className="bg-light-bg p-5 rounded-3xl border border-border space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  {rd("departure") || "Departure"}
                </p>
                <p className="text-sm font-black text-dark-text leading-tight">
                  {from}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <HiArrowRight className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  {rd("destination") || "Destination"}
                </p>
                <p className="text-sm font-black text-dark-text leading-tight">
                  {to}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {rd("date") || "Date"}
              </p>
              <p className="text-sm font-black text-dark-text">
                {formatDate(trip.start_time)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {rd("amountToPay") || "Total"}
              </p>
              <p className="text-2xl font-black text-primary leading-none">
                {formatCurrency(Number(trip.price_per_seat) * numSeats)}
              </p>
            </div>
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
                        onChange={(e) => {
                          updatePassenger(i, "name", e.target.value);
                          if (errors[`name_${i}`]) setErrors(prev => {
                            const n = { ...prev };
                            delete n[`name_${i}`];
                            return n;
                          });
                        }}
                        className={cn(
                          "w-full bg-light-bg border rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all",
                          errors[`name_${i}`] ? "border-error" : "border-transparent"
                        )}
                        placeholder={rd("enterName") || "Enter name"}
                      />
                      {errors[`name_${i}`] && <p className="text-[9px] text-error font-bold mt-0.5">{errors[`name_${i}`]}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">
                        {rd("phone") || "Phone"}
                      </label>
                      <input
                        type="text"
                        value={p.phone}
                        onChange={(e) => {
                          updatePassenger(i, "phone", e.target.value);
                          if (errors[`phone_${i}`]) setErrors(prev => {
                            const n = { ...prev };
                            delete n[`phone_${i}`];
                            return n;
                          });
                        }}
                        className={cn(
                          "w-full bg-light-bg border rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all",
                          errors[`phone_${i}`] ? "border-error" : "border-transparent"
                        )}
                        placeholder={rd("phonePlaceholder") || "+998..."}
                      />
                      {errors[`phone_${i}`] && <p className="text-[9px] text-error font-bold mt-0.5">{errors[`phone_${i}`]}</p>}
                    </div>
                  </div>

                  {showLocation && (
                    <div className="pt-2 space-y-3 border-t border-dashed border-border">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {rd("pickupLocation") || "Pick-up Location"}
                        </label>
                        <button
                          type="button"
                          onClick={() => setActivePickerIndex(i)}
                          className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:text-primary-dark transition-colors bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10"
                        >
                          <HiMap className="w-3.5 h-3.5" />
                          {rd("pickOnMap") || "Pick on Map"}
                        </button>
                      </div>
                      
                      {p.latitude && p.longitude ? (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <HiShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                            {rd("locationSelected") || "Location Selected"}
                          </p>
                        </div>
                      ) : (
                        <div className={cn(
                          "py-3 text-center border-2 border-dashed rounded-xl transition-colors",
                          errors[`location_${i}`] ? "border-error/50 bg-error/5" : "border-border"
                        )}>
                          <p className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            errors[`location_${i}`] ? "text-error" : "text-gray-400"
                          )}>
                            {errors[`location_${i}`] || rd("noLocationSelected") || "Pick location on map"}
                          </p>
                        </div>
                      )}
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
          onClick={onConfirm}
          className="shadow-xl shadow-primary/20"
        >
          {rd("confirmBooking") || "Confirm Booking"}
        </Button>
        <p className="text-[10px] text-gray-400 font-medium text-center leading-relaxed px-2">
          {rd("smsNotice")}
        </p>
      </div>
    </Modal>
  );
};
