import api from "@/src/lib/axios";
import { VehicleRequest, CarColor, Trip, TripSearchParams, Booking } from "../types";

export interface PaginatedTrips {
  data: Trip[];
  meta: {
    current_page: number;
    last_page: number;
    per_page?: number;
    total: number;
  };
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
  const res = await api.get<any>("public/trips", {
    params: { page },
  });
  
  // Handle the case where the API returns { data: [...], meta: {...} }
  if (res.data?.meta) {
    return res.data;
  }
  
  // Fallback for older/different formats
  return {
    data: res.data?.data || [],
    meta: {
      current_page: res.data?.current_page || 1,
      last_page: res.data?.last_page || 1,
      total: res.data?.total || 0
    }
  };
};

/** GET /public/trips/view — full public list */
export const getAllPublicTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("public/trips/view");
  const data = res.data?.data?.data ?? res.data?.data ?? res.data;
  return Array.isArray(data) ? data : [];
};

/** GET /public/trips/search/available-trips */
export const searchTrips = async (params: TripSearchParams): Promise<Trip[]> => {
  // We build the object explicitly to ensure parameter order (important for some backends)
  const formattedParams: any = {};
  
  if (params.start_region_id) formattedParams.start_region_id = params.start_region_id;
  if (params.end_region_id) formattedParams.end_region_id = params.end_region_id;
  if (params.start_district_id) formattedParams.start_district_id = params.start_district_id;
  if (params.end_district_id) formattedParams.end_district_id = params.end_district_id;
  if (params.start_quarter_id) formattedParams.start_quarter_id = params.start_quarter_id;
  if (params.end_quarter_id) formattedParams.end_quarter_id = params.end_quarter_id;
  if (params.passengers) formattedParams.passengers = params.passengers;

  if (params.departure_date) {
    const d = String(params.departure_date);
    const datePart = d.substring(0, 10); // Extract YYYY-MM-DD
    
    const now = new Date();
    // Get today's date in local YYYY-MM-DD
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    let timePart = "00:00:00";
    if (datePart === todayStr) {
      // For today's searches, we only want upcoming trips
      timePart = now.toTimeString().split(' ')[0];
    }
    
    formattedParams.departure_date = `${datePart} ${timePart}`;
  }

  const res = await api.get<any>("public/trips/search/available-trips", {
    params: formattedParams,
  });

  const data = res.data?.data?.departure_trips?.data 
    ?? res.data?.data?.departure_trips
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

/** POST /client/booking */
export const bookTrip = async (data: { trip_id: number | string; seats_booked?: number; passengers?: { name: string; phone: string }[]; payment_method?: string }): Promise<any> => {
  const res = await api.post("client/booking", data);
  return res.data;
};

/** GET /client/booking — all bookings for client */
export const getClientBookings = async (): Promise<Booking[]> => {
  const res = await api.get<any>("client/booking");
  return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
};

/** GET /client/trips/booking/:id — specific booking details */
export const getClientBookingById = async (id: string | number): Promise<Booking> => {
  console.log(`[API Request] Fetching client booking: /client/trips/booking/${id}`);
  const res = await api.get<any>(`client/trips/booking/${id}`);
  console.log(`[API Response] Client booking ${id}:`, res.data);
  return res.data?.data ?? res.data;
};

/** DELETE /client/booking/cancel/:id — cancel booking (client) */
export const cancelClientBooking = async (id: string | number): Promise<{ status: string; message: string }> => {
  const res = await api.delete<{ status: string; message: string }>(`client/booking/cancel/${id}`);
  return res.data;
};

/** POST /client/booking/:id/add-passenger */
export const addPassengerToBooking = async (bookingId: string | number, data: { name: string; phone: string }): Promise<any> => {
  const res = await api.post(`client/booking/${bookingId}/add-passenger`, data);
  return res.data;
};

/** POST /client/booking/:id/remove-passenger/:passengerId */
export const removePassengerFromBooking = async (bookingId: string | number, passengerId: string | number): Promise<any> => {
  const res = await api.post(`client/booking/${bookingId}/remove-passenger/${passengerId}`);
  return res.data;
};

/** DELETE (via POST override) /driver/trips/cancel-trip/:id — cancel trip (driver) */
export const cancelTrip = async (id: string | number): Promise<{ status: string; message: string }> => {
  const res = await api.post<{ status: string; message: string }>(`driver/trips/cancel-trip/${id}`, { 
    _method: 'DELETE' 
  });
  return res.data;
};
