import api from "@/src/lib/axios";

export interface Card {
  id: number;
  last4: string;
  brand: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
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
  cvv: string;
  holder_name: string;
  phone: string;
}

export interface VerifyCardRequest {
  card_id: number;
  code: string;
}

export interface CreatePaymentRequest {
  card_id: number;
  amount: number;
}

export interface ConfirmPaymentRequest {
  payment_id: number;
  code: string;
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
export const addCard = async (data: AddCardRequest): Promise<{ status: string; message: string; data: { card_id: number } }> => {
  try {
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
    const res = await api.post("bank/verify-card", data);
    console.log("verifyCard response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("verifyCard error:", error.response?.data || error.message);
    throw error;
  }
};

/** POST /bank/create-payment */
export const createPayment = async (data: CreatePaymentRequest): Promise<{ status: string; message: string; data: { payment_id: number } }> => {
  try {
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
export const deleteCard = async (id: number): Promise<{ status: string; message: string }> => {
  try {
    const res = await api.delete(`bank/delete-card/${id}`);
    console.log("deleteCard response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("deleteCard error:", error.response?.data || error.message);
    throw error;
  }
};
