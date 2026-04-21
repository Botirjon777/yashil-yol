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
  useClientBookingById,
  useBookTrip,
  useCancelTrip,
  useCancelClientBooking,
  useAddPassenger,
  useRemovePassenger,
  handleError,
} from "@/src/features/rides/hooks/useRides";
import { useCarColors } from "@/src/features/rides/hooks/useVehicles";

export function useRideDetails(id: string, mode?: "driver" | "public" | "passenger") {
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
  const { data: publicTrip, isLoading: isPublicLoading } = useTripById(
    mode === "public" ? id : null
  );
  
  const isDriverFromPublic = useMemo(() => {
    if (!publicTrip || !user) return false;
    return Number(publicTrip.driver_id) === Number(user.id);
  }, [publicTrip, user]);

  // If explicit mode is driver, or we're guessing it's a driver
  const isDriver = mode === "driver" || (mode === "public" && isDriverFromPublic);

  const { data: driverTrip, isLoading: isDriverLoading } = useDriverTripById(
    isDriver ? id : null,
  );

  const { data: bookingData, isLoading: isBookingLoading, error: bookingError } = useClientBookingById(
    mode === "passenger" ? id : null
  );

  // Find my specific booking in the bookings array if bookingData is a trip
  const myBooking = useMemo(() => {
    if (mode !== "passenger" || !bookingData) return null;
    
    // Case 1: bookingData has a 'ride' prop which IS the booking (common in some endpoints)
    const ride = (bookingData as any).ride;
    if (ride && (String(ride.id) === String(id) || String(ride.bookingId) === String(id))) {
      return ride;
    }

    // Case 2: bookingData is already the correct Booking object
    if (String(bookingData.id) === String(id) && (bookingData.passengers || bookingData.total_price)) {
      return bookingData;
    }

    // Case 3: bookingData is the Trip object, find the booking inside it
    // We look for a booking that matches the ID OR belongs to the current user
    const bookings = (bookingData as any).bookings || ride?.bookings;
    if (Array.isArray(bookings)) {
      // First try matching by ID
      let found = bookings.find((b: any) => String(b.id) === String(id));
      
      // If not found by ID, maybe 'id' from URL was the Trip ID. 
      // Try finding a booking owned by current user.
      if (!found && user) {
        found = bookings.find((b: any) => 
          Number(b.user_id || b.booked_by_user?.id) === Number(user.id)
        );
      }
      
      // Fallback to first booking if still not found and we're in passenger mode
      if (!found && bookings.length > 0) {
        found = bookings[0];
      }
      
      return found;
    }

    return null;
  }, [bookingData, id, mode, user]);

  const trip = useMemo(() => {
    if (!bookingData) return isDriver ? driverTrip : publicTrip;
    if (mode !== "passenger") return isDriver ? driverTrip : publicTrip;

    // In passenger mode, bookingData is often the Trip or has a 'ride'/trip prop
    return (
      bookingData.trip || 
      (bookingData as any).ride?.trip || 
      (bookingData as any).ride || 
      ((bookingData as any).start_time ? bookingData : null) ||
      myBooking?.trip ||
      myBooking
    );
  }, [bookingData, mode, isDriver, driverTrip, publicTrip, myBooking]);

  const isLoading = isPublicLoading || (isDriver && isDriverLoading) || (mode === "passenger" && isBookingLoading);

  useEffect(() => {
    if (mode === "passenger") {
      console.log("useRideDetails [passenger] debug:", {
        id,
        rawBookingData: bookingData,
        bookingIdFromData: bookingData?.id || (bookingData as any)?.ride?.id,
        isBookingLoading,
        tripExists: !!trip,
        hasBookingsArray: Array.isArray((bookingData as any)?.bookings),
        bookingsCount: (bookingData as any)?.bookings?.length,
        myBookingFound: !!myBooking,
        myBookingId: myBooking?.id || myBooking?.bookingId,
        myBookingStatusField: myBooking?.booking_status || myBooking?.bookingStatus,
        myStatusField: myBooking?.status,
        finalBookingStatus: myBooking?.booking_status || myBooking?.bookingStatus || myBooking?.status || (mode === "passenger" ? undefined : trip?.status),
        canCancel: !!canCancel
      });
    }
  }, [id, mode, bookingData, isBookingLoading, trip, myBooking]);


  const { mutate: bookTrip, isPending: isBooking } = useBookTrip();
  const { mutate: cancelTrip, isPending: isCanceling } = useCancelTrip();
  const { mutate: cancelBooking, isPending: isCancelingBooking } = useCancelClientBooking();
  const { mutate: addPassenger, isPending: isAddingPassenger } = useAddPassenger();
  const { mutate: removePassenger, isPending: isRemovingPassenger } = useRemovePassenger();

  // States
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isAddPassengerModalOpen, setIsAddPassengerModalOpen] = useState(false);
  const [numSeats, setNumSeats] = useState(1);
  const [passengers, setPassengers] = useState<{ name: string; phone: string }[]>([]);

  // Sync passengers array with numSeats
  useEffect(() => {
    setPassengers((prev) => {
      const next = [...prev];
      if (next.length < numSeats) {
        for (let i = next.length; i < numSeats; i++) {
          // Prefill first passenger with user info if available
          if (i === 0 && user) {
            next.push({ 
              name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "", 
              phone: user.phone || "" 
            });
          } else {
            next.push({ name: "", phone: "" });
          }
        }
      } else if (next.length > numSeats) {
        return next.slice(0, numSeats);
      }
      return next;
    });
  }, [numSeats, user]);

  const updatePassenger = (index: number, field: "name" | "phone", value: string) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Computations
  const isPast = useMemo(() => {
    if (!trip) return false;
    return new Date(trip.start_time).getTime() < Date.now();
  }, [trip]);

  const canCancel = useMemo(() => {
    if (!trip || isPast) return false;
    
    // For passengers, checking booking status is important
    if (mode === "passenger") {
      const st = (myBooking?.booking_status || myBooking?.bookingStatus || myBooking?.status || "").toLowerCase();
      // Allow cancellation if confirmed, pending, active, or any other non-cancelled status if the trip is active
      return st !== "" && st !== "canceled" && st !== "cancelled" && st !== "completed";
    }

    if (!isDriver) return false;
    
    const diffInMinutes = (new Date(trip.start_time).getTime() - Date.now()) / (1000 * 60);
    return diffInMinutes > 240; // Example: 4 hours
  }, [trip, isDriver, isPast, mode, myBooking]);

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

  const { data: allColors } = useCarColors();

  const carColor = useMemo(() => {
    if (!trip?.vehicle) return "Classic";
    const color = trip.vehicle.color;
    
    // If it's just { id: 5 }
    if (color && typeof color === "object" && color.id && !((color as any).title_uz || (color as any).name)) {
      const found = allColors?.find(c => String(c.id) === String(color.id));
      if (found) {
        return found[`title_${language}` as keyof typeof found] || found.title_uz || found.name || "Classic";
      }
    }

    return typeof color === "object" && color !== null
      ? (color as any)[`title_${language}`] || (color as any).title_uz || (color as any).name
      : color || "Classic";
  }, [trip, language, allColors]);

  // Handlers
  const handleCancel = () => {
    const message = mode === "passenger" 
      ? "Are you sure you want to cancel your booking? Your balance will be returned."
      : "Are you sure you want to cancel this trip?";

    if (window.confirm(message)) {
      if (mode === "passenger") {
        const targetId = myBooking?.id || id;
        cancelBooking(targetId, {
          onSuccess: () => {
            toast.success("Booking cancelled successfully");
            router.push("/dashboard");
          },
          onError: (err: any) => toast.error(handleError(err)),
        });
      } else {
        cancelTrip(id, {
          onSuccess: () => {
            toast.success("Trip cancelled successfully");
            router.push("/dashboard");
          },
          onError: (err: any) => toast.error(handleError(err)),
        });
      }
    }
  };

  const handleBook = (paymentMethod: string = "balance") => {
    if (!token) {
      toast.error(rd("loginRequired") || "Please login to book a ride");
      router.push(`/auth/login?returnTo=/rides/${id}`);
      return;
    }

    if (isDriver) {
      toast.error("Drivers cannot book their own rides");
      return;
    }

    if (!trip) return;

    // Validate passengers
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim() || !passengers[i].phone.trim()) {
        toast.error(`Please provide name and phone for passenger ${i + 1}`);
        return;
      }
    }

    bookTrip(
      { trip_id: trip.id, passengers, payment_method: paymentMethod },
      {
        onSuccess: () => {
          toast.success(rd("bookingSuccess") || "Ride booked successfully!");
          setIsBookModalOpen(false);
          router.push("/dashboard");
        },
        onError: (err: any) => {
          toast.error(handleError(err));
        },
      },
    );
  };

  const handleAddPassengerToBooking = (data: { name: string; phone: string }) => {
    if (!token || mode !== "passenger") return;
    
    const targetId = myBooking?.id || id;
    
    addPassenger(
      { bookingId: targetId, data },
      {
        onSuccess: () => {
          setIsAddPassengerModalOpen(false);
          toast.success("Passenger added successfully");
        },
        onError: (err: any) => toast.error(handleError(err))
      }
    );
  };

  const handleRemovePassengerFromBooking = (passengerId: string | number) => {
    if (!token || mode !== "passenger") return;

    const targetId = myBooking?.id || id;

    if (window.confirm("Are you sure you want to remove this passenger?")) {
      removePassenger(
        { bookingId: targetId, passengerId },
        {
          onSuccess: () => {
            toast.success("Passenger removed successfully");
          },
          onError: (err: any) => toast.error(handleError(err))
        }
      );
    }
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
    passengers,
    updatePassenger,
    isBookModalOpen,
    setIsBookModalOpen,
    isBooking,
    isCanceling: isCanceling || isCancelingBooking,
    isAddingPassenger,
    isRemovingPassenger,
    isAddPassengerModalOpen,
    setIsAddPassengerModalOpen,
    bookingStatus: myBooking?.booking_status || myBooking?.bookingStatus || myBooking?.status || (mode === "passenger" ? undefined : trip?.status),
    bookingPassengers: myBooking?.passengers || [],
    totalPrice: myBooking?.total_price || (trip?.price_per_seat ? Number(trip.price_per_seat) * (myBooking?.passengers?.length || 1) : null),
    bookingId: id,
    handleBook,
    handleCancel,
    handleAddPassenger: handleAddPassengerToBooking,
    handleRemovePassenger: handleRemovePassengerFromBooking,
    t,
    rd,
  };
}
