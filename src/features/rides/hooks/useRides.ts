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
} from "../actions/actions";
import { Trip, TripSearchParams, CreateTripRequest } from "../types";
import { PaginatedTrips } from "../actions/actions";

/** Paginated list of public trips */
export const usePublicTrips = (page = 1) =>
  useQuery<PaginatedTrips, Error>({
    queryKey: ["public-trips", page],
    queryFn: () => getPublicTrips(page),
  });

/** Full list of all public trips */
export const useAllPublicTrips = () =>
  useQuery<Trip[], Error>({
    queryKey: ["all-public-trips"],
    queryFn: getAllPublicTrips,
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
    mutationFn: (data: { trip_id: number | string; seats_booked: number }) => bookTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-trips"] });
      queryClient.invalidateQueries({ queryKey: ["trip"] });
    },
  });
};
