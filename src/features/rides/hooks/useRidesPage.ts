"use client";

import { useState, useEffect } from "react";
import { useSearchTrips, usePublicTrips, useSearchTripsByRegion } from "./useRides";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLocationStore } from "@/src/providers/LocationStore";
import { useRegions, useDistricts, useQuarters } from "@/src/features/location/hooks/useLocation";
import type { PopularRoute, TimeSlotKey } from "../constants/routes";
import type { Trip } from "../types";

export interface RidesPageFilters {
  priceRange: number;
  timeSlots: TimeSlotKey[];
  minSeats: number;
}

export const DEFAULT_FILTERS: RidesPageFilters = {
  priceRange: 1000000,
  timeSlots: [],
  minSeats: 1,
};

export function useRidesPage() {
  const { user } = useAuthStore();
  const { setRegions, setDistricts, setQuarters } = useLocationStore();

  // Sync location stores
  const { data: regionsData } = useRegions();
  const { data: districtsData } = useDistricts();
  const { data: quartersData } = useQuarters();
  useEffect(() => {
    if (regionsData) setRegions(regionsData);
    if (districtsData) setDistricts(districtsData);
    if (quartersData) setQuarters(quartersData);
  }, [regionsData, districtsData, quartersData, setRegions, setDistricts, setQuarters]);

  // Active route chip
  const [activeRoute, setActiveRoute] = useState<PopularRoute | null>(null);

  // Manual search state
  const [manualSearch, setManualSearch] = useState<{
    from?: { regionId: string; regionName: string; districtId?: string; districtName?: string; quarterId?: string; quarterName?: string };
    to?: { regionId: string; regionName: string; districtId?: string; districtName?: string; quarterId?: string; quarterName?: string };
  } | null>(null);

  // Pagination (only used in "all" mode)
  const [page, setPage] = useState(1);

  // Client-side filter state
  const [filters, setFilters] = useState<RidesPageFilters>(DEFAULT_FILTERS);

  // Data fetching
  const searchParams = {
    start_region_id: activeRoute ? activeRoute.from_id : (manualSearch?.from?.regionId || ""),
    start_district_id: manualSearch?.from?.districtId || "",
    start_quarter_id: manualSearch?.from?.quarterId || "",
    end_region_id: activeRoute ? activeRoute.to_id : (manualSearch?.to?.regionId || ""),
    end_district_id: manualSearch?.to?.districtId || "",
    end_quarter_id: manualSearch?.to?.quarterId || "",
    departure_date: "",
    passengers: filters.minSeats,
    page,
    per_page: 5
  };

  const { data: searchRidesData, isLoading: isSearchLoading, error: searchError } = useSearchTrips(searchParams, !!manualSearch);
  const { data: regionRidesData, isLoading: isRegionLoading, error: regionError } = useSearchTripsByRegion(
    activeRoute?.from_id || "",
    activeRoute?.to_id || "",
    page,
    5,
    !!activeRoute
  );

  const { data: reverseRegionRidesData, isLoading: isReverseLoading } = useSearchTripsByRegion(
    activeRoute?.to_id || "",
    activeRoute?.from_id || "",
    page,
    5,
    !!activeRoute
  );
  const { data: paginatedData, isLoading: isAllLoading } = usePublicTrips(page, 5);

  const rawRides: Trip[] = activeRoute 
    ? Array.from(
        new Map(
          [...(regionRidesData?.data ?? []), ...(reverseRegionRidesData?.data ?? [])].map((trip) => [trip.id, trip])
        ).values()
      )
    : manualSearch 
      ? (searchRidesData?.data ?? []) 
      : (paginatedData?.data ?? []);
  
  const meta = activeRoute 
    ? regionRidesData?.meta 
    : manualSearch 
      ? searchRidesData?.meta 
      : paginatedData?.meta;

  const isLoading = activeRoute ? (isRegionLoading || isReverseLoading) : manualSearch ? isSearchLoading : isAllLoading;

  // Client-side filtering
  const filteredRides = rawRides.filter((ride) => {
    if (user && Number(ride.driver_id) === Number(user.id)) return false;
    if (Number(ride.price_per_seat ?? 0) > filters.priceRange) return false;
    if (Number(ride.available_seats ?? 0) < filters.minSeats) return false;

    if (filters.timeSlots.length > 0 && ride.start_time) {
      const h = new Date(ride.start_time).getHours();
      const match = filters.timeSlots.some((s) => {
        if (s === "morning")   return h >= 6  && h < 12;
        if (s === "afternoon") return h >= 12 && h < 18;
        if (s === "evening")   return h >= 18 || h < 6;
        return false;
      });
      if (!match) return false;
    }
    return true;
  });

  // Debugging logs
  useEffect(() => {
    if (activeRoute) {
      console.log("Popular Route Active:", `${activeRoute.from} - ${activeRoute.to}`);
      console.log("Region IDs:", activeRoute.from_id, "->", activeRoute.to_id);
      console.log("Region Rides Data:", regionRidesData);
      if (regionError) console.error("Region Search Error:", regionError);
    }
    if (manualSearch) {
      console.log("Manual Search Active:", manualSearch);
      console.log("Search Rides Data:", searchRidesData);
      if (searchError) console.error("Search Error:", searchError);
    }
    console.log("Raw Rides:", rawRides.length);
    console.log("Filtered Rides:", filteredRides.length);
  }, [activeRoute, manualSearch, regionRidesData, searchRidesData, rawRides, filteredRides, regionError, searchError]);

  const activeFilterCount =
    (filters.timeSlots.length > 0 ? 1 : 0) +
    (filters.priceRange < 1000000 ? 1 : 0) +
    (filters.minSeats > 1 ? 1 : 0);

  const handleRouteClick = (route: PopularRoute) => {
    setActiveRoute((prev) => 
      (prev?.from_id === route.from_id && prev?.to_id === route.to_id) ? null : route
    );
    setManualSearch(null); // Clear manual search if popular route is clicked
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActiveRoute(null);
    setManualSearch(null);
  };

  const updateFilter = <K extends keyof RidesPageFilters>(key: K, value: RidesPageFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleTimeSlot = (slot: TimeSlotKey) =>
    updateFilter(
      "timeSlots",
      filters.timeSlots.includes(slot)
        ? filters.timeSlots.filter((s) => s !== slot)
        : [...filters.timeSlots, slot],
    );

  return {
    // Auth
    user,
    // Route swiper
    activeRoute,
    handleRouteClick,
    // Manual Search
    manualSearch,
    setManualSearch,
    // Filters
    filters,
    updateFilter,
    toggleTimeSlot,
    clearFilters,
    activeFilterCount,
    // Data
    filteredRides,
    isLoading,
    // Pagination
    page,
    setPage,
    meta,
  };
}
