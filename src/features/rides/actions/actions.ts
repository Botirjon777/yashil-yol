import api from "@/src/lib/axios";
import { VehicleRequest, CarColor, Trip, TripSearchParams, Booking } from "../types";

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

/** GET /vehicles */
export const getVehicles = async (): Promise<any[]> => {
  const res = await api.get<any>("vehicles");
  return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
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
  const data = res.data?.data?.data ?? res.data?.data ?? res.data;
  return Array.isArray(data) ? data : [];
};

/** GET /public/trips/search/available-trips */
export const searchTrips = async (params: TripSearchParams): Promise<Trip[]> => {
  // Filter out empty values to prevent 500 errors on the backend
  const formattedParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
  ) as any;

  if (formattedParams.departure_date) {
    const d = String(formattedParams.departure_date);
    if (d.length === 10) {
      formattedParams.departure_date = `${d} 00:00:00`;
    } else if (d.length === 16) {
      formattedParams.departure_date = `${d}:00`;
    }
  }

  const res = await api.get<any>("public/trips/search/available-trips", {
    params: formattedParams,
  });

  const data = res.data?.data?.departure_trips?.data 
    ?? res.data?.data?.data 
    ?? res.data?.data 
    ?? res.data;

  return Array.isArray(data) ? data : [];
};

/** GET /public/trips/view/:id */
export const getTripById = async (id: string | number): Promise<Trip> => {
  const res = await api.get<any>(`public/trips/view/${id}`);
  return res.data?.data ?? res.data;
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
  return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
};

/** GET /driver/trips/:id — single trip for driver */
export const getDriverTripById = async (id: string | number): Promise<Trip> => {
  const res = await api.get<any>(`driver/trips/${id}`);
  return res.data?.data ?? res.data;
};

/** POST /driver/trips */
export const createTrip = async (data: any): Promise<{ status: string; message: string }> => {
  const res = await api.post<{ status: string; message: string }>("driver/trips", data);
  return res.data;
};

/** POST /client/bookings */
export const bookTrip = async (data: { trip_id: number | string; seats_booked: number }): Promise<any> => {
  const res = await api.post("client/bookings", data);
  return res.data;
};

/** GET /client/booking — all bookings for client */
export const getClientBookings = async (): Promise<Booking[]> => {
  const res = await api.get<any>("client/booking");
  return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
};

/** GET /client/trips/booking/:id — specific booking details */
export const getClientBookingById = async (id: string | number): Promise<Booking> => {
  const res = await api.get<any>(`client/trips/booking/${id}`);
  return res.data?.data ?? res.data;
};
