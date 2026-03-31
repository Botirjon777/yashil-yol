import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addVehicle, getCarColors, getVehicles } from "../actions/actions";
import { VehicleRequest, CarColor } from "@/src/features/rides/types";
import { CAR_COLORS } from "../constants/colors";

export const useAddVehicle = () => {
  const qc = useQueryClient();
  return useMutation<{ status: string; message: string; data?: { id: number } }, Error, VehicleRequest>({
    mutationFn: addVehicle,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
};

export const useCarColors = () =>
  useQuery<CarColor[], Error>({
    queryKey: ["car-colors"],
    queryFn: getCarColors,
    initialData: CAR_COLORS as any,
    staleTime: Infinity,
  });

export const useVehicles = () =>
  useQuery<any[], Error>({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });
