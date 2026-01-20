import apiClient from '../lib/api-client';

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    interval: 'month' | 'year';
    currency: string;
    features: string[];
    limits: {
        aiCredits: number;
        pitchDecks: number;
        mvpPlans: number;
        contracts: number;
        teamMembers: number;
        storage: number; // GB
        prioritySupport: boolean;
        customBranding: boolean;
        apiAccess: boolean;
    };
    popular?: boolean;
    stripePriceId?: string;
}

export interface Subscription {
    id: string;
    userId: string;
    planId: string;
    status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
}

export interface Usage {
    aiCredits: number;
    pitchDecks: number;
    mvpPlans: number;
    contracts: number;
    storage: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'free',
        name: 'Free',
        description: 'Perfect for exploring the platform',
        price: 0,
        interval: 'month',
        currency: 'USD',
        features: [
            '5 AI credits per month',
            '1 pitch deck',
            '1 MVP plan',
            '2 contracts',
            'Community support',
            'Basic analytics'
        ],
        limits: {
            aiCredits: 5,
            pitchDecks: 1,
            mvpPlans: 1,
            contracts: 2,
            teamMembers: 1,
            storage: 1,
            prioritySupport: false,
            customBranding: false,
            apiAccess: false
        }
    },
    {
        id: 'starter',
        name: 'Starter',
        description: 'For early-stage startups',
        price: 29,
        interval: 'month',
        currency: 'USD',
        features: [
            '50 AI credits per month',
            '5 pitch decks',
            '3 MVP plans',
            '10 contracts',
            'Up to 3 team members',
            'Email support',
            'Advanced analytics',
            '5GB storage'
        ],
        limits: {
            aiCredits: 50,
            pitchDecks: 5,
            mvpPlans: 3,
            contracts: 10,
            teamMembers: 3,
            storage: 5,
            prioritySupport: false,
            customBranding: false,
            apiAccess: false
        },
        stripePriceId: 'price_starter_monthly'
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'For growing startups',
        price: 79,
        interval: 'month',
        currency: 'USD',
        features: [
            '200 AI credits per month',
            'Unlimited pitch decks',
            'Unlimited MVP plans',
            'Unlimited contracts',
            'Up to 10 team members',
            'Priority support',
            'Custom branding',
            'Advanced analytics',
            '25GB storage',
            'API access'
        ],
        limits: {
            aiCredits: 200,
            pitchDecks: -1, // unlimited
            mvpPlans: -1,
            contracts: -1,
            teamMembers: 10,
            storage: 25,
            prioritySupport: true,
            customBranding: true,
            apiAccess: true
        },
        popular: true,
        stripePriceId: 'price_professional_monthly'
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For established companies',
        price: 299,
        interval: 'month',
        currency: 'USD',
        features: [
            'Unlimited AI credits',
            'Unlimited everything',
            'Unlimited team members',
            'Dedicated account manager',
            '24/7 priority support',
            'Custom branding',
            'White-label options',
            'Advanced analytics',
            'Unlimited storage',
            'Full API access',
            'Custom integrations',
            'SLA guarantee'
        ],
        limits: {
            aiCredits: -1,
            pitchDecks: -1,
            mvpPlans: -1,
            contracts: -1,
            teamMembers: -1,
            storage: -1,
            prioritySupport: true,
            customBranding: true,
            apiAccess: true
        },
        stripePriceId: 'price_enterprise_monthly'
    }
];

class SubscriptionService {
    private baseUrl = '/api/subscriptions';

    /**
     * Get all available plans
     */
    getPlans(): SubscriptionPlan[] {
        return SUBSCRIPTION_PLANS;
    }

    /**
     * Get current user's subscription
     */
    async getCurrentSubscription(): Promise<Subscription | null> {
        try {
            const response = await apiClient.get(`${this.baseUrl}/current`);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    /**
     * Get current usage
     */
    async getUsage(): Promise<Usage> {
        const response = await apiClient.get(`${this.baseUrl}/usage`);
        return response.data;
    }

    /**
     * Create checkout session for subscription
     */
    async createCheckoutSession(planId: string): Promise<{ url: string }> {
        const response = await apiClient.post(`${this.baseUrl}/checkout`, {
            planId
        });
        return response.data;
    }

    /**
     * Create portal session for managing subscription
     */
    async createPortalSession(): Promise<{ url: string }> {
        const response = await apiClient.post(`${this.baseUrl}/portal`);
        return response.data;
    }

    /**
     * Upgrade subscription
     */
    async upgradeSubscription(planId: string): Promise<Subscription> {
        const response = await apiClient.post(`${this.baseUrl}/upgrade`, {
            planId
        });
        return response.data;
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(immediately: boolean = false): Promise<Subscription> {
        const response = await apiClient.post(`${this.baseUrl}/cancel`, {
            immediately
        });
        return response.data;
    }

    /**
     * Resume canceled subscription
     */
    async resumeSubscription(): Promise<Subscription> {
        const response = await apiClient.post(`${this.baseUrl}/resume`);
        return response.data;
    }

    /**
     * Check if feature is available
     */
    async canUseFeature(feature: keyof Usage): Promise<boolean> {
        const response = await apiClient.get(`${this.baseUrl}/can-use/${feature}`);
        return response.data.allowed;
    }

    /**
     * Get plan by ID
     */
    getPlanById(planId: string): SubscriptionPlan | undefined {
        return SUBSCRIPTION_PLANS.find(p => p.id === planId);
    }

    /**
     * Check if unlimited
     */
    isUnlimited(limit: number): boolean {
        return limit === -1;
    }

    /**
     * Get feature limit
     */
    getFeatureLimit(planId: string, feature: keyof SubscriptionPlan['limits']): number {
        const plan = this.getPlanById(planId);
        return plan?.limits[feature] || 0;
    }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
