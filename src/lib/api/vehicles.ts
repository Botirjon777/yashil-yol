import api from "@/src/lib/axios";
import { VehicleRequest, CarColor } from "@/src/features/rides/types";

/** POST /vehicles */
export const addVehicle = async (data: VehicleRequest): Promise<{ status: string; message: string; data?: { id: number } }> => {
  const res = await api.post<{ status: string; message: string; data: { id: number } }>("/vehicles", data);
  return res.data;
};

/** GET /car-colors */
export const getCarColors = async (): Promise<CarColor[]> => {
  const res = await api.get<CarColor[] | { data: CarColor[] }>("/car-colors");
  return Array.isArray(res.data) ? res.data : (res.data as { data: CarColor[] }).data;
};
