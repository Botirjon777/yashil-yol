"use client";

import { useState, Suspense } from "react";
import { HiArrowRight, HiFilter, HiSearch, HiStar, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useRidesPage } from "@/src/features/rides/hooks/useRidesPage";
import { GoArrowSwitch } from "react-icons/go";

import {
  FilterSidebar,
  RoutesSwiper,
  RideResultCard,
} from "@/src/features/rides/components";
import Loader from "@/src/components/ui/Loader";
import { RouteSearchModal } from "./components/RouteSearchModal";
import { HiLocationMarker } from "react-icons/hi";
import { useLanguageStore } from "@/src/providers/LanguageProvider";
import { Pagination } from "@/src/components/ui/Pagination";

const HomeContent = () => {
  const {
    user,
    activeRoute,
    handleRouteClick,
    filters,
    updateFilter,
    toggleTimeSlot,
    clearFilters,
    activeFilterCount,
    filteredRides,
    isLoading,
    page,
    setPage,
    meta,
    manualSearch,
    setManualSearch,
  } = useRidesPage();



  const { t } = useLanguageStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [routeModalStep, setRouteModalStep] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-light-bg text-dark-text">
      {/* ── Hero Header + Swiper ── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-2 md:mb-5">
            <div className="max-w-2xl">
              <h1 className="text-xl md:text-5xl font-black text-center tracking-tight leading-tight mb-2 md:mb-5">
                {activeRoute ? (
                  <span className="flex items-center gap-3 flex-wrap">
                    <span className="text-primary">{activeRoute.from}</span>
                    <GoArrowSwitch className="w-5 h-5 md:w-8 md:h-8 text-gray-300 shrink-0" />
                    <span className="text-secondary">{activeRoute.to}</span>
                  </span>
                ) : manualSearch ? (
                  <span className="flex items-center gap-3 flex-wrap">
                    <span className="text-primary">
                      {manualSearch.from?.regionName || "---"}
                    </span>
                    <GoArrowSwitch className="w-5 h-5 md:w-8 md:h-8 text-gray-300 shrink-0" />
                    <span className="text-secondary">
                      {manualSearch.to?.regionName || "---"}
                    </span>
                  </span>
                ) : (
                  <>
                    Yo'lingizni <span className="text-primary">oson</span> va{" "}
                    <span className="text-secondary">qulay</span> toping
                  </>
                )}
              </h1>
              <p className="hidden md:block text-gray-500 font-medium text-lg md:text-xl">
                {isLoading
                  ? "Sayohatlar qidirilmoqda..."
                  : activeRoute
                    ? `${activeRoute.from} — ${activeRoute.to} yo'nalishi bo'yicha ${filteredRides.length} ta sayohat topildi`
                    : "O'zbekiston bo'ylab eng yaxshi hamrohlar va haydovchilar bilan birga sayohat qiling."}
              </p>
            </div>
            {activeRoute && (
              <button
                onClick={() => handleRouteClick(activeRoute)}
                className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-error transition-all bg-gray-50 px-4 py-2 rounded-2xl border border-border self-start md:mb-2"
              >
                <HiX className="w-4 h-4" /> Yo'nalishni tozalash
              </button>
            )}
            {manualSearch && (
              <button
                onClick={() => setManualSearch(null)}
                className="flex items-center gap-2 text-sm font-black text-gray-400 hover:text-error transition-all bg-gray-50 px-4 py-2 rounded-2xl border border-border self-start md:mb-2"
              >
                <HiX className="w-4 h-4" /> Qidiruvni tozalash
              </button>
            )}
          </div>

          {/* Search Section */}
          <div className="">
            <button
              onClick={() => {
                setRouteModalStep(0);
                setRouteModalOpen(true);
              }}
              className="w-full group relative overflow-hidden flex items-center justify-between p-2.5 md:p-5 bg-white border-2 border-border rounded-md hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 text-left"
            >
              <div className="relative z-10 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] md:text-xs font-black uppercase text-gray-400 tracking-[0.2em] group-hover:text-primary transition-colors">
                    Sayohatni rejalashtirish
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-dark-text tracking-tight leading-tight">
                  Yo'nalishingizni <span className="text-primary italic">tez</span> toping
                </h2>
                <p className="text-sm md:text-base text-gray-500 font-medium mt-1 opacity-80">
                  O'zbekiston bo'ylab istalgan manzilga qulay hamroh toping
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="hidden lg:flex flex-col items-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-8 group-hover:translate-x-0">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">Qidirishni boshlash</span>
                  <div className="flex gap-1">
                    <div className="w-6 h-1 bg-primary/20 rounded-full" />
                    <div className="w-12 h-1 bg-primary rounded-full" />
                  </div>
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] bg-primary/5 group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center transition-all duration-500 shadow-xl shadow-primary/5 group-hover:shadow-primary/30 group-hover:rotate-6">
                  <HiSearch className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-32 -mt-32 blur-3xl group-hover:from-primary/10 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full -ml-24 -mb-24 blur-3xl" />
            </button>
          </div>

          <div className="max-w-7xl">
            <RoutesSwiper
              activeRoute={activeRoute}
              onRouteClick={handleRouteClick}
            />
          </div>
        </div>
      </div>

      {/* ── Main Body ── */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-5 w-full">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-5 lg:hidden">
          <span className="text-sm font-bold text-gray-500">
            {filteredRides.length} ta sayohat
          </span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 text-sm font-black text-primary bg-primary/5 border border-primary/20 px-5 py-2.5 rounded-2xl"
          >
            <HiFilter className="w-4 h-4" />
            Filtrlar
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-primary text-white rounded-full text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                updateFilter={updateFilter}
                toggleTimeSlot={toggleTimeSlot}
                onClear={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* Mobile sidebar drawer */}
          <AnimatePresence>
            {isSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-dark-text/40 backdrop-blur-sm"
                  onClick={() => setIsSidebarOpen(false)}
                />

                {/* Sidebar Panel */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                  }}
                  className="relative ml-auto w-80 max-w-[90%] bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
                >
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <h3 className="font-black text-sm uppercase tracking-widest text-dark-text">
                      Filtrlar
                    </h3>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                    >
                      <HiX className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 flex-1">
                    <FilterSidebar
                      filters={filters}
                      updateFilter={updateFilter}
                      toggleTimeSlot={toggleTimeSlot}
                      onClear={clearFilters}
                      activeFilterCount={activeFilterCount}
                      onApply={() => setIsSidebarOpen(false)}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Results Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {activeRoute ? (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                ) : (
                  <HiStar className="w-5 h-5 text-amber-400" />
                )}
                <h2 className="text-sm font-black text-dark-text uppercase tracking-widest flex items-center gap-2">
                  {activeRoute ? (
                    <>
                      {activeRoute.from}
                      <GoArrowSwitch className="w-4 h-4 text-primary/40 shrink-0" />
                      {activeRoute.to}
                    </>
                  ) : (
                    "Yangi qo'shilgan sayohatlar"
                  )}
                </h2>
              </div>
              <span className="hidden md:block text-xs font-bold text-gray-400">
                {filteredRides.length} ta natija
              </span>
            </div>


            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader size="lg" />
                <p className="mt-6 text-gray-400 font-bold text-sm animate-pulse">
                  Sayohatlar qidirilmoqda...
                </p>
              </div>
            ) : filteredRides.length > 0 ? (
              <div className="space-y-5">
                {filteredRides.map((ride) => (
                  <RideResultCard
                    key={ride.id}
                    ride={ride}
                    showDriverInfo={
                      user ? Number(ride.driver_id) === Number(user.id) : false
                    }
                  />
                ))}

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                  <div className="pt-10">
                    <Pagination
                      currentPage={page}
                      totalPages={meta.last_page}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 text-center">
                <h3 className="text-2xl font-black mb-3 text-dark-text">
                  Sayohat topilmadi
                </h3>
                <p className="text-gray-400 font-medium text-base mb-8 max-w-sm mx-auto">
                  {activeRoute
                    ? `${activeRoute.from} — ${activeRoute.to} yo'nalishi bo'yicha hozircha bo'sh o'rinlar yo'q. Boshqa yo'nalishni tanlab ko'ring.`
                    : "Hozircha sayohatlar mavjud emas. Filtrlarni tozalab ko'ring."}
                </p>
                {(activeRoute || activeFilterCount > 0) && (
                  <button
                    onClick={() => {
                      if (activeRoute) handleRouteClick(activeRoute);
                      clearFilters();
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Barcha natijalarni ko'rish
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <RouteSearchModal
        isOpen={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        initialStep={routeModalStep}
        onConfirm={(fromLoc, toLoc) => {
          setManualSearch((prev) => {
            const current = prev || {};
            return {
              from: fromLoc || current.from,
              to: toLoc || current.to,
            } as any; // Cast as any if exact type complains, though it should match
          });
        }}
      />
    </div>
  );
};

export default function MainPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-light-bg">
          <Loader size="lg" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
