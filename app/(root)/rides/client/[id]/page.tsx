"use client";

import React from "react";
import { useParams } from "next/navigation";
import { HiChevronLeft, HiShieldCheck, HiOutlineUserGroup, HiOutlineTicket } from "react-icons/hi";
import Link from "next/link";
import { useRideDetails } from "@/src/features/rides/hooks/useRideDetails";
import {
  RideRouteCard,
  RideInfoCard,
  PassengerListCard,
} from "@/src/features/rides/components";
import Loader from "@/src/components/ui/Loader";
import Button from "@/src/components/ui/Button";
import { formatCurrency } from "@/src/lib/utils";

const ClientRideDetailsPage = () => {
  const params = useParams();
  const bookingId = params.id as string;
  
  const {
    trip,
    isLoading,
    isPast,
    canCancel,
    from,
    to,
    driverName,
    carColor,
    bookingStatus,
    bookingPassengers,
    totalPrice,
    isCanceling,
    handleCancel,
    rd,
  } = useRideDetails(bookingId, "passenger");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg">
        <Loader size="lg" />
        <p className="mt-4 text-gray-500 font-bold animate-pulse">
          Fetching your booking details...
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
          <h1 className="text-2xl font-black mb-2">Booking Not Found</h1>
          <p className="text-gray-500 font-medium mb-8">
            This booking may have been cancelled or does not exist.
          </p>
          <Link href="/dashboard" className="w-full">
            <Button fullWidth>Back to Dashboard</Button>
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
          href="/dashboard"
          className="inline-flex items-center text-gray-500 font-bold hover:text-primary transition-colors mb-8"
        >
          <HiChevronLeft className="mr-1 w-5 h-5" />{" "}
          {rd("backToDashboard")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-5 md:space-y-8">
            {/* My Booking Status Banner */}
            <div className="premium-card p-6 bg-linear-to-r from-primary/5 to-secondary/5 border-primary/20 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-soft">
                  <HiOutlineTicket className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Booking Status
                  </div>
                  <div className="text-lg font-black text-dark-text uppercase tracking-wider">
                    {bookingStatus || "Confirmed"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Total Paid
                </div>
                <div className="text-lg font-black text-primary">
                  {totalPrice ? formatCurrency(Number(totalPrice)) : "---"}
                </div>
              </div>
            </div>

            {/* Route Card */}
            <RideRouteCard trip={trip} from={from} to={to} rd={rd} />

            {/* Driver & Car Info */}
            <RideInfoCard 
              trip={trip} 
              isDriver={false} 
              driverName={driverName} 
              carColor={carColor} 
              rd={rd} 
              showDriverInfo={true}
            />


          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1">
            <div className="premium-card p-6 lg:p-8 space-y-6 sticky top-24">
              <h3 className="font-black text-dark-text text-lg uppercase tracking-tight">Booking Actions</h3>
              
              {canCancel ? (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl text-xs font-bold border border-amber-100 leading-relaxed">
                    You can cancel this booking. Your balance will be credited back to your account immediately.
                  </div>
                  <Button
                    variant="danger"
                    fullWidth
                    size="lg"
                    loading={isCanceling}
                    onClick={handleCancel}
                  >
                    Cancel Booking
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl text-xs font-bold border border-gray-100 leading-relaxed italic">
                  {isPast ? "This trip has already departed." : "Cancellation is no longer available for this ride."}
                </div>
              )}

              <div className="pt-6 border-t border-border">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Support</p>
                <p className="text-xs text-gray-500">
                  Having issues with your ride? Contact our support team for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRideDetailsPage;
