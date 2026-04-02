import { useQuery } from "@tanstack/react-query";
import { getBalance, getTransactionHistory, Transaction } from "../actions/actions";

export const useBalance = () =>
  useQuery({
    queryKey: ["balance"],
    queryFn: getBalance,
  });

export const useTransactions = () =>
  useQuery<Transaction[], Error>({
    queryKey: ["transactions"],
    queryFn: getTransactionHistory,
  });

/** Helper to download blob as file */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
