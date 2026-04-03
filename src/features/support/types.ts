export interface SupportRequest {
  name: string;
  email: string;
  message: string;
}

export interface SupportResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    message: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}
