"use client";

import React from "react";
import Button from "@/src/components/ui/Button";
import Modal from "@/src/components/ui/Modal";
import { useDashboard } from "./hooks/useDashboard";
import { Sidebar } from "./sections/Sidebar";
import { DriverStatusBanner } from "./sections/DriverStatusBanner";
import { RidesSection } from "./sections/RidesSection";
import { BalanceSection } from "./sections/BalanceSection";
import { ProfileSection } from "./sections/ProfileSection";
import { DriverSection } from "./sections/DriverSection";
import AddCardModal from "./components/AddCardModal";
import TopUpModal from "./components/TopUpModal";

export default function DashboardFeature() {
  const {
    user,
    isUserLoading,
    balanceData,
    activeTab,
    handleTabChange,
    isTopUpOpen,
    setIsTopUpOpen,
    isAddCardOpen,
    setIsAddCardOpen,
    rideType,
    handleRideTypeChange,
    activeRides,
    historyRides,
    profileForm,
    setProfileForm,
    handleProfileSubmit,
    isUpdating,
    isDriver,
    balance
  } = useDashboard();

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-light-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <Sidebar 
            user={user} 
            activeTab={activeTab} 
            handleTabChange={handleTabChange} 
            isDriver={isDriver} 
          />

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-8">
            <DriverStatusBanner user={user} isDriver={isDriver} />

            {activeTab === "rides" && (
              <RidesSection 
                rideType={rideType}
                handleRideTypeChange={handleRideTypeChange}
                activeRides={activeRides || []}
                historyRides={historyRides || []}
                isDriver={isDriver}
              />
            )}

            {activeTab === "balance" && (
              <BalanceSection 
                balance={balance} 
                onTopUpClick={() => setIsTopUpOpen(true)}
                onAddCardClick={() => setIsAddCardOpen(true)}
              />
            )}

            {activeTab === "profile" && (
              <ProfileSection 
                user={user}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                handleProfileSubmit={handleProfileSubmit}
                isUpdating={isUpdating}
              />
            )}

            {activeTab === "driver" && (
              <DriverSection user={user} />
            )}
          </div>
        </div>
      </div>

      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
      <AddCardModal isOpen={isAddCardOpen} onClose={() => setIsAddCardOpen(false)} />
    </div>
  );
}
