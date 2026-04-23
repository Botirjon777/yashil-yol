import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPublicTrips,
  getAllPublicTrips,
  searchTrips,
  getTripById,
  getClientInprogressTrips,
  getClientCompletedTrips,
  getClientCanceledTrips,
  getDriverActiveTrips,
  getDriverCompletedTrips,
  getDriverCanceledTrips,
  getDriverAllTrips,
  getDriverTripById,
  createTrip,
  bookTrip,
  getClientBookings,
  getClientBookingById,
  cancelTrip,
  cancelClientBooking,
  addPassengerToBooking,
  removePassengerFromBooking,
} from "../actions/actions";
import { Trip, TripSearchParams, CreateTripRequest, Booking } from "../types";
import { PaginatedTrips } from "../actions/actions";
import { toast } from "sonner";

/** Paginated list of public trips */
export const usePublicTrips = (page = 1) =>
  useQuery<PaginatedTrips, Error>({
    queryKey: ["public-trips", page],
    queryFn: () => getPublicTrips(page),
  });

export const useAllPublicTrips = (enabled = true) =>
  useQuery<Trip[], Error>({
    queryKey: ["all-public-trips"],
    queryFn: getAllPublicTrips,
    enabled,
  });

/** Search available trips with filters */
export const useSearchTrips = (params: TripSearchParams, enabled = true) =>
  useQuery<Trip[], Error>({
    queryKey: ["search-trips", params],
    queryFn: () => searchTrips(params),
    enabled,
  });

/** Single trip by id */
export const useTripById = (id: string | number | null) =>
  useQuery<Trip, Error>({
    queryKey: ["trip", id],
    queryFn: () => getTripById(id!),
    enabled: id !== null && id !== undefined,
  });

// ─── Client (Passenger) Trips ────────────────────────────────────────────────

export const useClientInprogressTrips = () =>
  useQuery<Trip[], Error>({
    queryKey: ["client-trips", "inprogress"],
    queryFn: getClientInprogressTrips,
  });

export const useClientCompletedTrips = () =>
  useQuery<Trip[], Error>({
    queryKey: ["client-trips", "completed"],
    queryFn: getClientCompletedTrips,
  });

export const useClientCanceledTrips = () =>
  useQuery<Trip[], Error>({
    queryKey: ["client-trips", "canceled"],
    queryFn: getClientCanceledTrips,
  });

// ─── Driver Trips ─────────────────────────────────────────────────────────────

export const useDriverActiveTrips = () =>
  useQuery<Trip[], Error>({
    queryKey: ["driver-trips", "active"],
    queryFn: getDriverActiveTrips,
  });

export const useDriverCompletedTrips = () =>
  useQuery<Trip[], Error>({
    queryKey: ["driver-trips", "completed"],
    queryFn: getDriverCompletedTrips,
  });

export const useDriverCanceledTrips = () =>
  useQuery<Trip[], Error>({
    queryKey: ["driver-trips", "canceled"],
    queryFn: getDriverCanceledTrips,
  });

export const useDriverAllTrips = () =>
  useQuery<Trip[], Error>({
    queryKey: ["driver-trips", "all"],
    queryFn: getDriverAllTrips,
  });

export const useDriverTripById = (id: string | number | null) =>
  useQuery<Trip, Error>({
    queryKey: ["driver-trips", "detail", id],
    queryFn: () => getDriverTripById(id!),
    enabled: id !== null && id !== undefined,
  });

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTripRequest) => createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
    },
  });
};

export const useBookTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { trip_id: number | string; seats_booked?: number; passengers?: { name: string; phone: string }[]; payment_method?: string }) => bookTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-trips"] });
      queryClient.invalidateQueries({ queryKey: ["trip"] });
      queryClient.invalidateQueries({ queryKey: ["client-bookings"] });
    },
  });
};

export const useClientBookings = () =>
  useQuery<Booking[], Error>({
    queryKey: ["client-bookings"],
    queryFn: getClientBookings,
  });

export const useCancelTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => cancelTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
      toast.success("Trip canceled successfully");
    },
    onError: (err: any) => {
      toast.error(handleError(err));
    },
  });
};

export const useCancelClientBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => cancelClientBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-trips"] });
      queryClient.invalidateQueries({ queryKey: ["trip"] });
      toast.success("Booking canceled successfully");
    },
    onError: (err: any) => {
      toast.error(handleError(err));
    },
  });
};

export const useAddPassenger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string | number; data: { name: string; phone: string } }) =>
      addPassengerToBooking(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip"] });
      queryClient.invalidateQueries({ queryKey: ["client-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
      toast.success("Passenger added successfully");
    },
    onError: (err: any) => {
      toast.error(handleError(err));
    },
  });
};

export const useRemovePassenger = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, passengerId }: { bookingId: string | number; passengerId: string | number }) =>
      removePassengerFromBooking(bookingId, passengerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip"] });
      queryClient.invalidateQueries({ queryKey: ["client-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
      toast.success("Passenger removed successfully");
    },
    onError: (err: any) => {
      toast.error(handleError(err));
    },
  });
};

export const useClientBookingById = (id: string | number | null) =>
  useQuery<Booking, Error>({
    queryKey: ["client-bookings", "detail", id],
    queryFn: () => getClientBookingById(id!),
    enabled: id !== null && id !== undefined,
  });

/** Helper to handle messy API error responses (to prevent React object child error) */
export const handleError = (err: any): string => {
  const data = err.response?.data;
  if (!data) return err.message || "An unexpected error occurred";

  // Case 1: Simple message string
  if (typeof data.message === "string") return data.message;

  // Case 2: Validation errors nested in .errors
  if (typeof data.errors === "object" && data.errors !== null) {
    const firstError = Object.values(data.errors)[0];
    if (Array.isArray(firstError)) return firstError[0];
    if (typeof firstError === "string") return firstError;
  }

  // Case 3: Top-level dictionary of errors (like {"field": ["error"]})
  if (typeof data === "object" && data !== null) {
    const values = Object.values(data);
    if (values.length > 0) {
      const firstValue = values[0];
      if (Array.isArray(firstValue)) return firstValue[0];
      if (typeof firstValue === "string") return firstValue;
    }
  }

  // Fallback to stringifying if it's still an object
  if (typeof data.message === "object") {
    return JSON.stringify(data.message);
  }

  return data.message || err.message || "An unexpected error occurred";
};
