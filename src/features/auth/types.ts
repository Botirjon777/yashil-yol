// ─── Requests ────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  father_name?: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface VerifyCodeRequest {
  phone: string;
  code: string;
}

export interface ResendCodeRequest {
  phone: string;
}

export interface SmsTestRequest {
  phone: string;
}

export interface SendResetCodeRequest {
  phone: string;
}

export interface ResetPasswordRequest {
  phone: string;
  code: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

// ─── Responses ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  father_name?: string;
  email?: string;
  phone: string;
  image?: string;
  role: "client" | "driver" | "admin";
  is_verified: boolean;
  driving_verification_status?: "pending" | "verified" | "rejected" | "blocked";
  balance?: {
    balance: string; // Backend decimal
  };
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  father_name?: string;
  email?: string;
  image?: File | string;
}

export interface AuthResponse {
  status: string;
  message: string;
  user: AuthUser;
  authorisation?: {
    token: string;
    type: string;
  };
}

export interface RegistrationResponse {
  status: string;
  message: string;
  user_phone: string;
  code: number;
}

export type MeResponse = AuthUser;
