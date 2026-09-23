import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clearToken();
    }

    return Promise.reject(error);
  },
);
