'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate icebreaker suggestions for new chats.
 *
 * - generateIcebreakerSuggestions - A function that generates icebreaker suggestions.
 * - IcebreakerInput - The input type for the generateIcebreakerSuggestions function.
 * - IcebreakerOutput - The return type for the generateIcebreakerSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IcebreakerInputSchema = z.object({
  currentUserInterests: z
    .array(z.string())
    .describe("A list of the current user's interests."),
  matchedUserName: z.string().describe("The name of the matched user."),
  matchedUserInterests: z
    .array(z.string())
    .describe("A list of the matched user's interests."),
  matchedUserBio: z
    .string()
    .optional()
    .describe("The bio or 'about me' section of the matched user."),
});
export type IcebreakerInput = z.infer<typeof IcebreakerInputSchema>;

const IcebreakerOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe("A list of AI-generated icebreaker suggestions or opening lines."),
});
export type IcebreakerOutput = z.infer<typeof IcebreakerOutputSchema>;

export async function generateIcebreakerSuggestions(
  input: IcebreakerInput
): Promise<IcebreakerOutput> {
  return aiChatIcebreakerSuggestionsFlow(input);
}

const icebreakerPrompt = ai.definePrompt({
  name: 'icebreakerPrompt',
  input: { schema: IcebreakerInputSchema },
  output: { schema: IcebreakerOutputSchema },
  prompt: `You are a friendly, creative, and engaging conversation starter for a dating app. Your goal is to generate 3-5 unique and personalized icebreaker suggestions or opening lines for a new chat.

Focus on common interests between the two users and any details from the matched user's bio to make the suggestions sound natural, encouraging, and easy to respond to.

Avoid generic greetings like 'Hi' or 'Hello'. Make the suggestions sound like they come from a real person, not an AI.

Current User's Interests: {{{currentUserInterests}}}
Matched User's Name: {{{matchedUserName}}}
Matched User's Interests: {{{matchedUserInterests}}}
Matched User's Bio: {{{matchedUserBio}}}

Generate 3-5 suggestions, formatted as a JSON array of strings.

Suggestions:`,
});

const aiChatIcebreakerSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiChatIcebreakerSuggestionsFlow',
    inputSchema: IcebreakerInputSchema,
    outputSchema: IcebreakerOutputSchema,
  },
  async (input) => {
    const { output } = await icebreakerPrompt(input);
    return output!;
  }
);
