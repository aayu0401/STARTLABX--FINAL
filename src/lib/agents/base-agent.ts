
import { prisma } from '@/lib/db';

export type AgentRole =
    | 'CEO' | 'CTO' | 'PM' | 'ProductManager' | 'UXDesigner'
    | 'frontend_dev' | 'backend_dev' | 'qa_engineer'
    | 'growth_hacker' | 'legal_bot' | 'finance_bot' | 'recruiter';

export interface AgentContext {
    projectId: string;
    project: any; // Full project object
    input: any;   // Task specific input
}

export interface AgentResult {
    success: boolean;
    output: any;      // JSON result
    artifacts?: {     // Generated files
        title: string;
        type: string;
        content: string;
        format: string;
    }[];
    nextSteps?: {     // Suggested next actions
        role: AgentRole;
        action: string;
        input: any;
    }[];
}

export abstract class BaseAgent {
    abstract role: AgentRole;
    abstract name: string;
    abstract description: string;

    /**
     * Main execution method
     */
    async execute(context: AgentContext): Promise<AgentResult> {
        console.log(`[${this.role}] Starting task for project ${context.projectId}`);

        // 1. Log task start
        const task = await prisma.agentTask.create({
            data: {
                agentRole: this.role,
                action: 'execute',
                status: 'processing',
                projectId: context.projectId,
                input: JSON.stringify(context.input)
            }
        });

        try {
            // 2. Run actual logic
            const result = await this.process(context);

            // 3. Save artifacts if any
            if (result.artifacts) {
                for (const artifact of result.artifacts) {
                    await prisma.generatedAsset.create({
                        data: {
                            projectId: context.projectId,
                            type: artifact.type,
                            title: artifact.title,
                            content: artifact.content,
                            format: artifact.format
                        }
                    });
                }
            }

            // 4. Update task status
            await prisma.agentTask.update({
                where: { id: task.id },
                data: {
                    status: 'completed',
                    output: JSON.stringify(result.output),
                    completedAt: new Date()
                }
            });

            return result;

        } catch (error: any) {
            console.error(`[${this.role}] Task failed`, error);

            await prisma.agentTask.update({
                where: { id: task.id },
                data: {
                    status: 'failed',
                    error: error.message,
                    completedAt: new Date()
                }
            });

            throw error;
        }
    }

    /**
     * The specific logic for this agent. 
     * To be implemented by subclasses.
     */
    protected abstract process(context: AgentContext): Promise<AgentResult>;
}
