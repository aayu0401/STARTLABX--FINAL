'use server';

/**
 * @fileOverview An AI agent for generating startup descriptions.
 *
 * - generateStartupDescription - A function that generates a startup description.
 * - StartupDescriptionInput - The input type for the generateStartupDescription function.
 * - StartupDescriptionOutput - The return type for the generateStartupDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StartupDescriptionInputSchema = z.object({
  startupName: z.string().describe('The name of the startup.'),
  startupIndustry: z.string().describe('The industry of the startup.'),
  startupMission: z.string().describe('The mission of the startup.'),
});
export type StartupDescriptionInput = z.infer<typeof StartupDescriptionInputSchema>;

const StartupDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed description of the startup.'),
});
export type StartupDescriptionOutput = z.infer<typeof StartupDescriptionOutputSchema>;

export async function generateStartupDescription(
  input: StartupDescriptionInput
): Promise<StartupDescriptionOutput> {
  return generateStartupDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'startupDescriptionPrompt',
  input: {schema: StartupDescriptionInputSchema},
  output: {schema: StartupDescriptionOutputSchema},
  prompt: `You are a creative copywriter specializing in crafting compelling startup descriptions.

  Generate a detailed and engaging description for the startup, highlighting its mission, industry, and unique value proposition.

  Startup Name: {{{startupName}}}
  Startup Industry: {{{startupIndustry}}}
  Startup Mission: {{{startupMission}}}

  Description:`,
});

const generateStartupDescriptionFlow = ai.defineFlow(
  {
    name: 'generateStartupDescriptionFlow',
    inputSchema: StartupDescriptionInputSchema,
    outputSchema: StartupDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
