"use client";

import React from "react";
import { HiLocationMarker, HiClock } from "react-icons/hi";
import { formatDate, cn } from "@/src/lib/utils";

interface RideRouteCardProps {
  trip: any;
  from: string;
  to: string;
  rd: (key: string) => string;
}

export const RideRouteCard: React.FC<RideRouteCardProps> = ({ trip, from, to, rd }) => {
  return (
    <div className="premium-card p-8 md:p-10">
      <div className="flex items-center justify-between mb-10">
        <div className="text-sm font-black text-gray-400 uppercase tracking-widest">
          {formatDate(trip.start_time)}
        </div>
        <div
          className={cn(
            "px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-widest",
            String(trip.status) === "active"
              ? "bg-success/10 text-success"
              : String(trip.status) === "completed"
                ? "bg-primary/10 text-primary"
                : "bg-error/10 text-error",
          )}
        >
          {typeof trip.status === "string" ? trip.status : "Active"}
        </div>
      </div>

      <div className="relative flex flex-col space-y-8 md:space-y-12 before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-1 before:bg-linear-to-b before:from-primary before:to-secondary/50 before:rounded-full">
        {/* Departure */}
        <div className="flex items-start relative z-10">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 mr-6 shrink-0">
            <HiLocationMarker className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-2xl md:text-3xl font-black text-dark-text leading-tight mb-2 wrap-break-word">
              {from}
            </div>
            <div className="text-gray-400 font-bold flex items-center">
              <HiClock className="mr-2 w-4 h-4" /> {rd("departureAt")}{" "}
              {new Date(trip.start_time).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })},{" "}
              {new Date(trip.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Arrival */}
        <div className="flex items-start relative z-10">
          <div className="w-12 h-12 bg-white border-4 border-secondary rounded-2xl flex items-center justify-center text-secondary shadow-lg mr-6 shrink-0">
            <HiLocationMarker className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-2xl md:text-3xl font-black text-dark-text leading-tight mb-2 wrap-break-word">
              {to}
            </div>
            <div className="text-gray-400 font-bold text-sm md:text-base">
              {trip.end_time ? (
                <>
                  {rd("estimatedArrival")}:{" "}
                  {new Date(trip.end_time).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })},{" "}
                  {new Date(trip.end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              ) : (
                rd("arrivalVaries")
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
