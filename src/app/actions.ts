
'use server';

import { generateAiExample, type GenerateAiExampleInput, type GenerateAiExampleOutput } from '@/ai/flows/generate-ai-example';

export async function generateExampleAction(termName: string): Promise<GenerateAiExampleOutput | { error: string }> {
  try {
    const input: GenerateAiExampleInput = { term: termName };
    const result = await generateAiExample(input);
    return result;
  } catch (error) {
    console.error('Error generating AI example:', error);
    return { error: 'Failed to generate example. Please try again later.' };
  }
}
