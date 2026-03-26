import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyCode,
  resendCode,
  sendSmsAsTest,
  sendResetCode,
  resetPassword,
  getMe,
  updateProfile,
  updateUserLanguage,
} from "../actions/actions";
import {
  RegisterRequest,
  LoginRequest,
  VerifyCodeRequest,
  ResendCodeRequest,
  SmsTestRequest,
  SendResetCodeRequest,
  ResetPasswordRequest,
  AuthResponse,
  RegistrationResponse,
  AuthUser,
  UpdateProfileRequest,
  MeResponse,
} from "../types";

// ─── Auth mutations ──────────────────────────────────────────────────────────

export const useRegister = () =>
  useMutation<RegistrationResponse, Error, RegisterRequest>({ mutationFn: registerUser });

export const useLogin = () =>
  useMutation<AuthResponse, Error, LoginRequest>({ mutationFn: loginUser });

export const useVerifyCode = () =>
  useMutation<AuthResponse, Error, VerifyCodeRequest>({ mutationFn: verifyCode });

export const useResendCode = () =>
  useMutation<{ message: string }, Error, ResendCodeRequest>({ mutationFn: resendCode });

export const useSendSmsAsTest = () =>
  useMutation<{ message: string }, Error, SmsTestRequest>({ mutationFn: sendSmsAsTest });

export const useSendResetCode = () =>
  useMutation<{ message: string }, Error, SendResetCodeRequest>({ mutationFn: sendResetCode });

export const useResetPassword = () =>
  useMutation<{ message: string }, Error, ResetPasswordRequest>({ mutationFn: resetPassword });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation<{ status: string; message: string; user: AuthUser }, Error, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
};

export const useUpdateUserLanguage = () =>
  useMutation<{ status: string; message: string }, Error, string>({
    mutationFn: updateUserLanguage,
  });

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation<void, Error>({
    mutationFn: logoutUser,
    onSuccess: () => qc.clear(),
  });
};

// ─── Current user ────────────────────────────────────────────────────────────

export const useMe = (enabled = true) =>
  useQuery<AuthResponse, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    enabled,
    retry: false,
  });
