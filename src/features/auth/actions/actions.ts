import api from "@/src/lib/axios";
import {
  RegisterRequest,
  LoginRequest,
  VerifyCodeRequest,
  ResendCodeRequest,
  SmsTestRequest,
  SendResetCodeRequest,
  ResetPasswordRequest,
  AuthResponse,
  RegistrationResponse,
  AuthUser,
  UpdateProfileRequest,
} from "../types";

/** POST /auth/register */
export const registerUser = async (data: RegisterRequest): Promise<RegistrationResponse> => {
  const res = await api.post<RegistrationResponse>("/auth/register", data);
  return res.data;
};

/** POST /auth/verify-code */
export const verifyCode = async (data: VerifyCodeRequest): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/verify-code", data);
  return res.data;
};

/** POST /auth/resend-code */
export const resendCode = async (data: ResendCodeRequest): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/auth/resend-code", data);
  return res.data;
};

/** POST /auth/login */
export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};

/** POST /auth/send-sms-as-test */
export const sendSmsAsTest = async (data: SmsTestRequest): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/auth/send-sms-as-test", data);
  return res.data;
};

/** POST /auth/send-reset-code */
export const sendResetCode = async (data: SendResetCodeRequest): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/auth/send-reset-code", data);
  return res.data;
};

/** POST /auth/reset-password */
export const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/auth/reset-password", data);
  return res.data;
};

/** POST /auth/logout */
export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
};

/** POST /auth/refresh */
export const refreshToken = async (): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/refresh");
  return res.data;
};

/** GET /auth/me */
export const getMe = async (): Promise<AuthResponse> => {
  const res = await api.get<AuthResponse>("/auth/me");
  return res.data;
};

/** POST /auth/update-profile */
export const updateProfile = async (data: UpdateProfileRequest): Promise<{ status: string; message: string; user: AuthUser }> => {
  if (data.image instanceof File) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    const res = await api.post("/auth/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  const res = await api.post("/auth/update-profile", data);
  return res.data;
};

/** POST /auth/update-user-language */
export const updateUserLanguage = async (language: string): Promise<{ status: string; message: string }> => {
  const res = await api.post("/auth/update-user-language", { language });
  return res.data;
};
