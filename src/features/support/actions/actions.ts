import api from "@/src/lib/axios";
import { SupportRequest, SupportResponse } from "../types";

export const sendSupportMessage = async (data: SupportRequest): Promise<SupportResponse> => {
  const res = await api.post<SupportResponse>("support", data);
  return res.data;
};
