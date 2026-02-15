import { apiClient } from '@/lib/api-client';

export interface AgentTask {
    id: string;
    agentRole: 'CEO' | 'CTO' | 'PM' | 'UX' | 'Dev' | 'QA' | 'Growth' | 'frontend_dev' | 'growth_hacker' | 'legal_bot' | 'ProductManager' | 'recruiter';
    action: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'waiting_human';
    output: any;
    createdAt: string;
}

export interface GeneratedAsset {
    id: string;
    type: 'code' | 'document' | 'design' | 'image' | 'diagram';
    title: string;
    content: string;
    format: string;
    version: number;
    createdAt: string;
}

export interface StartupProject {
    id: string;
    name: string;
    description: string;
    status: 'ideation' | 'validating' | 'architecting' | 'building' | 'testing' | 'launched';
    currentStage: string;
    roadmap?: any;
    techStack?: any;
    features?: any;
    branding?: any;
    tasks: AgentTask[];
    assets: GeneratedAsset[];
    createdAt: string;
}

export const incubatorService = {
    // Get all user projects
    getProjects: () =>
        apiClient.get<StartupProject[]>('/api/incubator/projects').then(res => res.data),

    // Get specific project
    getProject: (id: string) =>
        apiClient.get<StartupProject>(`/api/incubator/projects/${id}`).then(res => res.data),

    // Create new project (Start from Idea)
    createProject: (idea: string, name: string) =>
        apiClient.post<StartupProject>('/api/incubator/projects', { idea, name }).then(res => res.data),

    // Trigger an agent action
    triggerAction: (projectId: string, agentRole: string, action: string, input: any) =>
        apiClient.post<AgentTask>(`/api/incubator/projects/${projectId}/action`, { agentRole, action, input }).then(res => res.data),

    // Get project assets
    getAssets: (projectId: string) =>
        apiClient.get<GeneratedAsset[]>(`/api/incubator/projects/${projectId}/assets`).then(res => res.data),

    // Approve an asset (Human in the loop)
    approveAsset: (assetId: string) =>
        apiClient.post(`/api/incubator/assets/${assetId}/approve`).then(res => res.data),
};
