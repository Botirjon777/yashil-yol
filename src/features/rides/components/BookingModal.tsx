"use client";

import React, { useState } from "react";
import { HiArrowRight, HiCheckCircle, HiCreditCard, HiCash } from "react-icons/hi";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import { cn } from "@/src/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
  from: string;
  to: string;
  numSeats: number;
  passengers: { name: string; phone: string }[];
  updatePassenger: (index: number, field: "name" | "phone", value: string) => void;
  isBooking: boolean;
  handleBook: (paymentMethod: string) => void;
  rd: (key: string) => string;
}

const PAYMENT_METHODS = [
  {
    id: "balance",
    icon: HiCash,
    label: "Balance",
    description: "Pay from your account balance",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary",
  },
  {
    id: "card",
    icon: HiCreditCard,
    label: "Bank Card",
    description: "Pay with debit/credit card",
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary",
  },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  trip,
  from,
  to,
  numSeats,
  passengers,
  updatePassenger,
  isBooking,
  handleBook,
  rd,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("balance");

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
            <span className="text-gray-500 font-bold">{rd("route") || "Route"}</span>
            <span className="text-dark-text font-black flex items-center gap-2 text-right truncate ml-4">
              {from} <HiArrowRight /> {to}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-bold">{rd("date") || "Date"}</span>
            <span className="text-dark-text font-black">{formatDate(trip.start_time)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-gray-600 font-black text-sm">{rd("amountToPay") || "Total"}</span>
            <span className="text-xl font-black text-primary">
              {formatCurrency(Number(trip.price_per_seat) * numSeats)}
            </span>
          </div>
        </div>

        {/* Passengers Data */}
        <div className="space-y-4">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
            {rd("passengerDetails") || "Passenger Details"}
          </p>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {passengers.map((p, i) => (
              <div key={i} className="p-4 bg-white border border-border rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-primary">
                    {rd("passenger") || "Passenger"} {i + 1}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      {rd("fullName") || "Full Name"}
                    </label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updatePassenger(i, "name", e.target.value)}
                      className="w-full bg-light-bg border-none rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      {rd("phone") || "Phone"}
                    </label>
                    <input
                      type="text"
                      value={p.phone}
                      onChange={(e) => updatePassenger(i, "phone", e.target.value)}
                      className="w-full bg-light-bg border-none rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="+998..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="pt-2">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">
            {rd("paymentMethod") || "Payment Method"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all",
                    isSelected
                      ? `${method.border} ${method.bg}`
                      : "border-border bg-white hover:border-gray-300",
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", isSelected ? method.bg : "bg-light-bg")}>
                    <Icon className={cn("w-4 h-4", isSelected ? method.color : "text-gray-400")} />
                  </div>
                  <div className="text-left">
                    <div className={cn("font-black text-xs", isSelected ? "text-dark-text" : "text-gray-600")}>
                      {method.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          loading={isBooking}
          onClick={() => handleBook(paymentMethod)}
        >
          {rd("confirmBooking") || "Confirm Booking"}
        </Button>
      </div>
    </Modal>
  );
};
