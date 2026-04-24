"use client";

import { HiAdjustments, HiUserGroup, HiSun, HiCloud, HiMoon } from "react-icons/hi";
import { cn } from "@/src/lib/utils";
import { TIME_SLOTS, type TimeSlotKey } from "../constants/routes";
import type { RidesPageFilters } from "../hooks/useRidesPage";

const TIME_ICONS: Record<string, React.ReactNode> = {
  morning: <HiCloud className="w-4 h-4 text-sky-500" />,
  afternoon: <HiSun className="w-4 h-4 text-amber-500" />,
  evening: <HiMoon className="w-4 h-4 text-indigo-500" />,
};

interface FilterSidebarProps {
  filters: RidesPageFilters;
  updateFilter: <K extends keyof RidesPageFilters>(key: K, value: RidesPageFilters[K]) => void;
  toggleTimeSlot: (slot: TimeSlotKey) => void;
  onClear: () => void;
  activeFilterCount: number;
  /** Mobile only: close the drawer after applying */
  onApply?: () => void;
}

export function FilterSidebar({
  filters,
  updateFilter,
  toggleTimeSlot,
  onClear,
  activeFilterCount,
  onApply,
}: FilterSidebarProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HiAdjustments className="w-4 h-4 text-primary" />
          <h3 className="font-black text-sm uppercase tracking-widest">Filtrlar</h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-primary text-white rounded-full text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClear}
            className="text-[10px] font-black text-gray-400 hover:text-error transition-colors uppercase tracking-widest"
          >
            Tozalash
          </button>
        )}
      </div>

      {/* Price */}
      <div className="premium-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Maksimal narx
          </h4>
          <span className="text-xs font-black text-primary">
            {filters.priceRange >= 1000000
              ? "Cheksiz"
              : `${filters.priceRange.toLocaleString()} UZS`}
          </span>
        </div>
        <input
          type="range"
          min={10000}
          max={1000000}
          step={10000}
          value={filters.priceRange}
          onChange={(e) => updateFilter("priceRange", Number(e.target.value))}
          className="w-full accent-primary h-1.5 rounded-full"
        />
        <div className="flex justify-between text-[9px] font-bold text-gray-400">
          <span>10 000</span>
          <span>1 000 000 UZS</span>
        </div>
      </div>

      {/* Departure Time */}
      <div className="premium-card p-4 space-y-3">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Jo'nash vaqti
        </h4>
        <div className="space-y-2">
          {TIME_SLOTS.map((slot) => {
            const active = filters.timeSlots.includes(slot.key as TimeSlotKey);
            return (
              <button
                key={slot.key}
                onClick={() => toggleTimeSlot(slot.key as TimeSlotKey)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all",
                  active
                    ? "bg-primary/5 border-primary/30 text-primary"
                    : "bg-light-bg border-border/60 hover:border-primary/20",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                    active ? "bg-white shadow-sm" : "bg-white/50"
                  )}>
                    {TIME_ICONS[slot.key]}
                  </div>
                  <span className="text-xs font-black">{slot.label}</span>
                </div>
                <span className="text-[9px] font-bold text-gray-400">{slot.range}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Seats */}
      <div className="premium-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <HiUserGroup className="w-3.5 h-3.5 text-primary" />
            O'rinlar soni
          </h4>
          <span className="text-xs font-black text-primary">{filters.minSeats}+</span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => updateFilter("minSeats", n)}
              className={cn(
                "flex-1 py-2 rounded-xl border text-xs font-black transition-all",
                filters.minSeats === n
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-white border-border hover:border-primary/30",
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-[9px] font-bold text-gray-400">
          Kamida {filters.minSeats} ta bo'sh o'rin
        </p>
      </div>

      {/* Apply button (mobile drawer only) */}
      {onApply && (
        <button
          onClick={onApply}
          className="w-full py-3 bg-primary text-white font-black text-sm rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
        >
          Qo'llash
        </button>
      )}
    </div>
  );
}
