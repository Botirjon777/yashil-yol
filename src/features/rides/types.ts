// ─── Ride / Trip types ────────────────────────────────────────────────────────

export interface TripDriver {
  id: number;
  name?: string;
  first_name?: string;
  last_name: string;
  phone?: string;
  role?: string;
  rating?: number;
  avatar?: string;
}

export interface TripVehicle {
  id: number;
  brand?: string;
  model: string;
  color?: string | CarColor | { id: number | string };
  plate_number?: string;
  car_number?: string;
  seats?: number | string;
}

export interface VehicleRequest {
  vehicle_number: string;
  seats: number | string;
  car_color_id: number | string;
  tech_passport_number: string;
  car_model: string;
}

export interface CarColor {
  id: number | string;
  name?: string;
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  code?: string;
}

export interface Trip {
  id: number;
  driver_id: number;
  vehicle_id: number;
  
  // Standard naming
  start_region_id?: number;
  end_region_id?: number;
  start_district_id?: number;
  end_district_id?: number;
  start_quarter_id?: number;
  end_quarter_id?: number;

  // Alternative naming from dashboard API
  from_region_id?: number;
  to_region_id?: number;
  from_district_id?: number;
  to_district_id?: number;
  from_quarter_id?: number;
  to_quarter_id?: number;

  start_time: string;
  end_time?: string;
  duration?: string;
  price_per_seat: number | string;
  total_seats: number;
  available_seats: number;
  start_lat?: string;
  start_long?: string;
  end_lat?: string;
  end_long?: string;
  status: "active" | "completed" | "canceled" | string;
  
  // Relations (if included in response)
  driver?: TripDriver;
  vehicle?: TripVehicle;
  start_region?: any; // Can be object or string now
  end_region?: any;
  start_district?: any;
  end_district?: any;
  start_quarter?: any;
  end_quarter?: any;
  starting_point?: { id: number; lat: string; long: string };
  ending_point?: { id: number; lat: string; long: string };
  bookings?: Booking[];
}

export interface Booking {
  id: number;
  trip_id: number;
  user_id: number;
  seats_booked: number;
  total_price: string;
  status: "pending" | "confirmed" | "canceled" | "active" | string;
  created_at: string;
  trip?: Trip;
  passengers?: { name: string; phone: string; id?: number }[];
}

export interface TripSearchParams {
  start_region_id?: number | string;
  end_region_id?: number | string;
  start_district_id?: number | string;
  end_district_id?: number | string;
  start_quarter_id?: string | number;
  end_quarter_id?: string | number;
  departure_date?: string; // YYYY-MM-DD
  passengers?: number;
}

export interface CreateTripRequest {
  start_time: string; // Y-m-d H:i:s
  end_time: string; // Y-m-d H:i:s
  price_per_seat: number | string;
  available_seats: number | string;
  start_lat: number | string;
  start_long: number | string;
  end_lat: number | string;
  end_long: number | string;
  start_region_id: string | number;
  end_region_id: string | number;
  start_district_id: string | number;
  end_district_id: string | number;
  start_quarter_id?: string | number;
  end_quarter_id?: string | number;
  vehicle_id?: string | number;
}
