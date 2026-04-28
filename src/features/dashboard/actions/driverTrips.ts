import api from "@/src/lib/axios";
import { Trip } from "../../rides/types";

/** GET /driver/trips — all trips for driver */
export const getDriverAllTrips = async (): Promise<Trip[]> => {
  const res = await api.get<any>("driver/trips");
  return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
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

/** GET /driver/trips/:id — single trip for driver */
export const getDriverTripById = async (id: string | number): Promise<Trip> => {
  const res = await api.get<any>(`driver/trips/${id}`);
  return res.data?.data ?? res.data;
};

/** DELETE (via POST override) /driver/trips/cancel-trip/:id — cancel trip (driver) */
export const cancelTrip = async (
  id: string | number,
): Promise<{ status: string; message: string }> => {
  const res = await api.post<{ status: string; message: string }>(
    `driver/trips/cancel-trip/${id}`,
    {
      _method: "DELETE",
    },
  );
  return res.data;
};
