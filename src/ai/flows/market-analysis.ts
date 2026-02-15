'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MarketAnalysisInputSchema = z.object({
    industry: z.string().describe('The industry to analyze.'),
    location: z.string().describe('Target market location.'),
});

export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

const MarketAnalysisOutputSchema = z.object({
    trends: z.array(z.string()).describe('Top market trends in the sector.'),
    competitors: z.array(z.string()).describe('Major competitors in the space.'),
    riskScore: z.number().describe('Risk score from 1-100.'),
    summary: z.string().describe('Brief summary of the market opportunity.'),
});

export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;

export async function analyzeMarket(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
    return analyzeMarketFlow(input);
}

const analyzeMarketFlow = ai.defineFlow(
    {
        name: 'analyzeMarketFlow',
        inputSchema: MarketAnalysisInputSchema,
        outputSchema: MarketAnalysisOutputSchema,
    },
    async (input: MarketAnalysisInput) => {
        // We can define the prompt locally or globally. For this flow, we'll simulate a 
        // multi-step process or a complex prompt.
        const prompt = ai.definePrompt({
            name: 'marketAnalysisPrompt',
            input: { schema: MarketAnalysisInputSchema },
            output: { schema: MarketAnalysisOutputSchema },
        });

        const { output } = await (prompt as any)(input);
        return output!;
    }
);
