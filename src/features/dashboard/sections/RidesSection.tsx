import React, { useState } from "react";
import { RideCard } from "../components/RideCard";
import CreateTripModal from "../components/CreateTripModal";
import Button from "@/src/components/ui/Button";
import { HiPlus } from "react-icons/hi";
import { AuthUser } from "../../auth/types";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

interface RidesSectionProps {
  rideType: "passenger" | "driver";
  handleRideTypeChange: (type: "passenger" | "driver") => void;
  activeRides: any[];
  historyRides: any[];
  isDriver: boolean;
  user: AuthUser | null;
}

export function RidesSection({ 
  rideType, 
  handleRideTypeChange, 
  activeRides, 
  historyRides, 
  isDriver,
  user
}: RidesSectionProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isApproved = user?.driving_verification_status === "approved";
  const { t } = useLanguageStore();

  const ridesTranslations = t("dashboard", "rides");

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2">
        <h1 className="text-3xl font-black text-dark-text">
          {ridesTranslations?.title}
        </h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {isDriver && (
            <div className="flex bg-white p-1 rounded-xl border border-border shadow-sm">
              <button
                onClick={() => handleRideTypeChange("passenger")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  rideType === "passenger"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {ridesTranslations?.asPassenger}
              </button>
              <button
                onClick={() => handleRideTypeChange("driver")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  rideType === "driver"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {ridesTranslations?.asDriver}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animated Create Trip Banner for Drivers */}
      {isDriver && isApproved && rideType === "driver" && (
        <div className="animate-in-bottom transition-all duration-500">
          <div className="premium-card p-8 bg-linear-to-r from-primary/10 to-secondary/10 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
            <div className="flex items-center space-x-6 relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl text-primary shadow-soft group-hover:scale-110 transition-transform duration-300">
                <HiPlus />
              </div>
              <div>
                <h3 className="text-xl font-black text-dark-text">
                  {ridesTranslations?.bannerTitle}
                </h3>
                <p className="text-gray-500 font-medium max-w-md">
                  {ridesTranslations?.bannerDesc}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              size="lg"
              className="px-8 shadow-xl shadow-primary/20 relative z-10"
              icon={<HiPlus className="w-5 h-5" />}
            >
              {ridesTranslations?.createTrip}
            </Button>
          </div>
        </div>
      )}

      <CreateTripModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <div className="space-y-4">
        <h2 className="text-lg font-black text-gray-400 uppercase tracking-widest">{ridesTranslations?.active}</h2>
        {activeRides?.length === 0 ? (
          <div className="premium-card p-12 text-center text-gray-500 font-medium">
            {ridesTranslations?.noActive}
          </div>
        ) : (
          activeRides?.map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))
        )}

        <h2 className="text-lg font-black text-gray-400 uppercase tracking-widest pt-8">{ridesTranslations?.history}</h2>
        {historyRides?.length === 0 ? (
          <div className="premium-card p-12 text-center text-gray-500 font-medium">
            {ridesTranslations?.noHistory}
          </div>
        ) : (
          historyRides?.map((ride) => (
            <RideCard key={ride.id} ride={ride} isHistory />
          ))
        )}
      </div>
    </div>
  );
}
