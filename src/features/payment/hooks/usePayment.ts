import { useQuery } from "@tanstack/react-query";
import { getBalance, getTransactionHistory } from "../actions/actions";

export const useBalance = () =>
  useQuery({
    queryKey: ["balance"],
    queryFn: getBalance,
  });

export const useTransactions = () =>
  useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactionHistory,
  });
