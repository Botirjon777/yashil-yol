import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPublicTrips,
  getAllPublicTrips,
  searchTrips,
  getTripById,
  createTrip,
  bookTrip,
  addPassengerToBooking,
  removePassengerFromBooking,
  searchTripsByRegion,
} from "../actions/actions";
import {
  getClientInprogressTrips,
  getClientCompletedTrips,
  getClientCanceledTrips,
  getClientBookings,
  getClientBookingById,
  cancelClientBooking,
} from "../../dashboard/actions/clientTrips";
import {
  getDriverActiveTrips,
  getDriverCompletedTrips,
  getDriverCanceledTrips,
  getDriverAllTrips,
  getDriverTripById,
  cancelTrip,
} from "../../dashboard/actions/driverTrips";
import { Trip, TripSearchParams, CreateTripRequest, Booking } from "../types";
import { PaginatedTrips } from "../actions/actions";
import { toast } from "sonner";

/** Paginated list of public trips */
export const usePublicTrips = (page = 1, perPage = 20) =>
  useQuery<PaginatedTrips, Error>({
    queryKey: ["public-trips", page, perPage],
    queryFn: () => getPublicTrips(page, perPage),
  });

export const useAllPublicTrips = (enabled = true) =>
  useQuery<Trip[], Error>({
    queryKey: ["all-public-trips"],
    queryFn: getAllPublicTrips,
    enabled,
  });

/** Search available trips with filters */
export const useSearchTrips = (params: TripSearchParams, enabled = true) =>
  useQuery<PaginatedTrips, Error>({
    queryKey: ["search-trips", params],
    queryFn: () => searchTrips(params),
    enabled,
  });

export const useSearchTripsByRegion = (start_id: string, end_id: string, page = 1, perPage = 20, enabled = true) =>
  useQuery<PaginatedTrips, Error>({
    queryKey: ["search-trips-region", start_id, end_id, page, perPage],
    queryFn: () => searchTripsByRegion(start_id, end_id, page, perPage),
    enabled: enabled && !!start_id && !!end_id,
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
    onMutate: async ({ bookingId, passengerId }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["client-bookings"] });
      await queryClient.cancelQueries({ queryKey: ["trip"] });

      // Snapshot the previous value
      const previousBooking = queryClient.getQueryData(["client-bookings", "detail", bookingId]);
      const previousTrip = queryClient.getQueryData(["trip"]);

      // Optimistically update to the new value
      if (previousBooking) {
        queryClient.setQueryData(["client-bookings", "detail", bookingId], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            passengers: (old.passengers || []).filter((p: any) => String(p.id) !== String(passengerId)),
          };
        });
      }

      // Also update the trip if it has the booking inside it
      if (previousTrip) {
        queryClient.setQueryData(["trip"], (old: any) => {
          if (!old || !old.bookings) return old;
          return {
            ...old,
            bookings: old.bookings.map((b: any) => {
              if (String(b.id) === String(bookingId)) {
                return {
                  ...b,
                  passengers: (b.passengers || []).filter((p: any) => String(p.id) !== String(passengerId)),
                };
              }
              return b;
            }),
            available_seats: Number(old.available_seats || 0) + 1,
          };
        });
      }

      return { previousBooking, previousTrip };
    },
    onError: (err: any, variables, context) => {
      // Rollback on error
      if (context?.previousBooking) {
        queryClient.setQueryData(["client-bookings", "detail", variables.bookingId], context.previousBooking);
      }
      if (context?.previousTrip) {
        queryClient.setQueryData(["trip"], context.previousTrip);
      }
      toast.error(handleError(err));
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success to keep server in sync
      queryClient.invalidateQueries({ queryKey: ["client-bookings", "detail", variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ["trip"] });
      queryClient.invalidateQueries({ queryKey: ["client-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
    },
    onSuccess: () => {
      toast.success("Passenger removed successfully");
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
