"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  accountType: 'startup' | 'professional';
  createdAt: string;
  avatar?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  company?: string;
  position?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  logout: async () => { },
  login: async () => { },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          // Validate token and get user info from backend
          const userInfo = await authService.getUserInfo();
          setUser(userInfo.data);

          // Mock profile for now - will be replaced with actual backend call
          const mockProfile: UserProfile = {
            id: userInfo.data.id,
            fullName: userInfo.data.name,
            email: userInfo.data.email,
            accountType: 'professional',
            createdAt: new Date().toISOString(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.data.name}`,
            bio: 'Building innovative solutions',
            location: 'San Francisco, CA',
            skills: ['React', 'TypeScript', 'Node.js'],
          };
          setUserProfile(mockProfile);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    localStorage.setItem('access_token', response.data.token);
    if (response.data.refreshToken) {
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }

    const userInfo = await authService.getUserInfo();
    setUser(userInfo.data);

    // Mock profile
    const mockProfile: UserProfile = {
      id: userInfo.data.id,
      fullName: userInfo.data.name,
      email: userInfo.data.email,
      accountType: 'professional',
      createdAt: new Date().toISOString(),
    };
    setUserProfile(mockProfile);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    logout,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};