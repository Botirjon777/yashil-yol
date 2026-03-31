import api from "@/src/lib/axios";
import { VehicleRequest, CarColor, Trip, TripSearchParams } from "../types";

export interface PaginatedTrips {
  data: Trip[];
  current_page: number;
  last_page: number;
  total: number;
}

/** POST /vehicles */
export const addVehicle = async (data: VehicleRequest): Promise<{ status: string; message: string; data?: { id: number } }> => {
  const res = await api.post<{ status: string; message: string; data: { id: number } }>("vehicles", data);
  return res.data;
};

/** GET /car-colors */
export const getCarColors = async (): Promise<CarColor[]> => {
  const res = await api.get<CarColor[] | { data: CarColor[] }>("car-colors");
  return Array.isArray(res.data) ? res.data : (res.data as { data: CarColor[] }).data;
};

/** GET /public/trips — paginated list with less info */
export const getPublicTrips = async (page = 1): Promise<PaginatedTrips> => {
  const res = await api.get<PaginatedTrips>("public/trips", {
    params: { page },
  });
  return res.data;
};

/** GET /public/trips/view — full public list */
export const getAllPublicTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("public/trips/view");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

/** GET /public/trips/search/available-trips */
export const searchTrips = async (params: TripSearchParams): Promise<Trip[]> => {
  const formattedParams = { ...params };
  if (formattedParams.departure_date && formattedParams.departure_date.length === 10) {
    formattedParams.departure_date = `${formattedParams.departure_date} 00:00:00`;
  }

  const res = await api.get<any>("public/trips/search/available-trips", {
    params: formattedParams,
  });

  return res.data?.data?.departure_trips?.data ?? [];
};

/** GET /public/trips/view/:id */
export const getTripById = async (id: string | number): Promise<Trip> => {
  const res = await api.get<Trip>(`public/trips/view/${id}`);
  return res.data;
};

/** GET /client/trips/get-inprogress-trips */
export const getClientInprogressTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("client/trips/get-inprogress-trips");
  return res.data?.data?.data ?? res.data?.data ?? res.data?.trips ?? [];
};

/** GET /client/trips/get-completed-trips */
export const getClientCompletedTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("client/trips/get-completed-trips");
  return res.data?.data?.data ?? res.data?.data ?? res.data?.trips ?? [];
};

/** GET /client/trips/get-canceled-trips */
export const getClientCanceledTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("client/trips/get-canceled-trips");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

/** GET /driver/trips/get-active-trips/driver */
export const getDriverActiveTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("driver/trips/get-active-trips/driver");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

/** GET /driver/trips/get-completed-trips/driver */
export const getDriverCompletedTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("driver/trips/get-completed-trips/driver");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

/** GET /driver/trips/get-canceled-trips/driver */
export const getDriverCanceledTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("driver/trips/get-canceled-trips/driver");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

/** GET /driver/trips — all trips for driver */
export const getDriverAllTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("driver/trips");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

/** GET /driver/trips/:id — single trip for driver */
export const getDriverTripById = async (id: string | number): Promise<Trip> => {
  const res = await api.get<Trip>(`driver/trips/${id}`);
  return res.data;
};

/** POST /driver/trips */
export const createTrip = async (data: any): Promise<{ status: string; message: string }> => {
  const res = await api.post<{ status: string; message: string }>("driver/trips", data);
  return res.data;
};
