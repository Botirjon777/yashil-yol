import React from "react";
import { RideCard } from "../components/RideCard";

interface RidesSectionProps {
  rideType: "passenger" | "driver";
  handleRideTypeChange: (type: "passenger" | "driver") => void;
  activeRides: any[];
  historyRides: any[];
  isDriver: boolean;
}

export function RidesSection({ 
  rideType, 
  handleRideTypeChange, 
  activeRides, 
  historyRides, 
  isDriver 
}: RidesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-black text-dark-text">My Rides</h1>
        {isDriver && (
          <div className="flex bg-white p-1 rounded-xl border border-border">
            <button 
              onClick={() => handleRideTypeChange("passenger")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${rideType === "passenger" ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              As Passenger
            </button>
            <button 
              onClick={() => handleRideTypeChange("driver")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${rideType === "driver" ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              As Driver
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black text-gray-400 uppercase tracking-widest">Active & Upcoming</h2>
        {activeRides?.length === 0 ? (
          <div className="premium-card p-12 text-center text-gray-500 font-medium">
            No active rides found.
          </div>
        ) : (
          activeRides?.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))
        )}

        <h2 className="text-lg font-black text-gray-400 uppercase tracking-widest pt-8">History</h2>
        {historyRides?.length === 0 ? (
          <div className="premium-card p-12 text-center text-gray-500 font-medium">
            No ride history found.
          </div>
        ) : (
          historyRides?.map((ride) => (
            <RideCard key={ride.id} ride={ride} isHistory />
          ))
        )}
      </div>
    </div>
  );
}
