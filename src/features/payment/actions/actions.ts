import api from "@/src/lib/axios";

export interface BalanceResponse {
  balance: string; // decimal from backend
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: string;
  type: "credit" | "debit";
  reason?: string;
  balance_before: string;
  balance_after: string;
  booking?: any;
  trip?: any;
  status: string;
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
  console.log("getTransactionHistory - API Response:", res.data);
  return res.data?.data || [];
};

/** GET /user/balance-transactions/pdf */
export const getTransactionsPdf = async (): Promise<Blob> => {
  const res = await api.get("/user/balance-transactions/pdf", {
    responseType: "blob",
  });
  return res.data;
};

/** GET /user/balance-transactions/pdf/:id */
export const getSingleTransactionPdf = async (id: number | string): Promise<Blob> => {
  const res = await api.get(`/user/balance-transactions/pdf/${id}`, {
    responseType: "blob",
  });
  return res.data;
};
