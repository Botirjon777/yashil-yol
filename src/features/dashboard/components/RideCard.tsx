import React from "react";
import { HiLocationMarker, HiChevronRight, HiClock } from "react-icons/hi";
import { formatCurrency, formatDate } from "@/src/lib/utils";

interface RideCardProps {
  ride: any;
  isHistory?: boolean;
}

export function RideCard({ ride, isHistory = false }: RideCardProps) {
  const from = ride.start_region?.name || "Departure";
  const to = ride.end_region?.name || "Destination";
  const price = ride.price_per_seat || ride.total_price || 0;

  return (
    <div className="premium-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary transition-colors">
      <div className="flex items-center space-x-6">
        <div className="w-14 h-14 bg-light-bg rounded-2xl flex items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all">
          <HiLocationMarker className="w-7 h-7" />
        </div>
        <div>
          <div className="text-lg font-black text-dark-text flex items-center">
            {from} <HiChevronRight className="mx-2 text-gray-300" /> {to}
          </div>
          <div className="text-sm font-bold text-gray-400 flex items-center mt-1">
            <HiClock className="mr-1.5" /> {formatDate(ride.start_time || ride.created_at)}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-black text-primary mb-1">{formatCurrency(Number(price))}</div>
        <div className={`text-xs font-black uppercase tracking-widest ${isHistory ? "text-gray-400" : "text-success"}`}>
          {ride.status}
        </div>
      </div>
    </div>
  );
}
