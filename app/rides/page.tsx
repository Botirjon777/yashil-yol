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
  HiTruck,
} from "react-icons/hi";
import { formatCurrency, formatDate, cn } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useSearchTrips,
  useAllPublicTrips,
} from "@/src/features/rides/hooks/useRides";
import Loader from "@/src/components/ui/Loader";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";
import {
  useRegions,
  useDistricts,
  useQuarters,
} from "@/src/features/location/hooks/useLocation";

const RidesContent = () => {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const { t, language } = useLanguageStore();
  const { setRegions, setDistricts, setQuarters } = useLocationStore();

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

  const hasFilters = Boolean(
    (queryParams.start_region_id || queryParams.end_region_id) && 
    queryParams.departure_date
  );

  const { data: searchRides, isLoading: isSearchLoading } = useSearchTrips(
    queryParams,
    hasFilters,
  );
  const { data: allRides, isLoading: isAllLoading } =
    useAllPublicTrips(!hasFilters);

  // Location Data for Store
  const { data: regionsData } = useRegions();
  const { data: districtsData } = useDistricts();
  const { data: quartersData } = useQuarters();

  useEffect(() => {
    if (regionsData) setRegions(regionsData);
    if (districtsData) setDistricts(districtsData);
    if (quartersData) setQuarters(quartersData);
  }, [
    regionsData,
    districtsData,
    quartersData,
    setRegions,
    setDistricts,
    setQuarters,
  ]);

  const rides = hasFilters ? searchRides : allRides;
  const isLoading = hasFilters ? isSearchLoading : isAllLoading;

  useEffect(() => {
    if (rides) {
      console.log("DEBUG: Search results from API:", rides);
    }
  }, [rides]);

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
    // For testing, disabled the self-exclusion filter so you can see your own trips
    // if (user && Number(ride.driver_id) === Number(user.id)) return false;

    const price = Number(ride.price_per_seat || 0);
    const matchesPrice = price <= priceRange;

    let matchesTime = true;
    if (timeSlots.length > 0 && ride.start_time) {
      const departureHour = new Date(ride.start_time).getHours();
      matchesTime = timeSlots.some((slot) => {
        if (slot === "morning") return departureHour >= 6 && departureHour < 12;
        if (slot === "afternoon")
          return departureHour >= 12 && departureHour < 18;
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
            <h1 className="text-3xl font-black">{t("rides", "title")}</h1>
            <p className="text-gray-500 font-medium mt-1">
              {mounted
                ? language === "uz"
                  ? `${filteredRides.length} ${t("rides", "found")}`
                  : `${t("rides", "found")}: ${filteredRides.length}`
                : t("common", "loading")}
            </p>
          </div>
          <Link href="/">
            <Button variant="secondary" size="md">
              {t("rides", "changeSearch")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-5">
            <div className="premium-card p-5">
              <h3 className="font-black text-lg mb-6 flex items-center uppercase tracking-widest">
                <HiAdjustments className="mr-2 text-primary" />{" "}
                {t("rides", "filters")}
              </h3>

              <div className="space-y-8">
                <div>
                  <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-4 underline decoration-primary/20 underline-offset-4">
                    {t("rides", "departureTime")}
                  </h4>
                  <div className="space-y-4">
                    <TimeCheckbox
                      label={t("rides", "morning")}
                      checked={timeSlots.includes("morning")}
                      onChange={() => handleTimeSlotChange("morning")}
                    />
                    <TimeCheckbox
                      label={t("rides", "afternoon")}
                      checked={timeSlots.includes("afternoon")}
                      onChange={() => handleTimeSlotChange("afternoon")}
                    />
                    <TimeCheckbox
                      label={t("rides", "evening")}
                      checked={timeSlots.includes("evening")}
                      onChange={() => handleTimeSlotChange("evening")}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">
                    {t("rides", "maxPrice")}:{" "}
                    {mounted ? priceRange.toLocaleString() : "---"} UZS
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
                <p className="mt-4 text-gray-500 font-bold animate-pulse">
                  {t("rides", "searching")}
                </p>
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
                <h3 className="text-2xl font-black mb-2">
                  {t("rides", "noRides")}
                </h3>
                <p className="text-gray-500 font-medium mb-8">
                  {t("rides", "noRidesDesc")}
                </p>
                <Link href="/">
                  <Button>{t("rides", "newSearch")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function TimeCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div
        className={`w-5 h-5 border-2 rounded-lg flex items-center justify-center transition-all ${checked ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}
      >
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
      </div>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      <span className="font-medium text-sm">{label}</span>
    </label>
  );
}

function RideResultCard({ ride }: { ride: any }) {
  const { language, t } = useLanguageStore();
  const { regions, districts, quarters, resolveLocationName } =
    useLocationStore();

  const fromRegion =
    resolveLocationName(
      ride.start_region,
      ride.start_region_id || ride.from_region_id,
      regions,
      language,
    ) || "---";

  const fromDistrict = resolveLocationName(
    ride.start_district,
    ride.start_district_id || ride.from_district_id,
    districts,
    language,
  );

  const fromQuarter = resolveLocationName(
    ride.start_quarter,
    ride.start_quarter_id || ride.from_quarter_id,
    quarters,
    language,
  );

  const toRegion =
    resolveLocationName(
      ride.end_region,
      ride.end_region_id || ride.to_region_id,
      regions,
      language,
    ) || "---";

  const toDistrict = resolveLocationName(
    ride.end_district,
    ride.end_district_id || ride.to_district_id,
    districts,
    language,
  );

  const toQuarter = resolveLocationName(
    ride.end_quarter,
    ride.end_quarter_id || ride.to_quarter_id,
    quarters,
    language,
  );

  const fullFrom = [fromRegion, fromDistrict, fromQuarter]
    .filter(Boolean)
    .join(", ");
  const fullTo = [toRegion, toDistrict, toQuarter].filter(Boolean).join(", ");

  const driverFirstName = ride.driver?.first_name || "";
  const driverLastName = ride.driver?.last_name || "";
  const driverName =
    driverFirstName || driverLastName
      ? `${driverFirstName} ${driverLastName}`.trim()
      : "Driver";

  return (
    <Link href={`/rides/${ride.id}`} className="block group font-sans">
      <div className="premium-card p-5 md:p-6 hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="grow min-w-0">
            {/* Redesigned Vertical Route Info */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex flex-col items-center self-stretch py-1 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white"></div>
                <div className="flex-1 w-px border-l border-dashed border-border group-hover:border-primary/40 transition-colors my-1"></div>
                <div className="w-2.5 h-2.5 rounded-full border-2 border-secondary bg-white"></div>
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                {/* Departure row */}
                <div>
                  <div className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                    {t("rideDetails", "departure")}
                    <span className="mx-1.5 w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                    <span className="normal-case tracking-normal text-primary">
                      {new Date(ride.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-sm md:text-base font-black text-dark-text leading-tight wrap-break-word">
                    {fullFrom}
                  </div>
                </div>

                {/* Arrival row */}
                <div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                    {t("rideDetails", "destination")}
                  </div>
                  <div className="text-sm md:text-base font-black text-dark-text leading-tight wrap-break-word">
                    {fullTo}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] uppercase border border-primary/20 overflow-hidden shadow-sm mr-3">
                  {driverName.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-black leading-tight text-dark-text">
                    {driverName}
                  </div>
                  <div className="flex items-center text-[10px] font-black text-accent mt-0.5">
                    <HiStar className="mr-0.5 shadow-sm" />{" "}
                    {ride.driver?.rating || "4.8"}
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-px h-6 bg-border"></div>
              <div className="flex items-center text-[10px] font-black text-gray-500 bg-light-bg px-2.5 py-1 rounded-lg border border-border/40">
                <HiTruck className="mr-1.5 text-secondary w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">
                  {ride.vehicle?.brand && `${ride.vehicle.brand} `}
                  {ride.vehicle?.model || "Standard"}
                </span>
                {(ride.vehicle?.plate_number || ride.vehicle?.car_number) && (
                  <span className="ml-2 px-1 py-0.5 bg-dark-text text-white text-[8px] rounded font-bold tracking-wider">
                    {ride.vehicle.plate_number || ride.vehicle.car_number}
                  </span>
                )}
              </div>
              <div className="text-[10px] font-bold text-gray-400">
                {formatDate(ride.start_time)}
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
            <div className="text-center md:text-right">
              <div className="text-xl md:text-2xl font-black text-primary leading-none mb-1">
                {formatCurrency(Number(ride.price_per_seat || 0))}
              </div>
              <div className="flex items-center text-[9px] font-black text-gray-400 uppercase tracking-widest justify-center md:justify-end">
                <HiUserGroup className="mr-1 w-3.5 h-3.5 text-secondary/60" />{" "}
                {ride.available_seats} {t("rides", "seatsLeft")}
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              className="shadow-lg shadow-primary/10 group-hover:scale-[1.02] transition-all px-6"
            >
              {t("rides", "joinRide")}
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
