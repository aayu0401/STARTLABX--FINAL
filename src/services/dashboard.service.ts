import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
    totalViews: number;
    viewsChange: number;
    engagementRate: number;
    engagementChange: number;
    newFollowers: number;
    followersChange: number;
    totalInteractions: number;
    interactionsChange: number;
}

export interface EngagementData {
    date: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
}

export interface AudienceBreakdown {
    profession: string;
    percentage: number;
    count: number;
}

export interface TopPost {
    id: string;
    content: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagement: number;
    createdAt: string;
}

export interface GrowthInsight {
    metric: string;
    current: number;
    target: number;
    progress: number;
    trend: 'up' | 'down' | 'stable';
}

export interface ActivitySummary {
    posts: number;
    comments: number;
    likes: number;
    shares: number;
    connections: number;
    messages: number;
}

export interface RecommendedAction {
    id: string;
    type: 'post' | 'connect' | 'message' | 'join' | 'update';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    icon: string;
}

export interface TractionMetrics {
    score: number; // 0-100
    development: number;
    market: number;
    team: number;

    // V5 Explicit Metrics
    mrr?: number;
    retention?: number;
    growthRate?: number;
}

export interface RoadmapMilestone {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    dueDate?: string;
}

export interface FounderDNA {
    archetype: string;
    attributes: { label: string; value: number; color: string; }[];
    coFounderFit: string;
    risk: string;
}

export interface InvestorDeal {
    id: string;
    startupName: string;
    industry: string;
    tractionScore: number;
    matchScore: number;
    fundingAsk: string;
    logo?: string;
}

export interface RiskAnalysis {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendation: string;
}

export interface EquityData {
    totalAllocated: number; // Percentage
    founders: { user: string; role: string; percentage: number; status: 'proposed' | 'agreed' | 'signed' }[];
    poolRemaining: number;
}

export interface PivotHistory {
    id: string;
    previousStage: string;
    newStage: string;
    reason: string;
    date: string;
}

export interface DefensibilityMoat {
    score: number;
    networkEffects: number;
    brand: number;
    tech: number;
    data: number;
}

export interface BoardMeeting {
    id: string;
    weekNumber: number;
    date: string;
    status: 'completed' | 'pending';
    sentiment: 'optimistic' | 'concerned' | 'neutral';
    aiFeedback: string;
}

export interface ExitStrategy {
    acquisitionScore: number;
    buyerTypes: string[];
    readinessGaps: string[];
}

export interface DashboardData {
    stats: DashboardStats;
    engagementData: EngagementData[];
    audienceBreakdown: AudienceBreakdown[];
    topPosts: TopPost[];
    growthInsights: GrowthInsight[];
    activitySummary: ActivitySummary;
    recommendedActions: RecommendedAction[];
    // V3 Extensions
    traction?: TractionMetrics;
    milestones?: RoadmapMilestone[];
    executionVelocity?: number;
    founderDNA?: FounderDNA;
    investorDeals?: InvestorDeal[];
    riskAnalysis?: RiskAnalysis;
    equityMap?: EquityData;
    pivots?: PivotHistory[];
    moat?: DefensibilityMoat;
    boardMeetings?: BoardMeeting[];
    exitStrategy?: ExitStrategy;
    founderRhythm?: {
        executionStreak: number;
        executionDebt: number;
        todaysAction?: {
            id: string;
            content: string;
            status: 'pending' | 'completed' | 'missed' | 'carried_over';
        };
    };
}

export const dashboardService = {
    // Get dashboard overview
    getDashboard: async (timeRange?: '7d' | '30d' | '90d' | '1y') => {
        try {
            return await apiClient.get<DashboardData>('/api/dashboard', { params: { timeRange } });
        } catch (error) {
            console.error("Dashboard API failed", error);
            throw error;
        }
    },
    // Get stats
    getStats: (timeRange?: '7d' | '30d' | '90d' | '1y') =>
        apiClient.get<DashboardStats>('/api/dashboard/stats', { params: { timeRange } }),

    // Get engagement data
    getEngagementData: (timeRange?: '7d' | '30d' | '90d' | '1y') =>
        apiClient.get<EngagementData[]>('/api/dashboard/engagement', { params: { timeRange } }),

    // Get audience breakdown
    getAudienceBreakdown: () =>
        apiClient.get<AudienceBreakdown[]>('/api/dashboard/audience'),

    // Get top posts
    getTopPosts: (limit?: number) =>
        apiClient.get<TopPost[]>('/api/dashboard/top-posts', { params: { limit } }),

    // Get growth insights
    getGrowthInsights: () =>
        apiClient.get<GrowthInsight[]>('/api/dashboard/growth'),

    // Get activity summary
    getActivitySummary: (timeRange?: '7d' | '30d' | '90d' | '1y') =>
        apiClient.get<ActivitySummary>('/api/dashboard/activity', { params: { timeRange } }),

    // Get recommended actions
    getRecommendedActions: () =>
        apiClient.get<RecommendedAction[]>('/api/dashboard/recommendations'),

    // Export dashboard data
    exportData: (format: 'csv' | 'pdf', timeRange?: '7d' | '30d' | '90d' | '1y') =>
        apiClient.get('/api/dashboard/export', {
            params: { format, timeRange },
            responseType: 'blob',
        }),

    // V5 Logic: Traction -> Visibility -> Capital
    calculateCapitalReadiness: (traction: TractionMetrics, moat: DefensibilityMoat): number => {
        let score = 0;

        const mrr = traction.mrr || 0;
        const retention = traction.retention || 0;
        const growthRate = traction.growthRate || 0;

        // Traction Weights (60%)
        if (mrr > 10000) score += 30;
        else if (mrr > 5000) score += 15;

        if (retention > 80) score += 20;
        else if (retention > 60) score += 10;

        if (growthRate > 20) score += 10;

        // Moat Weights (40%)
        if (moat.score > 80) score += 40;
        else if (moat.score > 50) score += 20;

        return Math.min(100, score);
    },
};
