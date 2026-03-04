'use server';
/**
 * @fileOverview Provides an AI-powered compatibility explanation between two users in a dating app.
 *
 * - generateMatchCompatibilityInsight - A function that generates a compatibility explanation.
 * - AiMatchCompatibilityInsightInput - The input type for the generateMatchCompatibilityInsight function.
 * - AiMatchCompatibilityInsightOutput - The return type for the generateMatchCompatibilityInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMatchCompatibilityInsightInputSchema = z.object({
  currentUser: z.object({
    name: z.string().describe("The current user's name."),
    age: z.number().describe("The current user's age."),
    interests: z.array(z.string()).describe("A list of the current user's interests."),
    bio: z.string().describe("The current user's short biography."),
  }).describe("Information about the current user."),
  matchUser: z.object({
    name: z.string().describe("The potential match's name."),
    age: z.number().describe("The potential match's age."),
    interests: z.array(z.string()).describe("A list of the potential match's interests."),
    bio: z.string().describe("The potential match's short biography."),
  }).describe("Information about the potential match."),
});
export type AiMatchCompatibilityInsightInput = z.infer<typeof AiMatchCompatibilityInsightInputSchema>;

const AiMatchCompatibilityInsightOutputSchema = z.object({
  explanation: z.string().describe("A friendly AI-generated explanation of compatibility, highlighting shared interests and potential conversation topics."),
});
export type AiMatchCompatibilityInsightOutput = z.infer<typeof AiMatchCompatibilityInsightOutputSchema>;

export async function generateMatchCompatibilityInsight(input: AiMatchCompatibilityInsightInput): Promise<AiMatchCompatibilityInsightOutput> {
  return aiMatchCompatibilityInsightFlow(input);
}

const aiMatchCompatibilityInsightPrompt = ai.definePrompt({
  name: 'aiMatchCompatibilityInsightPrompt',
  input: {schema: AiMatchCompatibilityInsightInputSchema},
  output: {schema: AiMatchCompatibilityInsightOutputSchema},
  prompt: `You are an expert dating app compatibility analyst. Your task is to analyze two user profiles and generate a friendly and engaging compatibility explanation. Highlight shared interests and suggest potential conversation starters.

Current User:
Name: {{{currentUser.name}}}
Age: {{{currentUser.age}}}
Interests: {{#each currentUser.interests}}
- {{{this}}}
{{/each}}
Bio: {{{currentUser.bio}}}

Potential Match:
Name: {{{matchUser.name}}}
Age: {{{matchUser.age}}}
Interests: {{#each matchUser.interests}}
- {{{this}}}
{{/each}}
Bio: {{{matchUser.bio}}}

Generate a compatibility explanation for {{currentUser.name}} and {{matchUser.name}}. Focus on commonalities and suggest specific topics they could discuss. Make it sound encouraging and positive. Ensure the explanation is concise and easy to understand, suitable for a dating app interface.`,
});

const aiMatchCompatibilityInsightFlow = ai.defineFlow(
  {
    name: 'aiMatchCompatibilityInsightFlow',
    inputSchema: AiMatchCompatibilityInsightInputSchema,
    outputSchema: AiMatchCompatibilityInsightOutputSchema,
  },
  async (input) => {
    const {output} = await aiMatchCompatibilityInsightPrompt(input);
    return output!;
  }
);
