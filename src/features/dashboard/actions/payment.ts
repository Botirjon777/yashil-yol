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

/** GET /bank/my-registered-cards */
export const getCards = async (): Promise<Card[]> => {
  try {
    const res = await api.get<{ cards: Card[] }>("bank/my-registered-cards");
    console.log("getCards response:", res.data);
    return res.data?.cards || [];
  } catch (error: any) {
    console.error("getCards error:", error.response?.data || error.message);
    throw error;
  }
};

/** POST /bank/add-card */
export const addCard = async (data: AddCardRequest): Promise<{ status: string; message: string; data: { id: number; card_key: string } }> => {
  try {
    console.log("addCard - Sending data to backend:", data);
    const res = await api.post("bank/add-card", data);
    console.log("addCard response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("addCard error:", error.response?.data || error.message);
    throw error;
  }
};

/** POST /bank/verify-card */
export const verifyCard = async (data: VerifyCardRequest): Promise<{ status: string; message: string }> => {
  try {
    console.log("verifyCard - Sending data to backend:", data);
    const res = await api.post("bank/verify-card", data);
    console.log("verifyCard response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("verifyCard error:", error.response?.data || error.message);
    throw error;
  }
};

/** POST /bank/create-payment */
export const createPayment = async (data: CreatePaymentRequest): Promise<{ status: string; message: string; data: { pay_id: string } }> => {
  try {
    console.log("createPayment - Sending data to backend:", data);
    const res = await api.post("bank/create-payment", data);
    console.log("createPayment response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("createPayment error:", error.response?.data || error.message);
    throw error;
  }
};

/** POST /bank/confirm-payment */
export const confirmPayment = async (data: ConfirmPaymentRequest): Promise<{ status: string; message: string }> => {
  try {
    console.log("confirmPayment - Sending data to backend:", data);
    const res = await api.post("bank/confirm-payment", data);
    console.log("confirmPayment response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("confirmPayment error:", error.response?.data || error.message);
    throw error;
  }
};

/** POST /bank/get-balance */
export const getBalance = async (): Promise<BalanceResponse> => {
  try {
    const res = await api.post<BalanceResponse>("bank/get-balance");
    console.log("getBalance response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("getBalance error:", error.response?.data || error.message);
    throw error;
  }
};

/** GET /user/balance-transactions */
export const getTransactionHistory = async (): Promise<Transaction[]> => {
  try {
    const res = await api.get<{ data: Transaction[] }>("user/balance-transactions");
    console.log("getTransactionHistory response:", res.data);
    return res.data?.data || [];
  } catch (error: any) {
    console.error("getTransactionHistory error:", error.response?.data || error.message);
    throw error;
  }
};

/** DELETE /bank/delete-card/{id} */
export const deleteCard = async (id: number | string): Promise<{ status: string; message: string }> => {
  try {
    const res = await api.delete(`bank/delete-card/${id}`);
    console.log("deleteCard response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("deleteCard error:", error.response?.data || error.message);
    throw error;
  }
};
