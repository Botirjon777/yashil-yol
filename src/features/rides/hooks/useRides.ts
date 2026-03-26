import { useQuery } from "@tanstack/react-query";
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
} from "../actions/actions";
import { Trip, TripSearchParams } from "../types";
import { PaginatedTrips } from "@/src/lib/api/trips";

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
