import { apiClient } from '@/lib/api-client';

export interface Usage {
    aiCredits: number;
    pitchDecks: number;
    mvpPlans: number;
    contracts: number;
    teamMembers: number;
    storage: number;
}

export interface Subscription {
    id: string;
    userId: string;
    plan: string;
    planId: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    interval: 'month' | 'year';
    popular: boolean;
    features: string[];
    limits: {
        aiCredits: number | 'unlimited';
        pitchDecks: number | 'unlimited';
        mvpPlans: number | 'unlimited';
        contracts: number | 'unlimited';
        teamMembers: number | 'unlimited';
        storage: number | 'unlimited';
        prioritySupport: boolean;
        customBranding: boolean;
        apiAccess: boolean;
    };
}

import { PLANS } from '@/constants/plans';

export const subscriptionService = {
    getSubscription: () =>
        apiClient.get<Subscription>('/api/subscription').then(res => res.data),

    getCurrentSubscription: () =>
        apiClient.get<Subscription>('/api/subscription').then(res => res.data),

    getPlans: () =>
        apiClient.get<SubscriptionPlan[]>('/api/subscription/plans').then(res => res.data),

    subscribe: (planId: string) =>
        apiClient.post<{ url: string }>('/api/subscription/subscribe', { planId }).then(res => res.data),

    cancelSubscription: (feedback?: boolean) =>
        apiClient.post('/api/subscription/cancel', { feedback }).then(res => res.data),

    canUseFeature: async (feature: string) => {
        try {
            const { data } = await apiClient.get<{ allowed: boolean }>(`/api/subscription/check?feature=${feature}`);
            return data.allowed;
        } catch (e) {
            return false;
        }
    },

    getUsage: () =>
        apiClient.get<Usage>('/api/subscription/usage').then(res => res.data),

    createPortalSession: () =>
        apiClient.post<{ url: string }>('/api/subscription/portal').then(res => res.data),

    getPlanById: (planId: string) => PLANS.find(p => p.id === planId),

    // Helper to check if value is unlimited
    isUnlimited: (val: any) => val === -1 || val === 'unlimited'
};

export default subscriptionService;
