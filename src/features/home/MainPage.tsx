"use client";

import { useState, Suspense } from "react";
import {
  HiArrowRight,
  HiFilter,
  HiSearch,
  HiStar,
  HiX,
} from "react-icons/hi";
import { useRidesPage } from "@/src/features/rides/hooks/useRidesPage";
import { GoArrowSwitch } from "react-icons/go";

import {
  FilterSidebar,
  RoutesSwiper,
  RideResultCard,
} from "@/src/features/rides/components";
import Loader from "@/src/components/ui/Loader";
import StatsSection from "./sections/StatsSection";
import FeaturesSection from "./sections/FeaturesSection";
import { LocationSearchModal } from "./components/LocationSearchModal";
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
  const [modalType, setModalType] = useState<"from" | "to" | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-light-bg text-dark-text">
      {/* ── Hero Header + Swiper ── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-5">
                {activeRoute ? (
                  <span className="flex items-center gap-3 flex-wrap">
                    <span className="text-primary">{activeRoute.from}</span>
                    <GoArrowSwitch className="w-6 h-6 md:w-8 md:h-8 text-gray-300 shrink-0" />
                    <span className="text-secondary">{activeRoute.to}</span>
                  </span>
                ) : manualSearch ? (
                  <span className="flex items-center gap-3 flex-wrap">
                    <span className="text-primary">{manualSearch.from?.regionName || "---"}</span>
                    <GoArrowSwitch className="w-6 h-6 md:w-8 md:h-8 text-gray-300 shrink-0" />
                    <span className="text-secondary">{manualSearch.to?.regionName || "---"}</span>
                  </span>
                ) : (
                  <>
                    Yo'lingizni <span className="text-primary">oson</span> va{" "}
                    <span className="text-secondary">qulay</span> toping
                  </>
                )}
              </h1>
              <p className="text-gray-500 font-medium text-lg md:text-xl">
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
          <div className="flex flex-row items-center gap-2 md:gap-4 mb-3">
            <button
              onClick={() => setModalType("from")}
              className="flex-1 flex flex-col items-start gap-0.5 p-3 md:p-4 bg-light-bg/50 rounded-2xl border-2 border-border hover:border-primary/30 transition-all text-left group"
            >
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-gray-400 tracking-widest group-hover:text-primary transition-colors">
                <HiLocationMarker className="w-3 h-3" />
                {t("home", "from")}
              </div>
              <div className="text-sm md:text-base font-black text-dark-text truncate w-full">
                {manualSearch?.from?.quarterName || manualSearch?.from?.districtName || manualSearch?.from?.regionName || t("home", "selectCity")}
              </div>
            </button>

            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-300 shrink-0">
              <HiArrowRight className="w-4 h-4" />
            </div>

            <button
              onClick={() => setModalType("to")}
              className="flex-1 flex flex-col items-start gap-0.5 p-3 md:p-4 bg-light-bg/50 rounded-2xl border-2 border-border hover:border-secondary/30 transition-all text-left group"
            >
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-gray-400 tracking-widest group-hover:text-secondary transition-colors">
                <HiLocationMarker className="w-3 h-3" />
                {t("home", "to")}
              </div>
              <div className="text-sm md:text-base font-black text-dark-text truncate w-full">
                {manualSearch?.to?.quarterName || manualSearch?.to?.districtName || manualSearch?.to?.regionName || t("home", "selectCity")}
              </div>
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
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="absolute inset-0 bg-dark-text/40 backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
              />
              <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h3 className="font-black text-sm uppercase tracking-widest">
                    Filtrlar
                  </h3>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  <FilterSidebar
                    filters={filters}
                    updateFilter={updateFilter}
                    toggleTimeSlot={toggleTimeSlot}
                    onClear={clearFilters}
                    activeFilterCount={activeFilterCount}
                    onApply={() => setIsSidebarOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
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
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-border/60 shadow-sm">
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
              <div className="premium-card p-16 text-center">
                <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-border/40">
                  <HiSearch className="w-12 h-12" />
                </div>
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

      <StatsSection />
      <FeaturesSection />

      <LocationSearchModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        title={modalType === "from" ? t("home", "from") : t("home", "to")}
        onConfirm={(loc) => {
          setManualSearch((prev) => ({
            ...prev,
            [modalType as "from" | "to"]: loc,
          }));
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
