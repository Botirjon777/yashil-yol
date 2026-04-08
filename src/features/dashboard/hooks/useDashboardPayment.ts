import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCards, 
  addCard, 
  verifyCard, 
  createPayment, 
  confirmPayment, 
  deleteCard, 
  AddCardRequest, 
  VerifyCardRequest, 
  CreatePaymentRequest, 
  ConfirmPaymentRequest,
  getBalance,
  getTransactionHistory
} from "../actions/payment";
import { toast } from "sonner";

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

export const useCards = () =>
  useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const data = await getCards();
      return data;
    },
  });

export const useAddCard = () => {
  return useMutation({
    mutationFn: (data: AddCardRequest) => addCard(data),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add card");
    },
  });
};

export const useVerifyCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyCardRequest) => verifyCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Card verified and added successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify card");
    },
  });
};

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => createPayment(data),
    onError: (error: any) => {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || "Payment failed. Please check your card balance and try again.");
    },
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfirmPaymentRequest) => confirmPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Balance topped up successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to confirm payment");
    },
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Card deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete card");
    },
  });
};
