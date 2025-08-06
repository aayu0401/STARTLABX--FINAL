'use server';

/**
 * @fileOverview AI-powered talent matching flow for founders.
 *
 * - suggestTalent - A function that suggests potential talent matches.
 * - SuggestTalentInput - The input type for the suggestTalent function.
 * - SuggestTalentOutput - The return type for the suggestTalent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTalentInputSchema = z.object({
  startupDescription: z
    .string()
    .describe('A detailed description of the startup, its mission, and its needs.'),
  requiredSkills: z
    .string()
    .describe('A comma-separated list of skills required for the talent.'),
  equityExpectations: z
    .string()
    .describe('The equity expectations for the talent, e.g., low, medium, high.'),
});
export type SuggestTalentInput = z.infer<typeof SuggestTalentInputSchema>;

const SuggestTalentOutputSchema = z.object({
  talentSuggestions: z
    .array(z.string())
    .describe('A list of potential talent matches with names and brief descriptions.'),
});
export type SuggestTalentOutput = z.infer<typeof SuggestTalentOutputSchema>;

export async function suggestTalent(input: SuggestTalentInput): Promise<SuggestTalentOutput> {
  return suggestTalentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTalentPrompt',
  input: {schema: SuggestTalentInputSchema},
  output: {schema: SuggestTalentOutputSchema},
  prompt: `You are an AI-powered talent matcher. You will receive a startup description, required skills, and equity expectations. Based on this information, you will suggest potential talent matches from the marketplace.

Startup Description: {{{startupDescription}}}
Required Skills: {{{requiredSkills}}}
Equity Expectations: {{{equityExpectations}}}

Suggest a list of potential talent matches:
`,
});

const suggestTalentFlow = ai.defineFlow(
  {
    name: 'suggestTalentFlow',
    inputSchema: SuggestTalentInputSchema,
    outputSchema: SuggestTalentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
