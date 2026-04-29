"use client";

import { HiArrowRight, HiCash, HiShieldCheck } from "react-icons/hi";
import { formatCurrency, formatDate, cn, formatPhoneDisplay } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
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
                  
                    <div className="space-y-4">
                      <Input
                        label={rd("fullName") || "Full Name"}
                        value={p.name}
                        onChange={(e) => {
                          updatePassenger(i, "name", e.target.value);
                          if (errors[`name_${i}`]) setErrors(prev => {
                            const n = { ...prev };
                            delete n[`name_${i}`];
                            return n;
                          });
                        }}
                        error={errors[`name_${i}`]}
                        placeholder={rd("enterName") || "Enter name"}
                      />
                      
                      <Input
                        label={rd("phone") || "Phone"}
                        value={p.phone}
                        onChange={(e) => {
                          updatePassenger(i, "phone", e.target.value);
                          if (errors[`phone_${i}`]) setErrors(prev => {
                            const n = { ...prev };
                            delete n[`phone_${i}`];
                            return n;
                          });
                        }}
                        prefixText="+998"
                        error={errors[`phone_${i}`]}
                        placeholder="XX XXX XX XX"
                      />
                    </div>

                  {showLocation && (
                    <div className="pt-2 space-y-3 border-t border-dashed border-border">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">
                        {rd("pickupLocation") || "Pick-up Location"}
                      </label>
                      
                      {p.latitude && p.longitude ? (
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                              <HiMap className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-emerald-700 uppercase tracking-tight leading-none">
                                {rd("selectedLocation") || "Location Selected"}
                              </p>
                              <p className="text-[10px] font-bold text-emerald-600/70 mt-1">
                                {rd("readyToBook") || "Ready to proceed"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActivePickerIndex(i)}
                            className="px-4 py-2 bg-white text-[10px] font-black text-emerald-600 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
                          >
                            {rd("change") || "Change"}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActivePickerIndex(i)}
                          className={cn(
                            "w-full py-6 flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-3xl transition-all group",
                            errors[`location_${i}`] 
                              ? "border-error/40 bg-error/5 text-error" 
                              : "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform",
                            errors[`location_${i}`] ? "bg-white" : "bg-white"
                          )}>
                            <HiMap className={cn("w-6 h-6", errors[`location_${i}`] ? "text-error" : "text-primary")} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">
                            {rd("pickOnMap") || "Pick on Map"}
                          </span>
                          <p className={cn(
                            "text-[9px] font-bold max-w-[200px] text-center",
                            errors[`location_${i}`] ? "text-error/80" : "text-gray-400"
                          )}>
                            {errors[`location_${i}`] || rd("locationRequiredDesc") || "Click to open map and set pick-up point"}
                          </p>
                        </button>
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
