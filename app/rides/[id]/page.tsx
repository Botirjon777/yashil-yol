"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  HiLocationMarker,
  HiClock,
  HiStar,
  HiShieldCheck,
  HiCreditCard,
  HiChatAlt2,
  HiChevronLeft,
  HiArrowRight,
  HiUserGroup,
  HiPhone,
} from "react-icons/hi";
import { formatCurrency, formatDate, cn } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import Modal from "@/src/components/ui/Modal";
import RideMap from "@/src/features/maps/components/RideMap";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useMe } from "@/src/features/auth/hooks/useAuth";
import {
  useTripById,
  useDriverTripById,
  useBookTrip,
  useCancelTrip,
} from "@/src/features/rides/hooks/useRides";
import Loader from "@/src/components/ui/Loader";
import { toast } from "sonner";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useLocationStore } from "@/src/providers/LocationStore";
import {
  useRegions,
  useDistricts,
  useQuarters,
} from "@/src/features/location/hooks/useLocation";

// Mock Coordinates for Tashkent and Samarkand (Ideally from trip data)
const MOCK_ORIGIN = { lat: 41.2995, lng: 69.2401 };
const MOCK_DESTINATION = { lat: 39.6547, lng: 66.9758 };

const RideDetailsPage = () => {
  const params = useParams();
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

  // Also fetch data here to ensure the store is populated if the user lands directly on this page
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

  const rd = (key: string) => t("rideDetails", key);

  const { data: meData } = useMe(!!token);
  const user = meData?.user || storedUser;

  const tripId = params.id as string;

  // First fetch public data to determine if user is the driver
  const { data: publicTrip, isLoading: isPublicLoading } = useTripById(tripId);

  const isDriver = useMemo(() => {
    if (!publicTrip || !user) return false;
    return Number(publicTrip.driver_id) === Number(user.id);
  }, [publicTrip, user]);

  // If driver, fetch full details (including passenger info)
  const { data: driverTrip, isLoading: isDriverLoading } = useDriverTripById(
    isDriver ? tripId : null,
  );

  const trip = isDriver ? driverTrip : publicTrip;
  const isLoading = isPublicLoading || (isDriver && isDriverLoading);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [numSeats, setNumSeats] = useState(1);
  const { mutate: bookTrip, isPending: isBooking } = useBookTrip();
  const { mutate: cancelTrip, isPending: isCanceling } = useCancelTrip();

  const isPast = useMemo(() => {
    if (!trip) return false;
    return new Date(trip.start_time).getTime() < Date.now();
  }, [trip]);

  const canCancel = useMemo(() => {
    if (!trip || !isDriver || isPast) return false;
    const diffInMinutes = (new Date(trip.start_time).getTime() - Date.now()) / (1000 * 60);
    return diffInMinutes > 30;
  }, [trip, isDriver, isPast]);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this trip?")) {
      cancelTrip(tripId, {
        onSuccess: () => {
          router.push("/dashboard");
        }
      });
    }
  };

  // Remove mandatory redirect on load - allow guests to see the ride
  // React.useEffect(() => {
  //   if (!token) {
  //     router.push(`/auth/login?returnTo=/rides/${tripId}`);
  //   }
  // }, [token, tripId, router]);

  // if (!token) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg">
        <Loader size="lg" />
        <p className="mt-4 text-gray-500 font-bold animate-pulse">
          Fetching trip details...
        </p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg p-4">
        <div className="premium-card p-10 text-center max-w-md">
          <div className="w-20 h-20 bg-error/10 text-error rounded-3xl flex items-center justify-center mx-auto mb-6">
            <HiShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black mb-2">Trip Not Found</h1>
          <p className="text-gray-500 font-medium mb-8">
            This ride may have been cancelled or does not exist.
          </p>
          <Link href="/rides" className="w-full">
            <Button fullWidth>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    if (!token) {
      toast.error(rd("loginRequired") || "Please login to book a ride");
      router.push(`/auth/login?returnTo=/rides/${tripId}`);
      return;
    }

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

  const fromRegion =
    typeof trip.start_region === "string"
      ? trip.start_region
      : resolveLocationName(
          trip.start_region,
          trip.start_region_id || trip.from_region_id,
          regions,
          language,
        ) || "---";

  const fromDistrict = 
    typeof trip.start_district === "string"
      ? trip.start_district
      : resolveLocationName(
          trip.start_district,
          trip.start_district_id || trip.from_district_id,
          districts,
          language,
        );

  const fromQuarter = 
    typeof trip.start_quarter === "string"
      ? trip.start_quarter
      : resolveLocationName(
          trip.start_quarter,
          trip.start_quarter_id || trip.from_quarter_id,
          quarters,
          language,
        );

  const toRegion =
    typeof trip.end_region === "string"
      ? trip.end_region
      : resolveLocationName(
          trip.end_region,
          trip.end_region_id || trip.to_region_id,
          regions,
          language,
        ) || "---";

  const toDistrict = 
    typeof trip.end_district === "string"
      ? trip.end_district
      : resolveLocationName(
          trip.end_district,
          trip.end_district_id || trip.to_district_id,
          districts,
          language,
        );

  const toQuarter = 
    typeof trip.end_quarter === "string"
      ? trip.end_quarter
      : resolveLocationName(
          trip.end_quarter,
          trip.end_quarter_id || trip.to_quarter_id,
          quarters,
          language,
        );

  const from = [fromRegion, fromDistrict, fromQuarter]
    .filter(Boolean)
    .join(", ");
  const to = [toRegion, toDistrict, toQuarter].filter(Boolean).join(", ");

  const driverName = trip.driver
    ? `${trip.driver.name || trip.driver.first_name || ""} ${trip.driver.last_name || ""}`.trim()
    : "Driver";

  // Properly access localized color title if it's an object
  const carColor =
    typeof trip.vehicle?.color === "object" && trip.vehicle.color !== null
      ? (trip.vehicle.color as any)[`title_${language}`] ||
        (trip.vehicle.color as any).title_uz ||
        (trip.vehicle.color as any).name
      : trip.vehicle?.color || "Classic";

  return (
    <div className="bg-light-bg min-h-screen py-8 md:py-12 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href={isDriver ? "/dashboard" : "/rides"}
          className="inline-flex items-center text-gray-500 font-bold hover:text-primary transition-colors mb-8"
        >
          <HiChevronLeft className="mr-1 w-5 h-5" />{" "}
          {isDriver ? rd("backToDashboard") : rd("backToResults")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-5 md:space-y-8">
            {/* Route Card */}
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
                      {new Date(trip.start_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start relative z-10">
                  <div className="w-12 h-12 bg-white border-4 border-secondary rounded-2xl flex items-center justify-center text-secondary shadow-lg mr-6 shrink-0">
                    <HiLocationMarker className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-2xl md:text-3xl font-black text-dark-text leading-tight mb-2 wrap-break-word">
                      {to}
                    </div>
                    <div className="text-gray-400 font-bold text-sm md:text-base">
                      {trip.end_time
                        ? `${rd("estimatedArrival")}: ${new Date(trip.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : rd("arrivalVaries")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-2.5 md:space-y-5">
              <h3 className="text-xl font-black text-dark-text flex items-center">
                <HiLocationMarker className="mr-2 text-primary w-6 h-6" />{" "}
                {rd("routeVisualization")}
              </h3>
              <RideMap origin={MOCK_ORIGIN} destination={MOCK_DESTINATION} />
            </div>

            {/* Driver & Car Info */}
            <div className="premium-card p-8 group">
              <h3 className="text-xl font-black text-dark-text mb-8 flex items-center">
                <HiShieldCheck className="mr-2 text-primary w-6 h-6" />{" "}
                {rd("rideInfo")}
              </h3>

              {!isDriver && (
                <div className="flex items-center mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black mr-6 border-4 border-white shadow-xl">
                    {driverName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-2xl font-black text-dark-text mb-1">
                      {driverName}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm font-black text-accent">
                        <HiStar className="mr-1 w-4 h-4" />{" "}
                        {trip.driver?.rating || "4.8"}
                      </div>
                      <div className="text-gray-300">|</div>
                      <div className="text-sm font-bold text-gray-400">
                        {rd("verifiedDriver")}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-light-bg rounded-[32px] p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center md:border-r border-border">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    {rd("carModel")}
                  </div>
                  <div className="text-dark-text font-black">
                    {trip.vehicle?.brand} {trip.vehicle?.model || "Standard"}
                  </div>
                </div>
                <div className="text-center md:border-r border-border">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    {rd("carColor")}
                  </div>
                  <div className="text-dark-text font-black">{carColor}</div>
                </div>
                <div className="text-center md:border-r border-border">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    {rd("plateNumber")}
                  </div>
                  <div className="text-dark-text font-black">
                    {trip.vehicle?.plate_number ||
                      trip.vehicle?.car_number ||
                      "---"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    {rd("seats")}
                  </div>
                  <div className="text-dark-text font-black">
                    {trip.available_seats} {rd("of")} {trip.total_seats}
                  </div>
                </div>
              </div>
            </div>

            {/* Passengers Section for Driver */}
            {isDriver && (
              <div className="premium-card p-8">
                <h3 className="text-xl font-black text-dark-text mb-8 flex items-center">
                  <HiUserGroup className="mr-2 text-primary w-6 h-6" />{" "}
                  {rd("passengerList")}
                </h3>
                {trip.bookings && trip.bookings.length > 0 ? (
                  <div className="space-y-4">
                    {trip.bookings.map((booking: any) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border group hover:border-primary transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-black border border-border">
                            {booking.user?.first_name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <div className="font-black text-dark-text">
                              {booking.user?.name || booking.user?.first_name || ""}{" "}
                              {booking.user?.last_name || ""}
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                              {booking.seats_booked} {rd("seats")} ·{" "}
                              {booking.status}
                            </div>
                          </div>
                        </div>
                        {booking.user?.phone && (
                          <a
                            href={`tel:${booking.user.phone}`}
                            className="p-3 bg-white text-primary rounded-xl border border-border hover:bg-primary hover:text-white transition-all shadow-xs"
                          >
                            <HiPhone className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center bg-light-bg rounded-3xl border border-dashed border-border">
                    <HiUserGroup className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">
                      {rd("noBookings")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
            {isDriver ? (
              <div className="premium-card p-8 sticky top-28 space-y-6">
                <div className="text-center">
                  <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">
                    {rd("earningsEstim")}
                  </div>
                  <div className="text-4xl font-black text-primary">
                    {formatCurrency(
                      (trip.total_seats - Number(trip.available_seats)) *
                        Number(trip.price_per_seat),
                    )}
                  </div>
                </div>
                <div className="pt-6 border-t border-border">
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => router.push("/dashboard")}
                  >
                    {rd("editTrip")}
                  </Button>
                </div>
                {canCancel && (
                  <Button
                    fullWidth
                    variant="outline"
                    className="text-error border-error/20 hover:bg-error/5"
                    onClick={handleCancel}
                    loading={isCanceling}
                  >
                    {rd("cancelTrip")}
                  </Button>
                )}
                {!canCancel && isDriver && !isPast && String(trip.status) === "active" && (
                   <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest px-4">
                     Cannot cancel trip less than 30 mins before departure
                   </p>
                )}
              </div>
            ) : (
              <div className="premium-card p-8 sticky top-28">
                <div className="mb-8">
                  <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 text-center underline decoration-primary decoration-4 underline-offset-8">
                    {rd("pricePerSeat")}
                  </div>
                  <div className="text-4xl font-black text-primary text-center">
                    {formatCurrency(Number(trip.price_per_seat))}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border">
                    <span className="text-gray-500 font-bold">
                      {rd("seats")}
                    </span>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setNumSeats(Math.max(1, numSeats - 1))}
                        className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={numSeats <= 1}
                      >
                        -
                      </button>
                      <span className="font-black text-dark-text min-w-[20px] text-center">
                        {numSeats}
                      </span>
                      <button
                        onClick={() =>
                          setNumSeats(
                            Math.min(
                              Number(trip.available_seats),
                              numSeats + 1,
                            ),
                          )
                        }
                        className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={numSeats >= Number(trip.available_seats)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border">
                    <span className="text-gray-500 font-bold text-sm">
                      {rd("total")}
                    </span>
                    <span className="text-xl font-black text-dark-text">
                      {formatCurrency(Number(trip.price_per_seat) * numSeats)}
                    </span>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  disabled={Number(trip.available_seats) === 0 || isPast}
                  onClick={() => setIsBookModalOpen(true)}
                >
                  {isPast 
                    ? (rd("pastTrip") || "Past Trip") 
                    : Number(trip.available_seats) === 0
                      ? rd("fullyBooked")
                      : rd("bookRide")}
                </Button>

                <div className="mt-8 pt-8 border-t border-border space-y-4">
                  <div className="flex items-center text-sm font-bold text-gray-500">
                    <HiCreditCard className="mr-3 text-primary w-5 h-5 shrink-0" />{" "}
                    {rd("payBalance")}
                  </div>
                  <div className="flex items-center text-sm font-bold text-gray-500">
                    <HiChatAlt2 className="mr-3 text-primary w-5 h-5 shrink-0" />{" "}
                    {rd("chatWith")} {driverName}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title={rd("confirmBooking")}
      >
        <div className="space-y-6">
          <div className="bg-light-bg p-6 rounded-3xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-bold">{rd("route")}</span>
              <span className="text-dark-text font-black flex items-center">
                {from} <HiArrowRight className="mx-2" /> {to}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-bold">{rd("date")}</span>
              <span className="text-dark-text font-black">
                {formatDate(trip.start_time)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-bold">{rd("seats")}</span>
              <span className="text-dark-text font-black">{numSeats}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-gray-500 font-bold text-lg">
                {rd("amountToPay")}
              </span>
              <span className="text-2xl font-black text-primary">
                {formatCurrency(Number(trip.price_per_seat) * numSeats)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400 text-center font-medium">
            {rd("payBalance")}.
          </p>

          <Button fullWidth size="lg" loading={isBooking} onClick={handleBook}>
            {rd("confirmBooking")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RideDetailsPage;
