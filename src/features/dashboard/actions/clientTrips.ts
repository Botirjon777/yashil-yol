import api from "@/src/lib/axios";
import { Trip, Booking } from "../../rides/types";

/** GET /client/booking — all bookings for client */
export const getClientBookings = async (): Promise<Booking[]> => {
  const res = await api.get<any>("client/booking");
  return res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
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

/** GET /client/booking/:id — specific booking details */
export const getClientBookingById = async (
  id: string | number,
): Promise<Booking> => {
  const res = await api.get<any>(`client/booking/${id}`);
  return res.data?.data ?? res.data;
};

/** DELETE /client/booking/cancel/:id — cancel booking (client) */
export const cancelClientBooking = async (
  id: string | number,
): Promise<{ status: string; message: string }> => {
  const res = await api.delete<{ status: string; message: string }>(
    `client/booking/cancel/${id}`,
  );
  return res.data;
};
