'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { storage } from '@/lib/storage';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    accountType: 'startup' | 'professional';
    title?: string;
    bio?: string;
    location?: string;
    website?: string;
    role: 'user' | 'admin';
    linkedin?: string;
    twitter?: string;
    github?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    company?: string;
    position?: string;
    industry?: string;
    fundingStage?: string;
    teamSize?: string;
}

interface AuthContextType {
    user: User | null;
    userProfile: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }
        checkAuth();
    }, []);

    const checkAuth = async () => {
        // Double check we're on client side
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }

        try {
            const token = storage.get('access_token');
            if (token) {
                // If offline demo token
                if (token.startsWith('demo-offline-token-')) {
                    setUser({
                        id: 'demo-user-id',
                        name: 'Demo Founder (Offline)',
                        email: 'demo@startlabx.com',
                        accountType: 'startup',
                        role: 'user',
                        company: 'Future Inc (Demo)',
                        industry: 'AI & Robotics',
                        title: 'CEO',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                        bio: 'This is a demo account running in offline mode.'
                    });
                    setLoading(false);
                    return;
                }

                try {
                    const response = await authService.getCurrentUser();
                    const userData = response.data;
                    setUser({
                        id: userData._id || userData.id,
                        name: userData.name,
                        email: userData.email,
                        avatar: userData.avatar,
                        accountType: userData.accountType,
                        bio: userData.bio,
                        location: userData.location,
                        website: userData.website,
                        skills: userData.skills,
                        experience: userData.experience,
                        company: userData.companyName,
                        position: userData.title,
                        industry: userData.industry,
                        role: userData.role,
                    });
                } catch (apiError) {
                    console.error('API User fetch failed:', apiError);
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            storage.set('access_token', response.data.token);
            if (response.data.refreshToken) {
                storage.set('refresh_token', response.data.refreshToken);
            }
            const userData = response.data.user;
            setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                avatar: userData.avatar,
                accountType: userData.accountType,
                role: userData.role,
            });
        } catch (error: any) {
            // FALLBACK FOR DEMO USER ONLY
            // If the backend is unreachable or fails for the demo user, forcing a client-side login
            if (email === 'demo@startlabx.com' || email.startsWith('guest-')) {
                console.warn("Backend login failed for demo user. Activating Offline Demo Mode.", error);

                const mockToken = 'demo-offline-token-' + Date.now();
                storage.set('access_token', mockToken);

                setUser({
                    id: 'demo-user-id',
                    name: email.startsWith('guest-') ? 'Guest Founder' : 'Demo Founder',
                    email: email,
                    accountType: 'startup',
                    role: 'user',
                    company: 'Future Inc (Demo)',
                    industry: 'AI & Robotics',
                    title: 'CEO',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                    bio: 'This is a demo account running in offline mode.'
                });
                return; // Return successfully
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            storage.remove('access_token');
            storage.remove('refresh_token');
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider value={{ user, userProfile: user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
