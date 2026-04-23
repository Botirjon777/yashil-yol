"use client";

import { useState, Suspense, useEffect } from "react";
import { HiSearch, HiAdjustments, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useSearchTrips,
  usePublicTrips,
} from "@/src/features/rides/hooks/useRides";
import RideResultCard from "@/src/features/rides/components/RideResultCard";
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
    queryParams.departure_date,
  );

  const [page, setPage] = useState(1);

  const { data: searchRides, isLoading: isSearchLoading } = useSearchTrips(
    queryParams,
    hasFilters,
  );
  const { data: paginatedData, isLoading: isAllLoading } =
    usePublicTrips(page);

  const allRides = paginatedData?.data ?? [];
  const meta = paginatedData?.meta;

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
    // Exclude own rides (Drivers cannot book their own trips)
    if (user && Number(ride.driver_id) === Number(user.id)) return false;

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
                  <RideResultCard
                    key={ride.id}
                    ride={ride}
                    showDriverInfo={
                      user ? Number(ride.driver_id) === Number(user.id) : false
                    }
                  />
                ))}

                {/* Pagination — only shown when not filtering by search */}
                {!hasFilters && meta && meta.last_page > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="p-2 rounded-xl border border-border disabled:opacity-40 hover:bg-gray-50 transition-all"
                    >
                      <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold text-gray-500">
                      {page} / {meta.last_page}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                      disabled={page >= meta.last_page}
                      className="p-2 rounded-xl border border-border disabled:opacity-40 hover:bg-gray-50 transition-all"
                    >
                      <HiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
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

// RideResultCard removed here and moved to src/features/rides/components/RideResultCard.tsx

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
