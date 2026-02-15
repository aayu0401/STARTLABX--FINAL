
import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { LlmService } from '../llm-service';

export class PmAgent extends BaseAgent {
    role = 'PM' as const;
    name = 'Product Manager';
    description = 'Translates strategy into requirements and user stories.';

    async process(context: AgentContext): Promise<AgentResult> {
        const { strategy } = context.input;
        const project = context.project;

        let prd: string;
        let userStories: any;

        try {
            const prdPrompt = `
            Act as a Product Manager for "${project.name}".
            Strategy Summary: "${strategy.strategy}".
            
            Write a simplified Product Requirements Document (PRD) in Markdown.
            Include:
            1. Problem Statement
            2. Core Features (MVP)
            3. User Flow
            4. Success Metrics
            `;
            prd = await LlmService.generate(prdPrompt);

            const storiesPrompt = `
            Generate 5 User Stories for "${project.name}" (MVP) based on the strategy.
            Output JSON array of objects with keys: "title", "acceptanceCriteria" (array of strings), "priority" (High/Medium).
            `;
            userStories = await LlmService.generateJSON(storiesPrompt, 'Array of User Stories');

        } catch (e) {
            console.warn('Real AI failed, falling back to simulation logic.', e);
            await new Promise(resolve => setTimeout(resolve, 2000));

            prd = `
# Product Requirements Document (PRD)

## Problem Statement
Users struggle with efficiency in the target market. ${project.name} solves this via automation.

## Core Features (MVP)
1. **User Authentication**: Secure login/signup.
2. **Dashboard**: Real-time overview of metrics.
3. **Core Workflow**: The main functional loop.

## User Flow
Landing Page -> Signup -> Onboarding -> Dashboard -> Usage.

## Success Metrics
- 10% Conversion Rate on Landing Page
- 50% Retention after Week 1
            `;

            userStories = [
                { title: "As a user, I want to sign up via Email", priority: "High", acceptanceCriteria: ["Valid email check", "Password strength"] },
                { title: "As a admin, I want to see analytics", priority: "Medium", acceptanceCriteria: ["Graph view", "Export CSV"] }
            ];
        }

        return {
            success: true,
            output: { userStories },
            artifacts: [
                {
                    title: 'PRD_v1.md',
                    type: 'document',
                    content: prd,
                    format: 'markdown'
                },
                {
                    title: 'User_Stories.json',
                    type: 'code',
                    content: JSON.stringify(userStories, null, 2),
                    format: 'json'
                }
            ],
            nextSteps: [
                {
                    role: 'frontend_dev',
                    action: 'generate_landing_page', // PM hands off to Dev
                    input: { prd: prd } // Pass PRD to Dev
                }
            ]
        };
    }
}
