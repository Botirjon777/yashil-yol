export interface RegisterRequest {
  first_name: string;
  last_name: string;
  father_name?: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
