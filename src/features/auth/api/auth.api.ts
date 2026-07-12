import { axiosInstance } from '@/shared/api/axiosInstance';
import type { ApiSuccessResponse } from '@/shared/api/types';
import type { LoginFormInput } from '../validation/auth.schema';
import type { LoginResponse, User } from '../types/auth.types';

export const authApi = {
    login: async (payload: LoginFormInput): Promise<LoginResponse> => {
        const body = {
            ...payload,
            userAgent: navigator.userAgent, // backend expects this in the body
        };
        const res = await axiosInstance.post<ApiSuccessResponse<LoginResponse>>(
            '/auth/login',
            body,
            { withCredentials: true } // required so Set-Cookie is stored
        );
        return res.data.data;
    },

    logout: async (): Promise<void> => {
        await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    },

    getMe: async (): Promise<User> => {
        const res = await axiosInstance.get<ApiSuccessResponse<{ user: User }>>(
            '/auth/me',
            { withCredentials: true }
        );
        return res.data.data.user;
    },
};