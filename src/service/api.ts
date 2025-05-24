// src/services/api.ts
import axios from 'axios';
import { InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:3000/';

// Instância sem autenticação
export const apiPublic = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Instância com Bearer Token
export const apiPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
         Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
    },
});

// Interceptor de resposta para tratar 401
apiPrivate.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          // 🚀 Tenta renovar o token (ex: usando refresh token ou re-login automático)
        //   const { data } = await apiPublic.post('/auth/refresh-token');
        // //   localStorage.setItem('token', data.token);
  
        //   // 🛠️ Atualiza header da nova request
        //   apiPrivate.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        //   originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
  
          return apiPrivate(originalRequest); // refaz a chamada original
          
        } catch (refreshError) {
          // ❌ Falhou novamente → desloga
          console.error('Erro ao renovar token:', refreshError);
          localStorage.removeItem('token');
          window.location.href = '/login'; // ou use navigate('/login')
        }
      }
  
      return Promise.reject(error);
    }
  );
