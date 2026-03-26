import api from "@/src/lib/axios";
import { ApiRegion, ApiDistrict, ApiQuarter } from "@/src/features/location/types";

/** GET /regions */
export const getRegions = async (): Promise<ApiRegion[]> => {
  const res = await api.get<ApiRegion[] | { data: ApiRegion[] }>("/regions");
  return Array.isArray(res.data) ? res.data : (res.data as { data: ApiRegion[] }).data;
};

/** GET /districts */
export const getDistricts = async (): Promise<ApiDistrict[]> => {
  const res = await api.get<ApiDistrict[] | { data: ApiDistrict[] }>("/districts");
  return Array.isArray(res.data) ? res.data : (res.data as { data: ApiDistrict[] }).data;
};

/** GET /districts/region/:id */
export const getDistrictsByRegion = async (regionId: number | string): Promise<ApiDistrict[]> => {
  const res = await api.get<ApiDistrict[] | { data: ApiDistrict[] }>(
    `/districts/region/${regionId}`
  );
  return Array.isArray(res.data) ? res.data : (res.data as { data: ApiDistrict[] }).data;
};

/** GET /quarters */
export const getQuarters = async (): Promise<ApiQuarter[]> => {
  const res = await api.get<ApiQuarter[] | { data: ApiQuarter[] }>("/quarters");
  return Array.isArray(res.data) ? res.data : (res.data as { data: ApiQuarter[] }).data;
};

/** GET /quarters/districts/:id */
export const getQuartersByDistrict = async (districtId: number | string): Promise<ApiQuarter[]> => {
  const res = await api.get<ApiQuarter[] | { data: ApiQuarter[] }>(
    `/quarters/districts/${districtId}`
  );
  return Array.isArray(res.data) ? res.data : (res.data as { data: ApiQuarter[] }).data;
};
