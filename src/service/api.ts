// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ResponseLogin } from '../types/response/login';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiPrivateRefresh = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token dynamic injection
apiPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiPrivateRefresh.interceptors.request.use((config) => {
  const refreshToken = localStorage.getItem('refresh-token');
  if (refreshToken && config.headers) {
    config.headers.Authorization = `Bearer ${refreshToken}`;
  }
  return config;
});

// Logout handler
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh-token');
  window.location.href = '/signin';
};

// Interceptor para refresh automático
apiPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await apiPrivateRefresh.post<ResponseLogin>('auth/refresh');
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refresh-token', data.refreshToken);

        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return apiPrivate(originalRequest); // retry original request
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError);
        handleLogout();
      }
    }

    return Promise.reject(error);
  }
);
