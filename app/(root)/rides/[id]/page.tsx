"use client";

import React from "react";
import { useParams } from "next/navigation";
import { HiChevronLeft, HiShieldCheck } from "react-icons/hi";
import Link from "next/link";
import { useRideDetails } from "@/src/features/rides/hooks/useRideDetails";
import {
  RideRouteCard,
  RideInfoCard,
  PassengerListCard,
  BookingSidebar,
  BookingModal,
} from "@/src/features/rides/components";
import Loader from "@/src/components/ui/Loader";
import Button from "@/src/components/ui/Button";

const RideDetailsPage = () => {
  const params = useParams();
  const tripId = params.id as string;
  
  const {
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
    sameLocation,
    setSameLocation,
    isBookModalOpen,
    setIsBookModalOpen,
    isBooking,
    isCanceling,
    handleBook,
    handleCancel,
    rd,
  } = useRideDetails(tripId, "public");

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
            <RideRouteCard trip={trip} from={from} to={to} rd={rd} isDriver={isDriver} />

            {/* Driver & Car Info */}
            <RideInfoCard 
              trip={trip} 
              isDriver={isDriver} 
              driverName={driverName} 
              carColor={carColor} 
              rd={rd} 
              showDriverInfo={isDriver}
            />

            {/* Passengers Section - Visible to all participants */}
            {trip.bookings && trip.bookings.length > 0 && (
              <PassengerListCard 
                trip={trip} 
                rd={rd} 
                isDriver={isDriver} 
                isPublic={!isDriver}
              />
            )}
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
            <BookingSidebar 
              trip={trip}
              isDriver={isDriver}
              isPast={isPast}
              canCancel={canCancel}
              numSeats={numSeats}
              setNumSeats={setNumSeats}
              handleCancel={handleCancel}
              setIsBookModalOpen={setIsBookModalOpen}
              isCanceling={isCanceling}
              driverName={driverName}
              rd={rd}
              showDriverInfo={isDriver}
            />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        trip={trip}
        from={from}
        to={to}
        numSeats={numSeats}
        passengers={passengers}
        updatePassenger={updatePassenger}
        sameLocation={sameLocation}
        setSameLocation={setSameLocation}
        isBooking={isBooking}
        handleBook={handleBook}
        rd={rd}
      />
    </div>
  );
};

export default RideDetailsPage;
