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
    // A 401 from the login request itself is a normal "wrong credentials"
    // response, not an expired/invalid session - clearing the token and
    // hard-navigating away here would wipe SignIn.tsx's inline error message
    // before it ever renders. Only a protected-route 401 means the session
    // is stale.
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      tokenStorage.clearToken();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
