"use client";

import React from "react";
import { HiArrowRight } from "react-icons/hi";
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
  isBooking: boolean;
  handleBook: () => void;
  rd: (key: string) => string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  trip,
  from,
  to,
  numSeats,
  isBooking,
  handleBook,
  rd,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rd("confirmBooking")}
    >
      <div className="space-y-6">
        <div className="bg-light-bg p-6 rounded-3xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-bold">{rd("route")}</span>
            <span className="text-dark-text font-black flex items-center">
              {from} <HiArrowRight className="mx-2" /> {to}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-bold">{rd("date")}</span>
            <span className="text-dark-text font-black">
              {formatDate(trip.start_time)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-bold">{rd("seats")}</span>
            <span className="text-dark-text font-black">{numSeats}</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-gray-500 font-bold text-lg">
              {rd("amountToPay")}
            </span>
            <span className="text-2xl font-black text-primary">
              {formatCurrency(Number(trip.price_per_seat) * numSeats)}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center font-medium">
          {rd("payBalance")}.
        </p>

        <Button fullWidth size="lg" loading={isBooking} onClick={handleBook}>
          {rd("confirmBooking")}
        </Button>
      </div>
    </Modal>
  );
};
