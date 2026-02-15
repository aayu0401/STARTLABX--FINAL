import { apiClient } from '@/lib/api-client';

export interface Project {
    id: string;
    name: string;
    description: string;
    startupId: string;
    teamMembers: {
        id: string;
        name: string;
        avatar?: string;
        role: string;
    }[];
    status: 'planning' | 'active' | 'on-hold' | 'completed';
    progress: number;
    startDate: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Board {
    id: string;
    projectId: string;
    name: string;
    columns: BoardColumn[];
}

export interface BoardColumn {
    id: string;
    name: string;
    order: number;
    tasks: Task[];
}

export interface Task {
    id: string;
    columnId: string;
    title: string;
    description?: string;
    assignees: {
        id: string;
        name: string;
        avatar?: string;
    }[];
    labels: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
    attachments: {
        id: string;
        name: string;
        url: string;
        type: string;
    }[];
    comments: TaskComment[];
    subtasks: {
        id: string;
        title: string;
        completed: boolean;
    }[];
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface TaskComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
}

export const projectService = {
    // Projects
    // Projects
    getProjects: async (params?: { page?: number; limit?: number; status?: string }) => {
        try {
            return await apiClient.get<{ projects: Project[]; total: number }>('/api/projects', { params });
        } catch (error) {
            console.warn("Project API failed, using mock data.", error);
            return {
                data: {
                    projects: [
                        {
                            id: '1',
                            name: 'AI Analytics Dashboard',
                            description: 'Building a comprehensive analytics platform for startup metrics using AI.',
                            startupId: 'demo-startup-id',
                            teamMembers: [
                                { id: 'u1', name: 'Demo Founder', role: 'owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
                                { id: 'u2', name: 'Sarah Chen', role: 'developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
                            ],
                            status: 'active',
                            progress: 65,
                            startDate: new Date().toISOString(),
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        },
                        {
                            id: '2',
                            name: 'Mobile App MVP',
                            description: 'Initial release of the mobile application for iOS and Android.',
                            startupId: 'demo-startup-id',
                            teamMembers: [
                                { id: 'u1', name: 'Demo Founder', role: 'owner' },
                                { id: 'u3', name: 'Mike Ross', role: 'designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' }
                            ],
                            status: 'planning',
                            progress: 15,
                            startDate: new Date().toISOString(),
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        }
                    ],
                    total: 2
                }
            };
        }
    },

    getProject: async (id: string) => {
        try {
            return await apiClient.get<Project>(`/api/projects/${id}`);
        } catch (error) {
            console.warn(`Project ${id} fetch failed, using mock.`, error);
            // Return a realistic single project mock
            return {
                data: {
                    id: id,
                    name: 'AI Analytics Dashboard',
                    description: 'Building a comprehensive analytics platform for startup metrics using AI.',
                    startupId: 'demo-startup-id',
                    teamMembers: [
                        { id: 'u1', name: 'Demo Founder', role: 'owner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
                        { id: 'u2', name: 'Sarah Chen', role: 'developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
                    ],
                    status: 'active',
                    progress: 65,
                    startDate: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };
        }
    },

    createProject: async (data: Partial<Project>) => {
        try {
            return await apiClient.post<Project>('/api/projects', data);
        } catch (error) {
            console.warn("Create project failed (offline mode), returning mock.", error);
            return {
                data: {
                    id: 'new-project-' + Date.now(),
                    name: data.name || 'New Project',
                    description: data.description || '',
                    startupId: 'demo-startup-id',
                    teamMembers: [],
                    status: 'planning',
                    progress: 0,
                    startDate: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    ...data
                }
            };
        }
    },

    updateProject: async (id: string, data: Partial<Project>) => {
        try {
            return await apiClient.put<Project>(`/api/projects/${id}`, data);
        } catch (error) {
            return { data: { id, ...data } as any };
        }
    },

    deleteProject: async (id: string) => {
        try {
            return await apiClient.delete(`/api/projects/${id}`);
        } catch (error) {
            return { data: { success: true } };
        }
    },

    // Boards
    getBoards: (projectId: string) =>
        apiClient.get<Board[]>(`/api/projects/${projectId}/boards`),

    getBoard: (projectId: string, boardId: string) =>
        apiClient.get<Board>(`/api/projects/${projectId}/boards/${boardId}`),

    createBoard: (projectId: string, name: string) =>
        apiClient.post<Board>(`/api/projects/${projectId}/boards`, { name }),

    updateBoard: (projectId: string, boardId: string, data: Partial<Board>) =>
        apiClient.put<Board>(`/api/projects/${projectId}/boards/${boardId}`, data),

    deleteBoard: (projectId: string, boardId: string) =>
        apiClient.delete(`/api/projects/${projectId}/boards/${boardId}`),

    // Columns
    createColumn: (projectId: string, boardId: string, name: string, order: number) =>
        apiClient.post<BoardColumn>(`/api/projects/${projectId}/boards/${boardId}/columns`, { name, order }),

    updateColumn: (projectId: string, boardId: string, columnId: string, data: Partial<BoardColumn>) =>
        apiClient.put<BoardColumn>(`/api/projects/${projectId}/boards/${boardId}/columns/${columnId}`, data),

    deleteColumn: (projectId: string, boardId: string, columnId: string) =>
        apiClient.delete(`/api/projects/${projectId}/boards/${boardId}/columns/${columnId}`),

    reorderColumns: (projectId: string, boardId: string, columnOrders: { id: string; order: number }[]) =>
        apiClient.put(`/api/projects/${projectId}/boards/${boardId}/columns/reorder`, { columnOrders }),

    // Tasks
    createTask: (projectId: string, boardId: string, columnId: string, data: Partial<Task>) =>
        apiClient.post<Task>(`/api/projects/${projectId}/boards/${boardId}/columns/${columnId}/tasks`, data),

    updateTask: (projectId: string, boardId: string, taskId: string, data: Partial<Task>) =>
        apiClient.put<Task>(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}`, data),

    deleteTask: (projectId: string, boardId: string, taskId: string) =>
        apiClient.delete(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}`),

    moveTask: (projectId: string, boardId: string, taskId: string, toColumnId: string, order: number) =>
        apiClient.put(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/move`, {
            toColumnId,
            order,
        }),

    assignTask: (projectId: string, boardId: string, taskId: string, userId: string) =>
        apiClient.post(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/assign`, { userId }),

    unassignTask: (projectId: string, boardId: string, taskId: string, userId: string) =>
        apiClient.delete(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/assign/${userId}`),

    // Task Comments
    addComment: (projectId: string, boardId: string, taskId: string, content: string) =>
        apiClient.post<TaskComment>(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/comments`, {
            content,
        }),

    deleteComment: (projectId: string, boardId: string, taskId: string, commentId: string) =>
        apiClient.delete(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/comments/${commentId}`),

    // Task Attachments
    addAttachment: async (projectId: string, boardId: string, taskId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient.post(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/attachments`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deleteAttachment: (projectId: string, boardId: string, taskId: string, attachmentId: string) =>
        apiClient.delete(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/attachments/${attachmentId}`),

    // Subtasks
    addSubtask: (projectId: string, boardId: string, taskId: string, title: string) =>
        apiClient.post(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/subtasks`, { title }),

    toggleSubtask: (projectId: string, boardId: string, taskId: string, subtaskId: string) =>
        apiClient.put(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/subtasks/${subtaskId}/toggle`),

    deleteSubtask: (projectId: string, boardId: string, taskId: string, subtaskId: string) =>
        apiClient.delete(`/api/projects/${projectId}/boards/${boardId}/tasks/${taskId}/subtasks/${subtaskId}`),
};
