'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const PitchDeckInputSchema = z.object({
    startupName: z.string().describe('Name of the startup'),
    description: z.string().describe('One sentence description'),
    targetAudience: z.string().describe('Who is the customer?'),
});

export type PitchDeckInput = z.infer<typeof PitchDeckInputSchema>;

export const SlideSchema = z.object({
    title: z.string(),
    bulletPoints: z.array(z.string()),
    imageUrl: z.string().optional().describe('Unsplash placeholder URL'),
    notes: z.string().optional()
});

export type Slide = z.infer<typeof SlideSchema>;

export const PitchDeckOutputSchema = z.object({
    slides: z.array(SlideSchema)
});

export type PitchDeckOutput = z.infer<typeof PitchDeckOutputSchema>;

export async function generatePitchDeck(input: PitchDeckInput): Promise<PitchDeckOutput> {
    const flow = generatePitchDeckFlow as any;
    return flow(input);
}

const generatePitchDeckFlow = ai.defineFlow(
    {
        name: 'generatePitchDeckFlow',
        inputSchema: PitchDeckInputSchema,
        outputSchema: PitchDeckOutputSchema,
    },
    async (input: PitchDeckInput) => {
        const prompt = ai.definePrompt({
            name: 'pitchDeckPrompt',
            input: { schema: PitchDeckInputSchema },
            output: { schema: PitchDeckOutputSchema },
        });

        // Current mock returns { output: { slides: ... } }
        // We cast to any to bypass strict type check on mock implementation details
        const result = await (prompt as any)(input);

        return result.output;
    }
);
