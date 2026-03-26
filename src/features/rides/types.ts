// ─── Ride / Trip types ────────────────────────────────────────────────────────

export interface TripDriver {
  id: number;
  first_name: string;
  last_name: string;
  phone?: string;
  rating?: number;
  avatar?: string;
}

export interface TripVehicle {
  id: number;
  brand: string;
  model: string;
  color?: string;
  plate_number?: string;
}

export interface Trip {
  id: number;
  driver_id: number;
  vehicle_id: number;
  start_region_id: number;
  end_region_id: number;
  start_district_id: number;
  end_district_id: number;
  start_quarter_id?: number;
  end_quarter_id?: number;
  start_time: string;
  end_time?: string;
  price_per_seat: number;
  total_seats: number;
  available_seats: number;
  status: "active" | "completed" | "canceled" | string;
  
  // Relations (if included in response)
  driver?: TripDriver;
  vehicle?: TripVehicle;
  start_region?: { id: number; name: string; name_uz?: string; name_en?: string };
  end_region?: { id: number; name: string; name_uz?: string; name_en?: string };
  start_district?: { id: number; name: string; name_uz?: string; name_en?: string };
  end_district?: { id: number; name: string; name_uz?: string; name_en?: string };
  bookings?: Booking[];
}

export interface Booking {
  id: number;
  trip_id: number;
  user_id: number;
  seats_booked: number;
  total_price: string;
  status: "pending" | "confirmed" | "canceled" | string;
  created_at: string;
  trip?: Trip;
}

export interface TripSearchParams {
  start_region_id?: number | string;
  end_region_id?: number | string;
  start_district_id?: number | string;
  end_district_id?: number | string;
  start_quarter_id?: number | string;
  end_quarter_id?: number | string;
  departure_date?: string; // YYYY-MM-DD
  passengers?: number;
}
