"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";
import { useMe } from "@/src/features/auth/hooks/useAuth";
import {
  useRegions,
  useDistricts,
  useQuarters,
} from "@/src/features/location/hooks/useLocation";
import {
  useTripById,
  useDriverTripById,
  useBookTrip,
  useCancelTrip,
} from "@/src/features/rides/hooks/useRides";

export function useRideDetails(tripId: string) {
  const router = useRouter();
  const { token, user: storedUser } = useAuthStore();
  const { language, t } = useLanguageStore();
  const {
    regions,
    districts,
    quarters,
    resolveLocationName,
    setRegions,
    setDistricts,
    setQuarters,
  } = useLocationStore();

  const rd = (key: string) => t("rideDetails", key);

  // Sync location stores
  const { data: regionsData } = useRegions();
  const { data: districtsData } = useDistricts();
  const { data: quartersData } = useQuarters();

  useEffect(() => {
    if (regionsData) setRegions(regionsData);
    if (districtsData) setDistricts(districtsData);
    if (quartersData) setQuarters(quartersData);
  }, [regionsData, districtsData, quartersData, setRegions, setDistricts, setQuarters]);

  const { data: meData } = useMe(!!token);
  const user = meData?.user || storedUser;

  // Data fetching
  const { data: publicTrip, isLoading: isPublicLoading } = useTripById(tripId);
  const isDriver = useMemo(() => {
    if (!publicTrip || !user) return false;
    return Number(publicTrip.driver_id) === Number(user.id);
  }, [publicTrip, user]);

  const { data: driverTrip, isLoading: isDriverLoading } = useDriverTripById(
    isDriver ? tripId : null,
  );

  const trip = isDriver ? driverTrip : publicTrip;
  const isLoading = isPublicLoading || (isDriver && isDriverLoading);

  // States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [numSeats, setNumSeats] = useState(1);
  const { mutate: bookTrip, isPending: isBooking } = useBookTrip();
  const { mutate: cancelTrip, isPending: isCanceling } = useCancelTrip();

  // Computations
  const isPast = useMemo(() => {
    if (!trip) return false;
    return new Date(trip.start_time).getTime() < Date.now();
  }, [trip]);

  const canCancel = useMemo(() => {
    if (!trip || !isDriver || isPast) return false;
    const diffInMinutes = (new Date(trip.start_time).getTime() - Date.now()) / (1000 * 60);
    return diffInMinutes > 30;
  }, [trip, isDriver, isPast]);

  const from = useMemo(() => {
    if (!trip) return "";
    const region = typeof trip.start_region === "string" ? trip.start_region : resolveLocationName(trip.start_region, trip.start_region_id || trip.from_region_id, regions, language) || "---";
    const district = typeof trip.start_district === "string" ? trip.start_district : resolveLocationName(trip.start_district, trip.start_district_id || trip.from_district_id, districts, language);
    const quarter = typeof trip.start_quarter === "string" ? trip.start_quarter : resolveLocationName(trip.start_quarter, trip.start_quarter_id || trip.from_quarter_id, quarters, language);
    return [region, district, quarter].filter(Boolean).join(", ");
  }, [trip, regions, districts, quarters, resolveLocationName, language]);

  const to = useMemo(() => {
    if (!trip) return "";
    const region = typeof trip.end_region === "string" ? trip.end_region : resolveLocationName(trip.end_region, trip.end_region_id || trip.to_region_id, regions, language) || "---";
    const district = typeof trip.end_district === "string" ? trip.end_district : resolveLocationName(trip.end_district, trip.end_district_id || trip.to_district_id, districts, language);
    const quarter = typeof trip.end_quarter === "string" ? trip.end_quarter : resolveLocationName(trip.end_quarter, trip.end_quarter_id || trip.to_quarter_id, quarters, language);
    return [region, district, quarter].filter(Boolean).join(", ");
  }, [trip, regions, districts, quarters, resolveLocationName, language]);

  const driverName = trip?.driver
    ? `${trip.driver.name || trip.driver.first_name || ""} ${trip.driver.last_name || ""}`.trim()
    : "Driver";

  const carColor = useMemo(() => {
    if (!trip?.vehicle) return "Classic";
    const color = trip.vehicle.color;
    return typeof color === "object" && color !== null
      ? (color as any)[`title_${language}`] || (color as any).title_uz || (color as any).name
      : color || "Classic";
  }, [trip, language]);

  // Handlers
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this trip?")) {
      cancelTrip(tripId, {
        onSuccess: () => router.push("/dashboard"),
      });
    }
  };

  const handleBook = () => {
    if (!token) {
      toast.error(rd("loginRequired") || "Please login to book a ride");
      router.push(`/auth/login?returnTo=/rides/${tripId}`);
      return;
    }

    if (!trip) return;

    bookTrip(
      { trip_id: trip.id, seats_booked: numSeats },
      {
        onSuccess: () => {
          toast.success(rd("bookingSuccess") || "Ride booked successfully!");
          setIsBookModalOpen(false);
          router.push("/dashboard");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to book ride");
        },
      },
    );
  };

  return {
    trip,
    isLoading,
    isDriver,
    isPast,
    canCancel,
    from,
    to,
    driverName,
    carColor,
    numSeats,
    setNumSeats,
    isBookModalOpen,
    setIsBookModalOpen,
    isBooking,
    isCanceling,
    handleBook,
    handleCancel,
    t,
    rd,
  };
}
