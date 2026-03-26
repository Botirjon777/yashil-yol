import { useQuery } from "@tanstack/react-query";
import {
  getRegions,
  getDistricts,
  getDistrictsByRegion,
  getQuarters,
  getQuartersByDistrict,
} from "../actions/actions";
import { ApiRegion, ApiDistrict, ApiQuarter } from "../types";

/** All regions — cached indefinitely (rarely changes) */
export const useRegions = () =>
  useQuery<ApiRegion[], Error>({
    queryKey: ["regions"],
    queryFn: getRegions,
    staleTime: Infinity,
  });

/** All districts */
export const useDistricts = () =>
  useQuery<ApiDistrict[], Error>({
    queryKey: ["districts"],
    queryFn: getDistricts,
    staleTime: Infinity,
  });

/** Districts filtered by region */
export const useDistrictsByRegion = (regionId: number | string | null) =>
  useQuery<ApiDistrict[], Error>({
    queryKey: ["districts", "region", regionId],
    queryFn: () => getDistrictsByRegion(regionId!),
    enabled: regionId !== null && regionId !== undefined && regionId !== "",
    staleTime: Infinity,
  });

/** All quarters */
export const useQuarters = () =>
  useQuery<ApiQuarter[], Error>({
    queryKey: ["quarters"],
    queryFn: getQuarters,
    staleTime: Infinity,
  });

/** Quarters filtered by district */
export const useQuartersByDistrict = (districtId: number | string | null) =>
  useQuery<ApiQuarter[], Error>({
    queryKey: ["quarters", "district", districtId],
    queryFn: () => getQuartersByDistrict(districtId!),
    enabled: districtId !== null && districtId !== undefined && districtId !== "",
    staleTime: Infinity,
  });
