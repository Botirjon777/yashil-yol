import React, { useState, useMemo } from "react";
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
import { useTripById, useDriverTripById, useBookTrip } from "@/src/features/rides/hooks/useRides";
import Loader from "@/src/components/ui/Loader";
import { toast } from "sonner";

// Mock Coordinates for Tashkent and Samarkand (Ideally from trip data)
const MOCK_ORIGIN = { lat: 41.2995, lng: 69.2401 };
const MOCK_DESTINATION = { lat: 39.6547, lng: 66.9758 };

const RideDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { token, user: storedUser } = useAuthStore();
  
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
  const { data: driverTrip, isLoading: isDriverLoading } = useDriverTripById(isDriver ? tripId : null);
  
  const trip = isDriver ? driverTrip : publicTrip;
  const isLoading = isPublicLoading || (isDriver && isDriverLoading);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [numSeats, setNumSeats] = useState(1);
  const { mutate: bookTrip, isPending: isBooking } = useBookTrip();

  React.useEffect(() => {
    if (!token) {
      router.push(`/auth/login?returnTo=/rides/${tripId}`);
    }
  }, [token, tripId, router]);

  if (!token) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg">
        <Loader size="lg" />
        <p className="mt-4 text-gray-500 font-bold animate-pulse">Fetching trip details...</p>
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
          <p className="text-gray-500 font-medium mb-8">This ride may have been cancelled or does not exist.</p>
          <Link href="/rides" className="w-full">
            <Button fullWidth>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    bookTrip({ trip_id: trip.id, seats_booked: numSeats }, {
      onSuccess: () => {
        toast.success("Ride booked successfully!");
        setIsBookModalOpen(false);
        router.push("/dashboard");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to book ride");
      }
    });
  };

  const driverName = trip.driver ? `${trip.driver.first_name} ${trip.driver.last_name}` : "Driver";
  const from = trip.start_region?.name_uz || trip.start_region?.name || "Departure";
  const to = trip.end_region?.name_uz || trip.end_region?.name || "Destination";

  return (
    <div className="bg-light-bg min-h-screen py-8 md:py-12 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href={isDriver ? "/dashboard" : "/rides"}
          className="inline-flex items-center text-gray-500 font-bold hover:text-primary transition-colors mb-8"
        >
          <HiChevronLeft className="mr-1 w-5 h-5" /> {isDriver ? "Back to Dashboard" : "Back to results"}
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
                <div className={cn(
                  "px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-widest",
                  trip.status === "active" ? "bg-success/10 text-success" : 
                  trip.status === "completed" ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
                )}>
                  {trip.status}
                </div>
              </div>

              <div className="relative flex flex-col space-y-8 md:space-y-12 before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-1 before:bg-linear-to-b before:from-primary before:to-secondary/50 before:rounded-full">
                <div className="flex items-start relative z-10">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 mr-6 shrink-0">
                    <HiLocationMarker className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-dark-text leading-tight mb-2">
                      {from}
                    </div>
                    <div className="text-gray-400 font-bold flex items-center">
                      <HiClock className="mr-2 w-4 h-4" /> Departure at{" "}
                      {new Date(trip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start relative z-10">
                  <div className="w-12 h-12 bg-white border-4 border-secondary rounded-2xl flex items-center justify-center text-secondary shadow-lg mr-6 shrink-0">
                    <HiLocationMarker className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-dark-text leading-tight mb-2">
                      {to}
                    </div>
                    <div className="text-gray-400 font-bold">
                      {trip.end_time ? `Estimated arrival: ${new Date(trip.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Arrival time varies"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-2.5 md:space-y-5">
              <h3 className="text-xl font-black text-dark-text flex items-center">
                <HiLocationMarker className="mr-2 text-primary w-6 h-6" /> Route
                Visualization
              </h3>
              <RideMap origin={MOCK_ORIGIN} destination={MOCK_DESTINATION} />
            </div>

            {/* Driver & Car Info */}
            <div className="premium-card p-8 group">
              <h3 className="text-xl font-black text-dark-text mb-8 flex items-center">
                <HiShieldCheck className="mr-2 text-primary w-6 h-6" /> Ride
                Details
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
                        verified driver
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-light-bg rounded-[32px] p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center md:border-r border-border">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Car Model
                  </div>
                  <div className="text-dark-text font-black">
                    {trip.vehicle?.brand} {trip.vehicle?.model || "Standard"}
                  </div>
                </div>
                <div className="text-center md:border-r border-border">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Car Color
                  </div>
                  <div className="text-dark-text font-black">
                    {trip.vehicle?.color || "Classic"}
                  </div>
                </div>
                <div className="text-center md:border-r border-border">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Plate Number
                  </div>
                  <div className="text-dark-text font-black">
                    {trip.vehicle?.plate_number || "---"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Seats
                  </div>
                  <div className="text-dark-text font-black">
                    {trip.available_seats} of {trip.total_seats}
                  </div>
                </div>
              </div>
            </div>

            {/* Passengers Section for Driver */}
            {isDriver && (
              <div className="premium-card p-8">
                <h3 className="text-xl font-black text-dark-text mb-8 flex items-center">
                  <HiUserGroup className="mr-2 text-primary w-6 h-6" /> Passenger List
                </h3>
                {trip.bookings && trip.bookings.length > 0 ? (
                  <div className="space-y-4">
                    {trip.bookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border group hover:border-primary transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-black border border-border">
                            {booking.user?.first_name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <div className="font-black text-dark-text">
                              {booking.user?.first_name} {booking.user?.last_name}
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                              {booking.seats_booked} seats · {booking.status}
                            </div>
                          </div>
                        </div>
                        {booking.user?.phone && (
                          <a href={`tel:${booking.user.phone}`} className="p-3 bg-white text-primary rounded-xl border border-border hover:bg-primary hover:text-white transition-all shadow-xs">
                            <HiPhone className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center bg-light-bg rounded-3xl border border-dashed border-border">
                    <HiUserGroup className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No bookings yet.</p>
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
                  <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Earnings Estim.</div>
                  <div className="text-4xl font-black text-primary">
                    {formatCurrency((trip.total_seats - trip.available_seats) * trip.price_per_seat)}
                  </div>
                </div>
                <div className="pt-6 border-t border-border">
                  <Button fullWidth variant="secondary" onClick={() => router.push("/dashboard")}>
                    Edit Trip Info
                  </Button>
                </div>
                <Button fullWidth variant="outline" className="text-error border-error/20 hover:bg-error/5">
                  Cancel Trip
                </Button>
              </div>
            ) : (
              <div className="premium-card p-8 sticky top-28">
                <div className="mb-8">
                  <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 text-center underline decoration-primary decoration-4 underline-offset-8">
                    Price per seat
                  </div>
                  <div className="text-4xl font-black text-primary text-center">
                    {formatCurrency(trip.price_per_seat)}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border">
                    <span className="text-gray-500 font-bold">Seats</span>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setNumSeats(Math.max(1, numSeats - 1))}
                        className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={numSeats <= 1}
                      >
                        -
                      </button>
                      <span className="font-black text-dark-text min-w-[20px] text-center">{numSeats}</span>
                      <button 
                        onClick={() => setNumSeats(Math.min(trip.available_seats, numSeats + 1))}
                        className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={numSeats >= trip.available_seats}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border">
                    <span className="text-gray-500 font-bold text-sm">Total</span>
                    <span className="text-xl font-black text-dark-text">
                      {formatCurrency(trip.price_per_seat * numSeats)}
                    </span>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  disabled={trip.available_seats === 0}
                  onClick={() => setIsBookModalOpen(true)}
                >
                  {trip.available_seats === 0 ? "Fully Booked" : "Book this Ride"}
                </Button>

                <div className="mt-8 pt-8 border-t border-border space-y-4">
                  <div className="flex items-center text-sm font-bold text-gray-500">
                    <HiCreditCard className="mr-3 text-primary w-5 h-5 shrink-0" /> Pay
                    using internal balance
                  </div>
                  <div className="flex items-center text-sm font-bold text-gray-500">
                    <HiChatAlt2 className="mr-3 text-primary w-5 h-5 shrink-0" /> Chat with
                    {driverName}
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
        title="Confirm Booking"
      >
        <div className="space-y-6">
          <div className="bg-light-bg p-6 rounded-3xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-bold">Route</span>
              <span className="text-dark-text font-black flex items-center">
                {from} <HiArrowRight className="mx-2" /> {to}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-bold">Date</span>
              <span className="text-dark-text font-black">
                {formatDate(trip.start_time)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-bold">Seats</span>
              <span className="text-dark-text font-black">{numSeats}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-gray-500 font-bold text-lg">
                Amount to pay
              </span>
              <span className="text-2xl font-black text-primary">
                {formatCurrency(trip.price_per_seat * numSeats)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-400 text-center font-medium">
            Payment will be deducted from your internal balance.
          </p>

          <Button
            fullWidth
            size="lg"
            loading={isBooking}
            onClick={handleBook}
          >
            Confirm & Pay
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RideDetailsPage;
