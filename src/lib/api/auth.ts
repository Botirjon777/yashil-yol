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
  MeResponse,
  UpdateProfileRequest,
  AuthUser,
  BecomeDriverRequest,
  UploadDocumentsRequest,
  UploadCarImagesRequest,
} from "@/src/features/auth/types";

/** POST /auth/register */
export const register = async (data: RegisterRequest): Promise<RegistrationResponse> => {
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
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
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

/** POST /auth/logout  (requires auth token) */
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

/** POST /auth/refresh  (requires auth token) */
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
  // Use FormData for file upload if image is present
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

/** POST /auth/become-a-driver */
export const becomeDriver = async (data: BecomeDriverRequest): Promise<{ status: string; message: string }> => {
  const res = await api.post("/auth/become-a-driver", data);
  return res.data;
};

/** POST /auth/upload-driver-passport-driving-licence */
export const uploadDriverDocuments = async (data: UploadDocumentsRequest): Promise<{ status: string; message: string }> => {
  const formData = new FormData();
  formData.append("driving_licence_front", data.driving_licence_front);
  formData.append("driving_licence_back", data.driving_licence_back);
  formData.append("driver_passport_image", data.driver_passport_image);

  const res = await api.post("/auth/upload-driver-passport-driving-licence", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/** POST /auth/upload-car-images */
export const uploadCarImages = async (data: UploadCarImagesRequest): Promise<{ status: string; message: string }> => {
  const formData = new FormData();
  formData.append("vehicle_id", String(data.vehicle_id));
  formData.append("tech_passport_front", data.tech_passport_front);
  formData.append("tech_passport_back", data.tech_passport_back);
  
  data.car_images.forEach((image, index) => {
    formData.append(`car_images[${index}]`, image);
  });

  const res = await api.post("/auth/upload-car-images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
