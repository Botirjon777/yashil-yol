import api from "@/src/lib/axios";
import { RegisterRequest, AuthResponse, LoginRequest, ForgotPasswordRequest } from "../types";

export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
  await api.post("/auth/forgot-password", data);
};
