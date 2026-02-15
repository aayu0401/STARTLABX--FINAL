import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AppState {
    // UI State
    isProcessing: boolean;
    sidebarCollapsed: boolean;

    // Realtime State
    activeUsers: string[];
    unreadMessagesCount: number;

    // Actions
    setProcessing: (status: boolean) => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setActiveUsers: (users: string[]) => void;
    setUnreadCount: (count: number) => void;
    incrementUnreadCount: () => void;
}

export const useAppStore = create<AppState>()(
    (set) => ({
        isProcessing: false,
        sidebarCollapsed: false,
        activeUsers: [],
        unreadMessagesCount: 0,

        setProcessing: (status) => set({ isProcessing: status }),
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
        setActiveUsers: (users) => set({ activeUsers: users }),
        setUnreadCount: (count) => set({ unreadMessagesCount: count }),
        incrementUnreadCount: () => set((state) => ({ unreadMessagesCount: state.unreadMessagesCount + 1 })),
    })
);
