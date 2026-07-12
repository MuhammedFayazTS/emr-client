import axios, { AxiosError } from 'axios';
import type { ApiError } from './types';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        const normalized: ApiError = {
            message: error.response?.data?.message ?? error.message,
            status: error.response?.status,
        };
        return Promise.reject(normalized);
    }
);