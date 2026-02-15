import { apiClient } from '@/lib/api-client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    accountType: 'startup' | 'professional';
    // Optional details
    companyName?: string;
    industry?: string;
    title?: string;
    skills?: string;
    availability?: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        accountType: 'startup' | 'professional';
        avatar?: string;
        role: 'user' | 'admin';
    };
}

export const authService = {
    login: (data: LoginRequest) =>
        apiClient.post<AuthResponse>('/api/auth/login', data),

    signup: (data: SignupRequest) =>
        apiClient.post<AuthResponse>('/api/auth/register', data),

    logout: () =>
        apiClient.post('/api/auth/logout'),

    getCurrentUser: () =>
        apiClient.get('/api/auth/me'),

    refreshToken: (refreshToken: string) =>
        apiClient.post<AuthResponse>('/api/auth/refresh', { refreshToken }),

    updateProfile: (data: Partial<any>) =>
        apiClient.put('/api/auth/me/update', data),
};
