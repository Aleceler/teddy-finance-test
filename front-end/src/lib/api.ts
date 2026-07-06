import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { useAuthStore } from '../stores/auth.store';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | { message?: string } }>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(new Error(getErrorMessage(error)));
  },
);

function getErrorMessage(
  error: AxiosError<{ message?: string | { message?: string } }>,
): string {
  const message = error.response?.data?.message;

  if (typeof message === 'string') {
    return message;
  }

  if (message && typeof message === 'object' && 'message' in message) {
    const nested = message.message;
    if (typeof nested === 'string') {
      return nested;
    }
  }

  return error.message || 'Request failed';
}
