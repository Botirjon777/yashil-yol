"use client";

import { create } from "zustand";
import { ApiRegion, ApiDistrict, ApiQuarter } from "@/src/features/location/types";

interface LocationState {
  regions: ApiRegion[];
  districts: ApiDistrict[];
  quarters: ApiQuarter[];
  setRegions: (regions: ApiRegion[]) => void;
  setDistricts: (districts: ApiDistrict[]) => void;
  setQuarters: (quarters: ApiQuarter[]) => void;
  resolveLocationName: (
    obj: any,
    id: number | string | undefined,
    list: any[] | undefined,
    language: string
  ) => string | null;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  regions: [],
  districts: [],
  quarters: [],
  setRegions: (regions) => set({ regions }),
  setDistricts: (districts) => set({ districts }),
  setQuarters: (quarters) => set({ quarters }),
  resolveLocationName: (obj, id, list, language) => {
    // 0. If obj is already a string, return it
    if (typeof obj === "string" && obj.length > 0) return obj;

    // 1. Try nested object first (as defined in types)
    if (obj && typeof obj === "object") {
      return obj[`name_${language}`] || obj.name_uz || obj.name || null;
    }

    // 2. Try lookup by ID
    if (id && list && list.length > 0) {
      const found = list.find((item) => String(item.id) === String(id));
      if (found) {
        return found[`name_${language}`] || found.name_uz || found.name || null;
      }
    }

    return null;
  },
}));
