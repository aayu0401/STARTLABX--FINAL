'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const RoadmapInputSchema = z.object({
    productName: z.string(),
    goal: z.string(),
    timeline: z.string().describe("e.g. '3 months'")
});

export type RoadmapInput = z.infer<typeof RoadmapInputSchema>;

export const MilestoneSchema = z.object({
    week: z.number(),
    title: z.string(),
    description: z.string(),
    type: z.enum(['tech', 'marketing', 'legal', 'fundraising', 'hiring', 'product', 'business']) // Broad set
});

export const PhaseSchema = z.object({
    name: z.string(),
    milestones: z.array(MilestoneSchema)
});

export const RoadmapOutputSchema = z.object({
    phases: z.array(PhaseSchema)
});

export type RoadmapOutput = z.infer<typeof RoadmapOutputSchema>;

export async function generateRoadmap(input: RoadmapInput): Promise<RoadmapOutput> {
    const flow = generateRoadmapFlow as any;
    return flow(input);
}

const generateRoadmapFlow = ai.defineFlow(
    {
        name: 'generateRoadmapFlow',
        inputSchema: RoadmapInputSchema,
        outputSchema: RoadmapOutputSchema,
    },
    async (input: RoadmapInput) => {
        const prompt = ai.definePrompt({
            name: 'roadmapPrompt',
            input: { schema: RoadmapInputSchema },
            output: { schema: RoadmapOutputSchema },
        });

        const result = await (prompt as any)(input);
        return result.output;
    }
);
