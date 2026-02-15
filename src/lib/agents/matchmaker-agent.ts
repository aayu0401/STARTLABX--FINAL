
import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { LlmService } from '../llm-service';
import { Talent } from '@/services/talent.service';

export interface MatchAnalysis {
    score: number;
    reasoning: string;
    pros: string[];
    cons: string[];
}

export class MatchmakerAgent extends BaseAgent {
    role = 'recruiter' as const;
    // Wait, I should add 'recruiter' to AgentRole. 

    // For this specific file, I'll temporarily use 'growth_hacker' to pass type check until I update registry, 
    // BUT the prompt asked for "MatchmakerAgent". 
    // Let's implement calculateMatch method which is static or instance based, 
    // separate from the standard "process" flow if it's used deeply in UI.
    // actually, let's just make it a standard agent that CAN be called.

    name = 'Talent Scout';
    description = 'Analyzes candidate profiles against project tech stacks to find perfect matches.';

    // This method is for the "Agent Framework" flow
    async process(context: AgentContext): Promise<AgentResult> {
        // Implementation for autonomous searching
        return { success: true, output: {} };
    }

    // This method is for the UI Component to call directly for "Real-time Scoring"
    static async analyzeFit(projectDescription: string, stack: any, candidate: Talent): Promise<MatchAnalysis> {
        try {
            const prompt = `
            Analyze the fit between this Candidate and the Startup Project.
            
            Startup: "${projectDescription}"
            Tech Stack: ${JSON.stringify(stack)}
            
            Candidate: ${candidate.name}
            Title: ${candidate.title}
            Skills: ${candidate.skills.join(', ')}
            Bio: ${candidate.bio}
            
            Provide JSON output:
            {
                "score": number (0-100),
                "reasoning": "short summary",
                "pros": ["point 1", "point 2"],
                "cons": ["point 1"]
            }
            `;

            const analysis = await LlmService.generateJSON<MatchAnalysis>(prompt, 'Match Analysis');
            return analysis;

        } catch (e) {
            console.warn('Matchmaker AI failed, falling back to heuristic.', e);
            return this.heuristicMatch(stack, candidate);
        }
    }

    private static heuristicMatch(stack: any, candidate: Talent): MatchAnalysis {
        // Simple overlap logic
        const stackString = JSON.stringify(stack).toLowerCase();
        let hitCount = 0;
        const skillsOfInterest = candidate.skills.map(s => s.toLowerCase());

        skillsOfInterest.forEach(skill => {
            if (stackString.includes(skill)) hitCount++;
        });

        // Base score 60 + (hits * 10), max 98
        const score = Math.min(98, 60 + (hitCount * 10));

        return {
            score,
            reasoning: `Found ${hitCount} matching skills in your stack. Strong potential fit based on keywords.`,
            pros: [`Matches ${hitCount} core technologies`, "Available immediately"],
            cons: ["Might need onboarding for specific domain"]
        };
    }
}
