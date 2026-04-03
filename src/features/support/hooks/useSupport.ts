import { useMutation } from "@tanstack/react-query";
import { sendSupportMessage } from "../actions/actions";
import { SupportRequest, SupportResponse } from "../types";
import { toast } from "sonner";
import { useLanguageStore } from "@/src/providers/LanguageProvider";

export const useSendSupportMessage = () => {
  const { t } = useLanguageStore();

  return useMutation<SupportResponse, Error, SupportRequest>({
    mutationFn: sendSupportMessage,
    onSuccess: (data) => {
      toast.success(data.message || t("support", "success") || "Message sent successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message || "Failed to send message";
      toast.error(errorMessage);
    },
  });
};
