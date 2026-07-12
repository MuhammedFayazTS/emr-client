import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
});

// Separate instance for the refresh call itself — avoids recursively
// triggering this same interceptor if /auth/refresh ever returns 401.
const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

type FailedRequest = {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Called after refresh settles — flush all requests that were waiting
function processQueue(error: unknown | null) {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
}

// Let callers (e.g. useLogout, ProtectedRoutes) know refresh failed for good,
// without axiosInstance importing router/query-client directly (keeps this file dependency-free).
type SessionExpiredHandler = () => void;
let onSessionExpired: SessionExpiredHandler | null = null;

export function setSessionExpiredHandler(handler: SessionExpiredHandler) {
    onSessionExpired = handler;
}

// Marks a request so we don't retry it more than once
interface RetryableConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as RetryableConfig;

        const status = error.response?.status;
        const isAuthEndpoint =
            originalRequest?.url?.includes('/auth/login') ||
            originalRequest?.url?.includes('/auth/refresh');

        // Only attempt refresh on 401s, never for the login/refresh calls themselves,
        // and never retry a request more than once.
        if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
            if (isRefreshing) {
                // A refresh is already in flight — queue this request until it resolves
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch((err) => Promise.reject(normalizeError(err)));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await refreshClient.get('/auth/refresh');
                processQueue(null);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                onSessionExpired?.(); // e.g. clear query cache + redirect to /login
                return Promise.reject(normalizeError(refreshError as AxiosError<ApiError>));
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(normalizeError(error));
    }
);

function normalizeError(error: AxiosError<ApiError>): ApiError {
    return {
        message: error.response?.data?.message ?? error.message,
        status: error.response?.status,
    };
}