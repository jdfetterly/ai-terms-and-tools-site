
'use server';

import { generateAiExample, type GenerateAiExampleInput, type GenerateAiExampleOutput } from '@/ai/flows/generate-ai-example';
import type { RequestNewTermInput } from '@/lib/types';

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

export async function requestNewTermAction(data: RequestNewTermInput): Promise<{ success: boolean; message: string }> {
  console.log('New term request received:', data);
  // In a real application, you would save this data to a database or send a notification.
  // For this prototype, we're just logging it.

  if (!data.termName) {
    return { success: false, message: 'Term name is required.' };
  }

  // Simulate a short delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return { success: true, message: `Term request for "${data.termName}" submitted successfully!` };
}
