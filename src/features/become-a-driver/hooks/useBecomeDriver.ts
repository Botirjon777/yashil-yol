import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  becomeDriver,
  uploadDriverDocuments,
  uploadCarImages,
} from "../actions/actions";
import {
  BecomeDriverRequest,
  UploadDocumentsRequest,
  UploadCarImagesRequest,
} from "../../auth/types";

export const useBecomeDriver = () => {
  const qc = useQueryClient();
  return useMutation<{ status: string; message: string }, Error, BecomeDriverRequest>({
    mutationFn: becomeDriver,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
};

export const useUploadDocuments = () => {
  const qc = useQueryClient();
  return useMutation<{ status: string; message: string }, Error, UploadDocumentsRequest>({
    mutationFn: uploadDriverDocuments,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
};

export const useUploadCarImages = () => {
  const qc = useQueryClient();
  return useMutation<{ status: string; message: string }, Error, UploadCarImagesRequest>({
    mutationFn: uploadCarImages,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
};
