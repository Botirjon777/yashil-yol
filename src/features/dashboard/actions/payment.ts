import api from "@/src/lib/axios";

export interface Card {
  id: number;
  card_id: string;
  number: string; // Masked number like "5614 **** **** 0797"
  label: string; // Card holder or label
  expiry: string; // "MMYY" e.g. "0626"
  status: "verified" | "not_verified";
  is_default: number | boolean;
  phone: string;
  brand?: string; // Optional if backend doesn't provide it
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  type: "income" | "outcome";
  description?: string;
  created_at: string;
}

export interface AddCardRequest {
  number: string;
  expiry: string; // MMYY (4 characters)
  holder_name: string;
  phone: string;
}

export interface VerifyCardRequest {
  id: string | number;
  card_key: string;
  confirm_code: string;
}

export interface CreatePaymentRequest {
  card_id: string;
  amount: string;
}

export interface ConfirmPaymentRequest {
  pay_id: string;
  confirm_code: string;
}

export interface BalanceResponse {
  balance: string;
}

export interface Withdraw {
  id: number;
  user_id: number;
  amount: string;
  card_id: string;
  card_holder: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface CreateWithdrawRequest {
  amount: number | string;
  card_id: string | number;
  card_holder: string;
}

/** GET /bank/my-registered-cards */
export const getCards = async (): Promise<Card[]> => {
  try {
    const res = await api.get<{ cards: Card[] }>("bank/my-registered-cards");
    return res.data?.cards || [];
  } catch (error: any) {
    throw error;
  }
};

/** POST /bank/add-card */
export const addCard = async (data: AddCardRequest): Promise<{ status: string; message: string; card: { id: number; label: string; phone: string; key: string } }> => {
  try {
    const res = await api.post("bank/add-card", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/** POST /bank/verify-card */
export const verifyCard = async (data: VerifyCardRequest): Promise<{ status: string; message: string }> => {
  try {
    const res = await api.post("bank/verify-card", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/** POST /bank/create-payment */
export const createPayment = async (data: CreatePaymentRequest): Promise<{ status: string; message: string; pay_id: string; confirmation?: string }> => {
  try {
    const res = await api.post("bank/create-payment", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/** POST /bank/resend-sms */
export const resendSms = async (data: { pay_id?: string; card_id?: string }): Promise<{ status: string; message: string }> => {
  try {
    const res = await api.post("bank/resend-sms", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/** POST /bank/confirm-payment */
export const confirmPayment = async (data: ConfirmPaymentRequest): Promise<{ status: string; message: string }> => {
  try {
    const res = await api.post("bank/confirm-payment", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/** POST /bank/get-balance */
export const getBalance = async (): Promise<BalanceResponse> => {
  try {
    const res = await api.post<BalanceResponse>("bank/get-balance");
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/** GET /user/balance-transactions */
export const getTransactionHistory = async (): Promise<Transaction[]> => {
  try {
    const res = await api.get<{ data: Transaction[] }>("user/balance-transactions");
    return res.data?.data || [];
  } catch (error: any) {
    throw error;
  }
};

/** DELETE /bank/delete-card/{id} */
export const deleteCard = async (id: number | string): Promise<{ status: string; message: string }> => {
  try {
    const res = await api.delete(`bank/delete-card/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/** GET /withdraw */
export const getWithdrawals = async (): Promise<Withdraw[]> => {
  try {
    const res = await api.get<{ data: Withdraw[] }>("withdraw");
    return res.data?.data || [];
  } catch (error: any) {
    throw error;
  }
};

/** POST /withdraw */
export const createWithdraw = async (data: CreateWithdrawRequest): Promise<{ status: string; message: string }> => {
  try {
    const res = await api.post("withdraw", data);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
