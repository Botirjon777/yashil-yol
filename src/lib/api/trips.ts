import api from "@/src/lib/axios";
import { Trip, TripSearchParams } from "@/src/features/rides/types";

export interface PaginatedTrips {
  data: Trip[];
  current_page: number;
  last_page: number;
  total: number;
}

/** GET /public/trips  — paginated list with less info */
export const getPublicTrips = async (page = 1): Promise<PaginatedTrips> => {
  const res = await api.get<PaginatedTrips>("/public/trips", {
    params: { page },
  });
  return res.data;
};

/** GET /public/trips/view  — full public list */
export const getAllPublicTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("/public/trips/view");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

/** GET /public/trips/search/available-trips */
export const searchTrips = async (params: TripSearchParams): Promise<Trip[]> => {
  // Ensure departure_date has time H:i:s if only Y-m-d is provided
  const formattedParams = { ...params };
  if (formattedParams.departure_date && formattedParams.departure_date.length === 10) {
    formattedParams.departure_date = `${formattedParams.departure_date} 00:00:00`;
  }

  const res = await api.get<any>("/public/trips/search/available-trips", {
    params: formattedParams,
  });

  // Backend returns: { data: { departure_trips: { data: Trip[] }, ... } }
  return res.data?.data?.departure_trips?.data ?? [];
};

/** GET /public/trips/view/:id */
export const getTripById = async (id: string | number): Promise<Trip> => {
  const res = await api.get<Trip>(`/public/trips/view/${id}`);
  return res.data;
};

// ─── Client (Passenger) Trips ────────────────────────────────────────────────

export const getClientInprogressTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("/client/trips/get-inprogress-trips");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

export const getClientCompletedTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("/client/trips/get-completed-trips");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

export const getClientCanceledTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("/client/trips/get-canceled-trips");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

// ─── Driver Trips ─────────────────────────────────────────────────────────────

export const getDriverActiveTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("/driver/trips/get-active-trips/driver");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

export const getDriverCompletedTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("/driver/trips/get-completed-trips/driver");
  return res.data?.data?.data ?? res.data?.data ?? [];
};

export const getDriverCanceledTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("/driver/trips/get-canceled-trips/driver");
  return res.data?.data?.data ?? res.data?.data ?? [];
};
