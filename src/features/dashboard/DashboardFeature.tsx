"use client";

import { useDashboard } from "./hooks/useDashboard";
import { Sidebar } from "./sections/Sidebar";
import { DriverStatusBanner } from "./sections/DriverStatusBanner";
import { RidesSection } from "./sections/RidesSection";
import { BalanceSection } from "./sections/BalanceSection";
import { ProfileSection } from "./sections/ProfileSection";
import { DriverSection } from "./sections/DriverSection";
import { TransactionsSection } from "./sections/TransactionsSection";
import AddCardModal from "./components/AddCardModal";
import TopUpModal from "./components/TopUpModal";
import AddVehicleModal from "./components/AddVehicleModal";
import { FatherNameModal } from "./components/FatherNameModal";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TAB_ORDER = {
  rides: 0,
  balance: 1,
  profile: 2,
  transactions: 3,
  driver: 4,
};

export default function DashboardFeature() {
  const {
    user,
    isUserLoading,
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
    isDirty,
    isFatherNameModalOpen,
    setIsFatherNameModalOpen,
    isDriver,
    balance,
    vehicles,
    isAddVehicleOpen,
    setIsAddVehicleOpen,
    isSectionOpen,
    setIsSectionOpen,
  } = useDashboard();

  const { t } = useLanguageStore();

  const [prevTab, setPrevTab] = useState(activeTab);
  const [isMobile, setIsMobile] = useState(false);
  const direction =
    (TAB_ORDER[activeTab as keyof typeof TAB_ORDER] || 0) >=
    (TAB_ORDER[prevTab as keyof typeof TAB_ORDER] || 0)
      ? 1
      : -1;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (activeTab !== prevTab) {
      setPrevTab(activeTab);
    }
  }, [activeTab, prevTab]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentSection = (
    <>
      {activeTab === "rides" && (
        <RidesSection
          rideType={rideType}
          handleRideTypeChange={handleRideTypeChange}
          activeRides={activeRides || []}
          historyRides={historyRides || []}
          isDriver={isDriver}
          user={user}
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
          isDirty={isDirty}
        />
      )}
      {activeTab === "transactions" && <TransactionsSection />}
      {activeTab === "driver" && (
        <DriverSection
          user={user}
          vehicles={vehicles}
          onAddVehicleClick={() => setIsAddVehicleOpen(true)}
        />
      )}
    </>
  );

  return (
    <div className="bg-light-bg min-h-screen py-2.5 lg:py-5 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2.5 lg:px-5 relative">
        {!isMobile ? (
          /* Desktop Layout - Totally Static */
          <div className="grid grid-cols-4 gap-5">
            <div className="col-span-1">
              <Sidebar
                user={user}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                isDriver={isDriver}
              />
            </div>
            <div className="col-span-3 space-y-8">
              <DriverStatusBanner user={user} isDriver={isDriver} />
              {currentSection}
            </div>
          </div>
        ) : (
          /* Mobile Layout - Premium Framer Motion Transitions */
          <AnimatePresence
            mode="popLayout"
            initial={false}
            custom={isSectionOpen}
          >
            {!isSectionOpen ? (
              <motion.div
                key="sidebar"
                custom={isSectionOpen}
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute left-2.5 right-2.5 lg:relative lg:left-0 lg:right-0 lg:w-full"
              >
                <Sidebar
                  user={user}
                  activeTab={activeTab}
                  handleTabChange={handleTabChange}
                  isDriver={isDriver}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                custom={isSectionOpen}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute left-2.5 right-2.5 lg:relative lg:left-0 lg:right-0 lg:w-full space-y-5"
              >
                <button
                  onClick={() => setIsSectionOpen(false)}
                  className="flex items-center text-primary font-black uppercase text-xs tracking-widest hover:text-secondary mb-6 bg-white py-3 px-5 rounded-md shadow-sm border border-border/50 active:scale-95 transition-transform"
                >
                  <span className="mr-2 text-lg">←</span>{" "}
                  {t("common", "back") || "Back to Menu"}
                </button>

                <DriverStatusBanner user={user} isDriver={isDriver} />

                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={activeTab}
                    custom={direction}
                    variants={{
                      enter: (dir: number) => ({
                        x: dir > 0 ? "20%" : "-20%",
                        opacity: 0,
                      }),
                      center: { x: 0, opacity: 1 },
                      exit: (dir: number) => ({
                        x: dir < 0 ? "20%" : "-20%",
                        opacity: 0,
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                  >
                    {currentSection}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
      />
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
      />
      <FatherNameModal
        isOpen={isFatherNameModalOpen}
        onClose={() => setIsFatherNameModalOpen(false)}
        value={profileForm.father_name}
        onChange={(val) => setProfileForm({ ...profileForm, father_name: val })}
        onSubmit={handleProfileSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
