"use client";

import { useState, Suspense, useEffect } from "react";
import {
  HiSearch,
  HiAdjustments,
  HiChevronRight,
  HiStar,
  HiClock,
  HiUserGroup,
  HiLocationMarker,
} from "react-icons/hi";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSearchTrips } from "@/src/features/rides/hooks/useRides";
import Loader from "@/src/components/ui/Loader";
import { useAuthStore } from "@/src/providers/AuthProvider";

const RidesContent = () => {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const queryParams = {
    start_region_id: searchParams.get("start_region_id") || "",
    end_region_id: searchParams.get("end_region_id") || "",
    start_district_id: searchParams.get("start_district_id") || "",
    end_district_id: searchParams.get("end_district_id") || "",
    start_quarter_id: searchParams.get("start_quarter_id") || "",
    end_quarter_id: searchParams.get("end_quarter_id") || "",
    departure_date: searchParams.get("departure_date") || "",
    passengers: Number(searchParams.get("passengers")) || 1,
  };

  const { data: rides, isLoading } = useSearchTrips(queryParams);

  const [priceRange, setPriceRange] = useState(500000);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTimeSlotChange = (slot: string) => {
    setTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
    );
  };

  const filteredRides = (rides || []).filter((ride) => {
    // A driver cannot book their own ride
    if (user && Number(ride.driver_id) === Number(user.id)) return false;

    const price = ride.price_per_seat || 0;
    const matchesPrice = price <= priceRange;
    
    let matchesTime = true;
    if (timeSlots.length > 0 && ride.start_time) {
      const departureHour = new Date(ride.start_time).getHours();
      matchesTime = timeSlots.some((slot) => {
        if (slot === "morning") return departureHour >= 6 && departureHour < 12;
        if (slot === "afternoon") return departureHour >= 12 && departureHour < 18;
        if (slot === "evening") return departureHour >= 18 || departureHour < 6;
        return true;
      });
    }

    return matchesPrice && matchesTime;
  });

  return (
    <div className="bg-light-bg min-h-screen py-6 md:py-10 text-dark-text">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">Available Rides</h1>
            <p className="text-gray-500 font-medium mt-1">
              {mounted ? `Found ${filteredRides.length} rides` : "Loading..."}
            </p>
          </div>
          <Link href="/">
            <Button variant="secondary" size="md">Change Search</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-5">
            <div className="premium-card p-5">
              <h3 className="font-black text-lg mb-6 flex items-center uppercase tracking-widest">
                <HiAdjustments className="mr-2 text-primary" /> Filters
              </h3>

              <div className="space-y-8">
                <div>
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-4 underline decoration-primary/20 underline-offset-4">
                    Departure Time
                  </h4>
                  <div className="space-y-4">
                    <TimeCheckbox label="Morning (06:00 - 12:00)" checked={timeSlots.includes("morning")} onChange={() => handleTimeSlotChange("morning")} />
                    <TimeCheckbox label="Afternoon (12:00 - 18:00)" checked={timeSlots.includes("afternoon")} onChange={() => handleTimeSlotChange("afternoon")} />
                    <TimeCheckbox label="Evening & Night" checked={timeSlots.includes("evening")} onChange={() => handleTimeSlotChange("evening")} />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">
                    Max Price: {mounted ? priceRange.toLocaleString() : "---"} UZS
                  </h4>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-primary appearance-none bg-gray-200 h-1.5 rounded-full"
                  />
                  <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
                    <span>10,000 UZS</span>
                    <span>1M UZS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-border">
                <Loader size="lg" />
                <p className="mt-4 text-gray-500 font-bold animate-pulse">Searching for best rides...</p>
              </div>
            ) : filteredRides.length > 0 ? (
              <div className="space-y-5">
                {filteredRides.map((ride) => (
                  <RideResultCard key={ride.id} ride={ride} />
                ))}
              </div>
            ) : (
              <div className="premium-card p-10 text-center">
                <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <HiSearch className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-2">No rides found</h3>
                <p className="text-gray-500 font-medium mb-8">Try adjusting your filters or search for another route.</p>
                <Link href="/">
                  <Button>Start New Search</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function TimeCheckbox({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${checked ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}>
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
      </div>
      <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
      <span className="font-medium text-sm">{label}</span>
    </label>
  );
}

function RideResultCard({ ride }: { ride: any }) {
  const from = ride.start_region?.name_uz || ride.start_region?.name || "Unknown";
  const to = ride.end_region?.name_uz || ride.end_region?.name || "Unknown";
  const driverName = ride.driver ? `${ride.driver.first_name} ${ride.driver.last_name}` : "Driver";
  
  return (
    <Link href={`/rides/${ride.id}`} className="block group font-sans">
      <div className="premium-card p-6 hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="grow">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-light-bg rounded-2xl flex items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
                <HiLocationMarker className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center text-xl font-black">
                  {from}
                  <HiChevronRight className="mx-2 text-gray-300 group-hover:text-primary transition-colors" />
                  {to}
                </div>
                <div className="text-sm font-bold text-gray-400 flex items-center mt-0.5">
                  <HiClock className="mr-1.5 w-4 h-4" /> 
                  {formatDate(ride.start_time)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase border-2 border-white overflow-hidden shadow-sm mr-3">
                  {driverName.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-black leading-tight">{driverName}</div>
                  <div className="flex items-center text-xs font-bold text-accent mt-0.5">
                    <HiStar className="mr-0.5" /> 4.8 (24)
                  </div>
                </div>
              </div>
              <div className="text-gray-200">|</div>
              <div className="text-sm font-bold text-gray-500 italic">
                {ride.vehicle?.brand} {ride.vehicle?.model}
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 bg-light-bg md:bg-transparent p-4 md:p-0 rounded-2xl">
            <div className="text-center md:text-right">
              <div className="text-2xl font-black text-primary leading-none mb-1">
                {formatCurrency(Number(ride.price_per_seat || 0))}
              </div>
              <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest justify-center md:justify-end">
                <HiUserGroup className="mr-1.5 w-4 h-4" /> {ride.available_seats} seats left
              </div>
            </div>
            <Button variant="primary" size="md" className="group-hover:translate-x-1 transition-transform">
              Join Ride
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

const RidesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-light-bg min-h-screen py-8 md:py-12 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      }
    >
      <RidesContent />
    </Suspense>
  );
};

export default RidesPage;
