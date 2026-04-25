"use client";

import { useState, useEffect } from "react";
import { useSearchTrips, usePublicTrips } from "./useRides";
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
  const searchParams = activeRoute
    ? { 
        start_region_id: activeRoute.from_id, 
        end_region_id: activeRoute.to_id, 
        departure_date: "", 
        passengers: filters.minSeats 
      }
    : manualSearch
      ? {
          start_region_id: manualSearch.from?.regionId || "",
          start_district_id: manualSearch.from?.districtId || "",
          start_quarter_id: manualSearch.from?.quarterId || "",
          end_region_id: manualSearch.to?.regionId || "",
          end_district_id: manualSearch.to?.districtId || "",
          end_quarter_id: manualSearch.to?.quarterId || "",
          departure_date: "",
          passengers: filters.minSeats
        }
      : { start_region_id: "", end_region_id: "", departure_date: "", passengers: 1 };

  const { data: searchRides, isLoading: isSearchLoading } = useSearchTrips(searchParams, !!activeRoute || !!manualSearch);
  const { data: paginatedData, isLoading: isAllLoading } = usePublicTrips(page);

  const rawRides: Trip[] = (activeRoute || manualSearch) ? (searchRides ?? []) : (paginatedData?.data ?? []);
  const meta = paginatedData?.meta;
  const isLoading = (activeRoute || manualSearch) ? isSearchLoading : isAllLoading;

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

  const activeFilterCount =
    (filters.timeSlots.length > 0 ? 1 : 0) +
    (filters.priceRange < 1000000 ? 1 : 0) +
    (filters.minSeats > 1 ? 1 : 0);

  const handleRouteClick = (route: PopularRoute) => {
    setActiveRoute((prev) => (prev?.label === route.label ? null : route));
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
