'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI usage examples.
 *
 * - generateAiExample - A function that generates an example of how to use a specific AI term.
 * - GenerateAiExampleInput - The input type for the generateAiExample function.
 * - GenerateAiExampleOutput - The return type for the generateAiExample function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiExampleInputSchema = z.object({
  term: z.string().describe('The AI term for which to generate an example.'),
});
export type GenerateAiExampleInput = z.infer<typeof GenerateAiExampleInputSchema>;

const GenerateAiExampleOutputSchema = z.object({
  example: z.string().describe('An example of how to use the AI term.'),
});
export type GenerateAiExampleOutput = z.infer<typeof GenerateAiExampleOutputSchema>;

export async function generateAiExample(input: GenerateAiExampleInput): Promise<GenerateAiExampleOutput> {
  return generateAiExampleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiExamplePrompt',
  input: {schema: GenerateAiExampleInputSchema},
  output: {schema: GenerateAiExampleOutputSchema},
  prompt: `You are an AI expert. Generate a practical example of how to use the AI term: {{{term}}}. The example should be clear, concise, and easy to understand.`,
});

const generateAiExampleFlow = ai.defineFlow(
  {
    name: 'generateAiExampleFlow',
    inputSchema: GenerateAiExampleInputSchema,
    outputSchema: GenerateAiExampleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
