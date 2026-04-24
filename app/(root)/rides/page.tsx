"use client";

import { useState, Suspense } from "react";
import { HiArrowRight, HiChevronLeft, HiChevronRight, HiFilter, HiSearch, HiStar, HiX } from "react-icons/hi";
import { useRidesPage } from "@/src/features/rides/hooks/useRidesPage";
import { FilterSidebar, RoutesSwiper, RideResultCard } from "@/src/features/rides/components";
import Loader from "@/src/components/ui/Loader";

// ─── Main Content ─────────────────────────────────────────────────────────────
const RidesContent = () => {
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
    <div className="bg-light-bg min-h-screen text-dark-text">

      {/* ── Hero Header + Swiper ── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                {activeRoute ? (
                  <span className="flex items-center gap-2 flex-wrap">
                    <span className="text-primary">{activeRoute.from}</span>
                    <HiArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-secondary">{activeRoute.to}</span>
                  </span>
                ) : (
                  "Barcha yo'nalishlar"
                )}
              </h1>
              <p className="text-gray-400 font-medium text-sm mt-0.5">
                {isLoading ? "Qidirilmoqda..." : `${filteredRides.length} ta sayohat topildi`}
              </p>
            </div>
            {activeRoute && (
              <button
                onClick={() => handleRouteClick(activeRoute)}
                className="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-error transition-colors bg-gray-50 px-3 py-1.5 rounded-xl border border-border"
              >
                <HiX className="w-3.5 h-3.5" /> Tozalash
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-4">
          <RoutesSwiper activeRoute={activeRoute} onRouteClick={handleRouteClick} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">

        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <span className="text-sm font-bold text-gray-500">{filteredRides.length} ta sayohat</span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 text-sm font-black text-primary bg-primary/5 border border-primary/20 px-4 py-2 rounded-2xl"
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filters={filters}
              updateFilter={updateFilter}
              toggleTimeSlot={toggleTimeSlot}
              onClear={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* Mobile sidebar drawer */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="absolute inset-0 bg-dark-text/50 backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
              />
              <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h3 className="font-black text-sm uppercase tracking-widest">Filtrlar</h3>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5">
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

          {/* Results */}
          <div className="lg:col-span-3">
            {!activeRoute && (
              <div className="flex items-center gap-2 mb-5">
                <HiStar className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Oxirgi qo'shilgan sayohatlar
                </span>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-border">
                <Loader size="lg" />
                <p className="mt-4 text-gray-400 font-bold text-sm animate-pulse">
                  Sayohatlar qidirilmoqda...
                </p>
              </div>
            ) : filteredRides.length > 0 ? (
              <div className="space-y-4">
                {filteredRides.map((ride) => (
                  <RideResultCard
                    key={ride.id}
                    ride={ride}
                    showDriverInfo={user ? Number(ride.driver_id) === Number(user.id) : false}
                  />
                ))}

                {/* Pagination (all-trips mode only) */}
                {!activeRoute && meta && meta.last_page > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-6">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="p-2.5 rounded-xl border border-border disabled:opacity-40 hover:bg-gray-50 transition-all"
                    >
                      <HiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-black text-gray-500 px-2">
                      {page} / {meta.last_page}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                      disabled={page >= meta.last_page}
                      className="p-2.5 rounded-xl border border-border disabled:opacity-40 hover:bg-gray-50 transition-all"
                    >
                      <HiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="premium-card p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <HiSearch className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black mb-2 text-dark-text">Sayohat topilmadi</h3>
                <p className="text-gray-400 font-medium text-sm mb-6">
                  {activeRoute
                    ? `${activeRoute.label} yo'nalishi bo'yicha hozircha sayohat yo'q`
                    : "Filtrlarni o'zgartiring yoki biroz kutib turing"}
                </p>
                {(activeRoute || activeFilterCount > 0) && (
                  <button
                    onClick={() => { if (activeRoute) handleRouteClick(activeRoute); clearFilters(); }}
                    className="text-sm font-black text-primary hover:text-primary/80 underline"
                  >
                    Barcha filtrlarni tozalash
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page wrapper ─────────────────────────────────────────────────────────────
const RidesPage = () => (
  <Suspense
    fallback={
      <div className="bg-light-bg min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="h-3 bg-gray-200 rounded w-40" />
        </div>
      </div>
    }
  >
    <RidesContent />
  </Suspense>
);

export default RidesPage;
