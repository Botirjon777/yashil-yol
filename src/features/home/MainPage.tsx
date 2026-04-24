"use client";

import { useState, Suspense } from "react";
import {
  HiArrowRight,
  HiChevronLeft,
  HiChevronRight,
  HiFilter,
  HiSearch,
  HiStar,
  HiX,
} from "react-icons/hi";
import { useRidesPage } from "@/src/features/rides/hooks/useRidesPage";
import {
  FilterSidebar,
  RoutesSwiper,
  RideResultCard,
} from "@/src/features/rides/components";
import Loader from "@/src/components/ui/Loader";
import StatsSection from "./sections/StatsSection";
import FeaturesSection from "./sections/FeaturesSection";

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
  } = useRidesPage();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-light-bg text-dark-text">
      {/* ── Hero Header + Swiper ── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-6 md:pt-16 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                {activeRoute ? (
                  <span className="flex items-center gap-3 flex-wrap">
                    <span className="text-primary">{activeRoute.from}</span>
                    <HiArrowRight className="w-6 h-6 md:w-8 md:h-8 text-gray-300 shrink-0" />
                    <span className="text-secondary">{activeRoute.to}</span>
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
                  ? `${activeRoute.label} yo'nalishi bo'yicha ${filteredRides.length} ta sayohat topildi`
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
                <h2 className="text-sm font-black text-dark-text uppercase tracking-widest">
                  {activeRoute
                    ? `${activeRoute.from} → ${activeRoute.to}`
                    : "Yangi qo'shilgan sayohatlar"}
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

                {/* Pagination (only in default mode) */}
                {!activeRoute && meta && meta.last_page > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl border border-border bg-white disabled:opacity-40 hover:bg-primary/5 hover:border-primary/30 transition-all shadow-sm"
                    >
                      <HiChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="bg-white border border-border px-6 py-3 rounded-2xl font-black text-sm text-gray-500 shadow-sm">
                      {page} / {meta.last_page}
                    </div>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(meta.last_page, p + 1))
                      }
                      disabled={page >= meta.last_page}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl border border-border bg-white disabled:opacity-40 hover:bg-primary/5 hover:border-primary/30 transition-all shadow-sm"
                    >
                      <HiChevronRight className="w-6 h-6" />
                    </button>
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
                    ? `${activeRoute.label} yo'nalishi bo'yicha hozircha bo'sh o'rinlar yo'q. Boshqa yo'nalishni tanlab ko'ring.`
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
