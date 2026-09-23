import { CurrentUser, CurrentUserResponse } from "@/types/auth";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = async (): Promise<void> => {
  await api.post("/auth/users/refresh-token");
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const isRefreshRequest = originalRequest.url?.includes("/auth/users/refresh-token");

    const isAuthRequest =
      originalRequest.url?.includes("/auth/users/login") ||
      originalRequest.url?.includes("/auth/users/signup") ||
      originalRequest.url?.includes("/auth/users/google-signin");
    // Only handle authentication failures.
    if (
      status !== 401 ||
      originalRequest._retry ||
      isRefreshRequest ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      /*
       * If another request is already refreshing the token,
       * wait for that same refresh request instead of sending
       * multiple refresh requests.
       */
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;

      // Retry the original failed request.
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh token is invalid/expired.
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }

      return Promise.reject(refreshError);
    }
  },
);

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response =
    await api.get<CurrentUserResponse>("/auth/users/current-user");

  return response.data.data;
};
export async function logout(): Promise<void> {
  await api.post("/auth/users/logout");
}
