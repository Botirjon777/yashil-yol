"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  HiLocationMarker,
  HiClock,
  HiStar,
  HiShieldCheck,
  HiCreditCard,
  HiChatAlt2,
  HiChevronLeft,
  HiArrowRight,
} from "react-icons/hi";
import { formatCurrency, formatDate } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import Modal from "@/src/components/ui/Modal";
import RideMap from "@/src/features/maps/components/RideMap";

// Mock Coordinates for Tashkent and Samarkand
const MOCK_ORIGIN = { lat: 41.2995, lng: 69.2401 };
const MOCK_DESTINATION = { lat: 39.6547, lng: 66.9758 };

// Mock Data (In reality would come from an API based on params.id)
const MOCK_RIDE = {
  id: "1",
  driver: {
    name: "Abbos G.",
    rating: 4.8,
    reviewCount: 124,
    avatar: null,
    joinDate: "May 2024",
    bio: "I travel every weekend to Samarkand. I like clean car and friendly passengers.",
  },
  from: "Tashkent",
  to: "Samarkand",
  date: "2026-03-20",
  departureTime: "08:30",
  price: 65000,
  availableSeats: 3,
  totalSeats: 4,
  carModel: "Chevrolet Gentra",
  carColor: "Black",
  carNumber: "01 | A 777 BA",
};

const RideDetailsPage = () => {
  const params = useParams();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBook = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="bg-light-bg min-h-screen py-8 md:py-12 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/rides"
          className="inline-flex items-center text-gray-500 font-bold hover:text-primary transition-colors mb-8"
        >
          <HiChevronLeft className="mr-1 w-5 h-5" /> Back to results
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-5 md:space-y-8">
            {/* Route Card */}
            <div className="premium-card p-8 md:p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="text-sm font-black text-gray-400 uppercase tracking-widest">
                  {formatDate(MOCK_RIDE.date)}
                </div>
                <div className="px-4 py-1.5 bg-success/10 text-success text-xs font-black rounded-full uppercase tracking-widest">
                  Available
                </div>
              </div>

              <div className="relative flex flex-col space-y-8 md:space-y-12 before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-1 before:bg-linear-to-b before:from-primary before:to-secondary/50 before:rounded-full">
                <div className="flex items-start relative z-10">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 mr-6 shrink-0">
                    <HiLocationMarker className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-dark-text leading-none mb-2">
                      {MOCK_RIDE.from}
                    </div>
                    <div className="text-gray-400 font-bold flex items-center">
                      <HiClock className="mr-2 w-4 h-4" /> Departure at{" "}
                      {MOCK_RIDE.departureTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-start relative z-10">
                  <div className="w-12 h-12 bg-white border-4 border-secondary rounded-2xl flex items-center justify-center text-secondary shadow-lg mr-6 shrink-0">
                    <HiLocationMarker className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-dark-text leading-none mb-2">
                      {MOCK_RIDE.to}
                    </div>
                    <div className="text-gray-400 font-bold">
                      Arrival estimated in 4 hours
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
                Verification
              </h3>

              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black mr-6 border-4 border-white shadow-xl">
                  {MOCK_RIDE.driver.name.charAt(0)}
                </div>
                <div>
                  <div className="text-2xl font-black text-dark-text mb-1">
                    {MOCK_RIDE.driver.name}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm font-black text-accent">
                      <HiStar className="mr-1 w-4 h-4" />{" "}
                      {MOCK_RIDE.driver.rating}
                    </div>
                    <div className="text-gray-300">|</div>
                    <div className="text-sm font-bold text-gray-400">
                      {MOCK_RIDE.driver.reviewCount} reviews
                    </div>
                    <div className="text-gray-300">|</div>
                    <div className="text-sm font-bold text-gray-400">
                      Since {MOCK_RIDE.driver.joinDate}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-light-bg rounded-[32px] p-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center border-r border-border">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Car Model
                  </div>
                  <div className="text-dark-text font-black">
                    {MOCK_RIDE.carModel}
                  </div>
                </div>
                <div className="text-center border-r border-border">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Car Color
                  </div>
                  <div className="text-dark-text font-black">
                    {MOCK_RIDE.carColor}
                  </div>
                </div>
                <div className="text-center border-r border-border">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Number
                  </div>
                  <div className="text-dark-text font-black">
                    {MOCK_RIDE.carNumber}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Seats
                  </div>
                  <div className="text-dark-text font-black">
                    {MOCK_RIDE.availableSeats} of {MOCK_RIDE.totalSeats}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="premium-card p-8">
              <h3 className="text-xl font-black text-dark-text mb-6">
                About this trip
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed italic">
                &ldquo;{MOCK_RIDE.driver.bio}&rdquo;
              </p>
            </div>
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
            <div className="premium-card p-8 sticky top-28">
              <div className="mb-8">
                <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 text-center underline decoration-primary decoration-4 underline-offset-8">
                  Price per seat
                </div>
                <div className="text-4xl font-black text-primary text-center">
                  {formatCurrency(MOCK_RIDE.price)}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border">
                  <span className="text-gray-500 font-bold">Seats</span>
                  <div className="flex items-center space-x-4">
                    <button
                      className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center font-bold text-primary disabled:opacity-50"
                      disabled
                    >
                      -
                    </button>
                    <span className="font-black text-dark-text">1</span>
                    <button className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center font-bold text-primary">
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-light-bg rounded-2xl border border-border">
                  <span className="text-gray-500 font-bold text-sm">Total</span>
                  <span className="text-xl font-black text-dark-text">
                    {formatCurrency(MOCK_RIDE.price)}
                  </span>
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={() => setIsBookModalOpen(true)}
              >
                Book this Ride
              </Button>

              <div className="mt-8 pt-8 border-t border-border space-y-2.5 md:space-y-5">
                <div className="flex items-center text-sm font-bold text-gray-500">
                  <HiCreditCard className="mr-3 text-primary w-5 h-5" /> Pay
                  using internal balance
                </div>
                <div className="flex items-center text-sm font-bold text-gray-500">
                  <HiChatAlt2 className="mr-3 text-primary w-5 h-5" /> Chat with
                  Abbos G.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setIsSuccess(false);
        }}
        title={isSuccess ? "Booking Confirmed!" : "Confirm Booking"}
      >
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <HiShieldCheck className="w-12 h-12" />
            </div>
            <p className="text-gray-500 font-medium mb-8">
              Your ride from Tashkent to Samarkand is booked. The driver has
              been notified.
            </p>
            <Link href="/dashboard">
              <Button fullWidth variant="primary">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5 md:space-y-5">
            <div className="bg-light-bg p-6 rounded-3xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 font-bold">Route</span>
                <span className="text-dark-text font-black flex items-center">
                  Tashkent <HiArrowRight className="mx-2" /> Samarkand
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 font-bold">Date</span>
                <span className="text-dark-text font-black">
                  {formatDate(MOCK_RIDE.date)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-gray-500 font-bold text-lg">
                  Amount to pay
                </span>
                <span className="text-2xl font-black text-primary">
                  {formatCurrency(MOCK_RIDE.price)}
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
        )}
      </Modal>
    </div>
  );
};

export default RideDetailsPage;
