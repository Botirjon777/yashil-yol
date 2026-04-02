import axios from "axios";
import { API_BASE_URL } from "./constants";
import { useAuthStore } from "@/src/providers/AuthProvider";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { token, logout } = useAuthStore.getState();
      if (token) {
        logout();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
