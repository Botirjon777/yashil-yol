import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  forgotPassword,
  logoutUser,
} from "../actions/actions";
import {
  RegisterRequest,
  AuthResponse,
  LoginRequest,
  ForgotPasswordRequest,
} from "../types";

export const useRegister = () => {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: registerUser,
  });
};

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: loginUser,
  });
};

export const useForgotPassword = () => {
  return useMutation<void, Error, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
  });
};

export const useLogout = () => {
  return useMutation<void, Error>({
    mutationFn: logoutUser,
  });
};
