import api from "@/src/lib/axios";

export interface BalanceResponse {
  balance: string; // decimal from backend
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  type: "income" | "outcome";
  description?: string;
  created_at: string;
}

/** POST /bank/get-balance */
export const getBalance = async (): Promise<BalanceResponse> => {
  const res = await api.post<BalanceResponse>("/bank/get-balance");
  return res.data;
};

/** GET /user/balance-transactions */
export const getTransactionHistory = async (): Promise<Transaction[]> => {
  const res = await api.get<{ data: Transaction[] }>("/user/balance-transactions");
  return res.data.data;
};
