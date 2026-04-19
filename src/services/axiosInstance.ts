import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  clearTokens,
  getAccessToken,
} from "@/lib/tokenManager";
import { getSessionRole } from "@/lib/sessionStore";
import { emitSessionExpired } from "@/commons/utils/session-expiry";
import type { CommonError } from "@/services/type";

const DEFAULT_API_BASE_URL = "http://localhost:6002";
const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || "/";
const AUTH_EXCLUDED_URLS: string[] = [];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers['X-User-Role'] = getSessionRole();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터
 * 401 에러 발생 시 토큰 갱신을 시도하고, 실패 시 로그아웃 처리합니다.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<CommonError>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const requestUrl = originalRequest?.url ?? '';

    // refresh 대상 제외
    if (AUTH_EXCLUDED_URLS.includes(requestUrl)) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      handleSessionExpiry('세션이 만료되었습니다. 다시 로그인 해주세요.');
    }

    return Promise.reject(error);
  },
);

function handleSessionExpiry(message: string) {
  clearTokens();
  if (typeof window !== "undefined" && window.location.pathname !== LOGIN_PATH) {
    emitSessionExpired({
      message,
      redirectPath: LOGIN_PATH,
    });
  }
}

export default axiosInstance;
