import { apiClient } from '@/lib/api-client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone?: string;
    dob?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    userType?: 'PROFESSIONAL' | 'STARTUP_OWNER';
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
    };
}

export const authService = {
    login: (data: LoginRequest) =>
        apiClient.post<AuthResponse>('/api/auth/login', data),

    register: (data: RegisterRequest) =>
        apiClient.post<AuthResponse>('/api/auth/register', data),

    logout: () =>
        apiClient.post('/api/auth/logout'),

    validate: () =>
        apiClient.get('/api/auth/validate'),

    refresh: (refreshToken: string) =>
        apiClient.post<AuthResponse>('/api/auth/refresh', { refreshToken }),

    getUserInfo: () =>
        apiClient.get('/api/auth/user-info'),

    updateProfile: (data: any) =>
        apiClient.put('/api/auth/update-user', data),

    changePassword: (data: { oldPassword: string; password: string }) =>
        apiClient.put('/api/auth/change-password', data),

    initiatePasswordReset: (email: string) =>
        apiClient.post('/api/auth/initiate-password-reset', { to: email }),

    resetPassword: (token: string, password: string) =>
        apiClient.post('/api/auth/reset-password', { token, password }),

    verifyEmail: (token: string) =>
        apiClient.get(`/api/auth/verify-email?token=${token}`),

    resendVerification: (email: string) =>
        apiClient.post('/api/auth/resend-verification', { to: email }),
};
