'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const LegalInputSchema = z.object({
    docType: z.enum(['NDA', 'Founder Agreement', 'Privacy Policy']),
    partyA: z.string().describe("Disclosing Party or Company Name"),
    partyB: z.string().describe("Receiving Party or Second Founder"),
    jurisdiction: z.string().optional()
});

export type LegalInput = z.infer<typeof LegalInputSchema>;

export const LegalOutputSchema = z.object({
    content: z.string(), // Markdown compatible
    validityFields: z.array(z.string())
});

export type LegalOutput = z.infer<typeof LegalOutputSchema>;

export async function generateLegalDoc(input: LegalInput): Promise<LegalOutput> {
    const flow = generateLegalFlow as any;
    return flow(input);
}

const generateLegalFlow = ai.defineFlow(
    {
        name: 'generateLegalFlow',
        inputSchema: LegalInputSchema,
        outputSchema: LegalOutputSchema,
    },
    async (input: LegalInput) => {
        const prompt = ai.definePrompt({
            name: 'legalPrompt',
            input: { schema: LegalInputSchema },
            output: { schema: LegalOutputSchema },
        });

        const result = await (prompt as any)(input);
        return result.output;
    }
);
