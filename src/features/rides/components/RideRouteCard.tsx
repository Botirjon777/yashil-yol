"use client";

import { HiLocationMarker, HiClock, HiArrowDown, HiMap } from "react-icons/hi";
import { formatDateTime, cn } from "@/src/lib/utils";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface RideRouteCardProps {
  trip: any;
  from: string;
  to: string;
  rd: (key: string) => string;
  isDriver?: boolean;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> =
  {
    active: {
      bg: "bg-emerald-50 border border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    completed: {
      bg: "bg-primary/5 border border-primary/20",
      text: "text-primary",
      dot: "bg-primary",
    },
    canceled: {
      bg: "bg-red-50 border border-red-200",
      text: "text-red-600",
      dot: "bg-red-500",
    },
    cancelled: {
      bg: "bg-red-50 border border-red-200",
      text: "text-red-600",
      dot: "bg-red-500",
    },
  };

export const RideRouteCard = ({ trip, from, to, rd, isDriver = false }: RideRouteCardProps) => {
  const { t } = useLanguageStore();
  const status = String(trip.status || "active").toLowerCase();
  const sc = statusConfig[status] ?? statusConfig.active;

  return (
    <div className="premium-card overflow-hidden">
      {/* Header strip */}
      <div className="px-6 pt-6 pb-5 flex items-center justify-between border-b border-border/60 bg-linear-to-r from-primary/3 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-2 h-2 rounded-full animate-pulse", sc.dot)} />
          <span
            className={cn(
              "text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full",
              sc.bg,
              sc.text,
            )}
          >
            {t("status", status)}
          </span>
        </div>
        <div className="text-xs font-bold text-gray-400">
          {formatDateTime(trip.start_time).split(" ")[0]}
        </div>
      </div>

      {/* Route */}
      <div className="p-6 md:p-8 space-y-0">
        {/* Departure */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center pt-1">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
              <HiLocationMarker className="w-5 h-5 text-white" />
            </div>
            <div className="w-0.5 h-full min-h-[56px] bg-linear-to-b from-primary via-primary/30 to-secondary/60 my-2 rounded-full" />
          </div>

          <div className="pb-8 min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
              <HiClock className="w-3 h-3" />
              {rd("departureAt")}
              <span className="text-primary font-black normal-case tracking-normal">
                {formatDateTime(trip.start_time)}
              </span>
            </div>
            <div className="text-xl md:text-2xl font-black text-dark-text leading-snug">
              {from}
            </div>
          </div>
        </div>

        {/* Midpoint pill */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center w-10 shrink-0">
            <div className="w-7 h-7 rounded-xl bg-light-bg border-2 border-border flex items-center justify-center">
              <HiArrowDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 flex items-center pb-4">
            {trip.start_time && trip.end_time && (
              <div className="text-xs font-bold text-gray-400 bg-light-bg border border-border/60 px-3 py-1 rounded-full">
                {(() => {
                  const diff =
                    new Date(trip.end_time).getTime() -
                    new Date(trip.start_time).getTime();
                  const hours = Math.floor(diff / 3600000);
                  const mins = Math.floor((diff % 3600000) / 60000);
                  return hours > 0
                    ? `~${hours}h ${mins > 0 ? `${mins}m` : ""}`
                    : `~${mins}m`;
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Arrival */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center pt-1 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-white border-4 border-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
              <HiLocationMarker className="w-5 h-5 text-secondary" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
              <HiClock className="w-3 h-3" />
              {trip.end_time ? (
                <>
                  {rd("estimatedArrival")}
                  <span className="text-secondary/80 font-black normal-case tracking-normal">
                    {formatDateTime(trip.end_time)}
                  </span>
                </>
              ) : (
                rd("arrivalVaries")
              )}
            </div>
            <div className="text-xl md:text-2xl font-black text-dark-text leading-snug">
              {to}
            </div>
          </div>
        </div>
      </div>

      {/* Map Link - Only visible to driver */}
      {isDriver && ((trip.start_lat && trip.start_long) || (trip.starting_point?.lat && trip.starting_point?.long)) && (
        <div className="px-6 pb-6">
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${trip.start_lat || trip.starting_point?.lat},${trip.start_long || trip.starting_point?.long}&destination=${trip.end_lat || trip.ending_point?.lat},${trip.end_long || trip.ending_point?.long}&mode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-2xl transition-all font-black uppercase text-xs tracking-widest shadow-xs group/btn active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 group-hover/btn:scale-110 transition-transform">
              <HiMap className="w-4 h-4" />
            </div>
            {rd("googleMaps") || "Open in Google Maps"}
          </a>
        </div>
      )}
    </div>
  );
};
