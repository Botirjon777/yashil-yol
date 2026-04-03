"use client";

import React from "react";
import { 
  HiClock, 
  HiCheckCircle, 
  HiInformationCircle, 
  HiCash, 
  HiChevronRight,
  HiTicket,
  HiLocationMarker
} from "react-icons/hi";
import { Transaction } from "@/src/features/payment/actions/actions";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Modal from "@/src/components/ui/Modal";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  rd: (key: string) => any;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
  rd,
}) => {
  if (!transaction) return null;

  const isIncome = transaction.type === "credit";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rd("transactionDetails") || "Transaction Details"}
    >
      <div className="space-y-6">
        {/* Status & Amount Header */}
        <div className="flex flex-col items-center justify-center py-6 bg-light-bg rounded-lg border border-border/50">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isIncome ? "bg-success/10 text-success" : "bg-error/10 text-error"
          }`}>
            {isIncome ? <HiCheckCircle className="w-10 h-10" /> : <HiInformationCircle className="w-10 h-10" />}
          </div>
          <div className={`text-3xl font-black ${isIncome ? "text-success" : "text-error"}`}>
            {isIncome ? "+" : "-"} {formatCurrency(Math.abs(parseFloat(transaction.amount)))}
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            {transaction.status}
          </div>
        </div>

        {/* Core Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-border rounded-lg">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              <HiClock className="w-3" /> {rd("date") || "Date"}
            </div>
            <div className="text-sm font-bold text-dark-text">
              {formatDate(transaction.created_at)}
            </div>
            <div className="text-[10px] text-gray-400">
              {new Date(transaction.created_at).toLocaleTimeString()}
            </div>
          </div>
          <div className="p-4 bg-white border border-border rounded-lg">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              <HiCash className="w-3" /> {rd("balance") || "Balance"}
            </div>
            <div className="text-sm font-bold text-dark-text">
              {formatCurrency(parseFloat(transaction.balance_after))}
            </div>
            <div className="text-[10px] text-gray-400">
              Prev: {formatCurrency(parseFloat(transaction.balance_before))}
            </div>
          </div>
        </div>

        {/* Full Reason / Description */}
        <div className="p-4 bg-light-bg/30 border border-border rounded-lg">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            {rd("description") || "Reason / Description"}
          </div>
          <p className="text-xs font-medium text-gray-600 leading-relaxed whitespace-pre-line">
            {transaction.reason || "No details provided"}
          </p>
        </div>

        {/* Trip & Booking Metadata (If exists) */}
        {(transaction.trip || transaction.booking) && (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Metadata
            </p>
            <div className="space-y-2">
              {transaction.trip && (
                <div className="flex items-center justify-between p-3 bg-white border border-border rounded-lg text-xs">
                  <div className="flex items-center gap-2 font-bold text-gray-600">
                    <HiLocationMarker className="text-primary" /> Trip ID
                  </div>
                  <div className="font-black text-dark-text">#{transaction.trip.id}</div>
                </div>
              )}
              {transaction.booking && (
                <div className="flex items-center justify-between p-3 bg-white border border-border rounded-lg text-xs">
                  <div className="flex items-center gap-2 font-bold text-gray-600">
                    <HiTicket className="text-secondary" /> Booking ID
                  </div>
                  <div className="font-black text-dark-text">#{transaction.booking.id}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Close Action */}
        <button
          onClick={onClose}
          className="w-full py-4 text-center text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all rounded-lg border-2 border-primary/10"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
