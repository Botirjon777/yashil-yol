import api from "@/src/lib/axios";
import {
  VehicleRequest,
  CarColor,
  Trip,
  TripSearchParams,
  Booking,
} from "../types";

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
export const addVehicle = async (
  data: VehicleRequest,
): Promise<{ status: string; message: string; data?: { id: number } }> => {
  const res = await api.post<{
    status: string;
    message: string;
    data: { id: number };
  }>("vehicles", data);
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
  return Array.isArray(res.data)
    ? res.data
    : (res.data as { data: CarColor[] }).data;
};

/** GET /public/trips — paginated list with less info */
export const getPublicTrips = async (page = 1, per_page = 20): Promise<PaginatedTrips> => {
  const res = await api.get<any>("public/trips", {
    params: { page, per_page },
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
      total: res.data?.total || 0,
    },
  };
};

/** GET /public/trips/view — full public list */
export const getAllPublicTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("public/trips/view");
  const data = res.data?.data?.data ?? res.data?.data ?? res.data;
  return Array.isArray(data) ? data : [];
};

/** GET /public/trips/search/available-trips */
export const searchTrips = async (
  params: TripSearchParams,
): Promise<PaginatedTrips> => {
  // We build the object explicitly to ensure parameter order (important for some backends)
  const formattedParams: any = {};

  if (params.start_region_id)
    formattedParams.start_region_id = params.start_region_id;
  if (params.end_region_id)
    formattedParams.end_region_id = params.end_region_id;
  if (params.start_district_id)
    formattedParams.start_district_id = params.start_district_id;
  if (params.end_district_id)
    formattedParams.end_district_id = params.end_district_id;
  if (params.start_quarter_id)
    formattedParams.start_quarter_id = params.start_quarter_id;
  if (params.end_quarter_id)
    formattedParams.end_quarter_id = params.end_quarter_id;
  if (params.passengers) formattedParams.passengers = params.passengers;
  if (params.page) formattedParams.page = params.page;
  if (params.per_page) formattedParams.per_page = params.per_page;

  if (params.departure_date) {
    const d = String(params.departure_date);
    const datePart = d.substring(0, 10); // Extract YYYY-MM-DD

    const now = new Date();
    // Get today's date in local YYYY-MM-DD
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    let timePart = "00:00:00";
    if (datePart === todayStr) {
      // For today's searches, we only want upcoming trips
      timePart = now.toTimeString().split(" ")[0];
    }

    formattedParams.departure_date = `${datePart} ${timePart}`;
  }

  const res = await api.get<any>("public/trips/search/available-trips", {
    params: formattedParams,
  });

  const data =
    res.data?.data?.departure_trips?.data ??
    res.data?.data?.departure_trips ??
    res.data?.data?.data ??
    res.data?.data ??
    res.data;

  const meta = res.data?.meta || {
    current_page: 1,
    last_page: 1,
    total: Array.isArray(data) ? data.length : 0,
  };

  return {
    data: Array.isArray(data) ? data : [],
    meta,
  };
};

/** POST /public/trips/search/trip-by-region-to-region */
export const searchTripsByRegion = async (
  start_region_id: string,
  end_region_id: string,
  page = 1,
  per_page = 20,
): Promise<PaginatedTrips> => {
  const res = await api.post<any>("public/trips/search/trip-by-region-to-region", {
    start_region_id,
    end_region_id,
    page,
    per_page,
  });

  console.log("Raw Response from Region Search API:", res.data);

  const data =
    res.data?.data?.data ??
    res.data?.data ??
    res.data?.trips ??
    res.data;

  const meta = res.data?.meta || {
    current_page: 1,
    last_page: 1,
    total: Array.isArray(data) ? data.length : 0,
  };

  return {
    data: Array.isArray(data) ? data : [],
    meta,
  };
};

/** GET /public/trips/view/:id */
export const getTripById = async (id: string | number): Promise<Trip> => {
  const res = await api.get<any>(`public/trips/view/${id}`);
  return res.data?.data ?? res.data;
};

/** POST /driver/trips */
export const createTrip = async (
  data: any,
): Promise<{ status: string; message: string }> => {
  const res = await api.post<{ status: string; message: string }>(
    "driver/trips",
    data,
  );
  return res.data;
};

/** POST /client/booking */
export const bookTrip = async (data: {
  trip_id: number | string;
  seats_booked?: number;
  passengers?: {
    name: string;
    phone: string;
    latitude?: string;
    longitude?: string;
  }[];
  payment_method?: string;
}): Promise<any> => {
  const res = await api.post("client/booking", data);
  return res.data;
};

/** POST /client/booking/:id/add-passenger */
export const addPassengerToBooking = async (
  bookingId: string | number,
  data: { name: string; phone: string },
): Promise<any> => {
  const res = await api.post(`client/booking/${bookingId}/add-passenger`, data);
  return res.data;
};

/** POST /client/booking/:id/remove-passenger/:passengerId */
export const removePassengerFromBooking = async (
  bookingId: string | number,
  passengerId: string | number,
): Promise<any> => {
  const res = await api.post(
    `client/booking/${bookingId}/remove-passenger/${passengerId}`,
  );
  return res.data;
};
