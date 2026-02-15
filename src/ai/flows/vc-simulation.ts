'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const VCSimulationInputSchema = z.object({
    startupName: z.string().describe('Name of the startup'),
    pitchText: z.string().describe('The content of the pitch or description'),
    stage: z.string().describe('Funding stage (Seed, Series A, etc.)')
});

export type VCSimulationInput = z.infer<typeof VCSimulationInputSchema>;

export const VCSimulationOutputSchema = z.object({
    investorPersona: z.string(),
    decision: z.enum(['Invest', 'Reject', 'Meeting']),
    feedback: z.string(),
    score: z.number().min(0).max(100),
    keyConcerns: z.array(z.string()),
    termSheetOffer: z.string().optional()
});

export type VCSimulationOutput = z.infer<typeof VCSimulationOutputSchema>;

export async function simulateVCPitch(input: VCSimulationInput): Promise<VCSimulationOutput> {
    const flow = simulateVCFlow as any;
    return flow(input);
}

const simulateVCFlow = ai.defineFlow(
    {
        name: 'simulateVCFlow',
        inputSchema: VCSimulationInputSchema,
        outputSchema: VCSimulationOutputSchema,
    },
    async (input: VCSimulationInput) => {
        const prompt = ai.definePrompt({
            name: 'vcSimulationPrompt',
            input: { schema: VCSimulationInputSchema },
            output: { schema: VCSimulationOutputSchema },
        });

        const result = await (prompt as any)(input);
        return result.output;
    }
);
