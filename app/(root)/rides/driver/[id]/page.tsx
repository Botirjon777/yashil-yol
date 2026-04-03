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

const DriverRideDetailsPage = () => {
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
    isBookModalOpen,
    setIsBookModalOpen,
    isBooking,
    isCanceling,
    handleBook,
    handleCancel,
    rd,
  } = useRideDetails(tripId, "driver");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg">
        <Loader size="lg" />
        <p className="mt-4 text-gray-500 font-bold animate-pulse">
          Fetching your trip details...
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
            This trip could not be found in your records.
          </p>
          <Link href="/dashboard" className="w-full">
            <Button fullWidth>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log("DriverRideDetailsPage - Trip Data:", trip);

  return (
    <div className="bg-light-bg min-h-screen py-8 md:py-12 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-500 font-bold hover:text-primary transition-colors mb-8"
        >
          <HiChevronLeft className="mr-1 w-5 h-5" />{" "}
          {rd("backToDashboard")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-5 md:space-y-8">
            {/* Route Card */}
            <RideRouteCard trip={trip} from={from} to={to} rd={rd} />

            {/* Driver & Car Info */}
            <RideInfoCard 
              trip={trip} 
              isDriver={isDriver} 
              driverName={driverName} 
              carColor={carColor} 
              rd={rd} 
            />

            {/* Passengers Section */}
            {trip.bookings && trip.bookings.length > 0 && (
              <PassengerListCard trip={trip} rd={rd} isDriver={isDriver} />
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRideDetailsPage;
