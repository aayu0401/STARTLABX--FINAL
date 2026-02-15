
import { prisma } from "@/lib/db";

export interface DailyAction {
    id: string;
    projectId: string;
    date: Date;
    content: string;
    status: 'pending' | 'completed' | 'missed' | 'carried_over';
    completedAt?: Date | null;
}

export const founderRhythmService = {
    // Get current founder status (streak, debt, today's action)
    getFounderStatus: async (projectId: string) => {
        try {
            const project = await prisma.startupProject.findUnique({
                where: { id: projectId },
                select: { executionStreak: true, executionDebt: true }
            });

            // Get today's action
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todaysAction = await prisma.dailyAction.findFirst({
                where: {
                    projectId,
                    date: { gte: today }
                }
            });

            return {
                streak: project?.executionStreak || 0,
                debt: project?.executionDebt || 0,
                todaysAction: todaysAction
            };
        } catch (error) {
            console.warn("Failed to get founder status", error);
            return { streak: 0, debt: 0, todaysAction: null };
        }
    },

    // Set today's Top 1 Action
    setDailyAction: async (projectId: string, content: string) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if action already exists
            const existing = await prisma.dailyAction.findFirst({
                where: { projectId, date: { gte: today } }
            });

            if (existing) {
                return await prisma.dailyAction.update({
                    where: { id: existing.id },
                    data: { content }
                });
            }

            return await prisma.dailyAction.create({
                data: {
                    projectId,
                    content,
                    status: 'pending'
                }
            });
        } catch (error) {
            console.error("Failed to set daily action", error);
            throw error;
        }
    },

    // Complete action
    completeDailyAction: async (actionId: string) => {
        const action = await prisma.dailyAction.update({
            where: { id: actionId },
            data: {
                status: 'completed',
                completedAt: new Date()
            }
        });

        // Update streak
        await prisma.startupProject.update({
            where: { id: action.projectId },
            data: {
                executionStreak: { increment: 1 },
                lastActionDate: new Date()
            }
        });

        return action;
    },

    // Calculate missed days (Logic to run on cron or login)
    checkMissedDays: async (projectId: string) => {
        // Implementation for "Streak gravity" logic
        // If lastActionDate < yesterday, reset streak.
        const project = await prisma.startupProject.findUnique({ where: { id: projectId } });
        if (!project?.lastActionDate) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        if (project.lastActionDate < yesterday) {
            // Missed a day! Reset streak.
            await prisma.startupProject.update({
                where: { id: projectId },
                data: { executionStreak: 0 }
            });
        }
    }
};
