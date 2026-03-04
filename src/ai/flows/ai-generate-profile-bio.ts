'use server';
/**
 * @fileOverview A Genkit flow to generate creative and engaging profile bios for a dating app.
 *
 * - generateProfileBio - A function that handles the profile bio generation process.
 * - ProfileBioInput - The input type for the generateProfileBio function.
 * - ProfileBioOutput - The return type for the generateProfileBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileBioInputSchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe(
        'A short description or personal information to base the bio on.'
      ),
    keywords: z
      .array(z.string())
      .optional()
      .describe('A list of keywords or interests to include in the bio.'),
  })
  .refine(data => data.description || (data.keywords && data.keywords.length > 0), {
    message: 'Either description or at least one keyword must be provided.',
    path: ['description', 'keywords'],
  });

export type ProfileBioInput = z.infer<typeof ProfileBioInputSchema>;

const ProfileBioOutputSchema = z.object({
  bio: z.string().describe('The primary generated profile bio.'),
  suggestions: z
    .array(z.string())
    .optional()
    .describe('Alternative profile bio suggestions.'),
});
export type ProfileBioOutput = z.infer<typeof ProfileBioOutputSchema>;

export async function generateProfileBio(
  input: ProfileBioInput
): Promise<ProfileBioOutput> {
  return generateProfileBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProfileBioPrompt',
  input: {schema: ProfileBioInputSchema},
  output: {schema: ProfileBioOutputSchema},
  prompt: `You are a creative and engaging dating app profile bio generator.

Generate one primary profile bio and 2-3 alternative suggestions.

{{#if description}}
Based on the following description:
Description: {{{description}}}
{{else if keywords}}
Based on the following keywords:
Keywords: {{#each keywords}}- {{{this}}}
{{/each}}
{{else}}
Generate a creative bio for a dating app.
{{/if}}

Ensure the tone is attractive, friendly, and authentic. The bio should encourage connection and highlight unique personality traits.

Output should be a JSON object with a 'bio' field (string) and an optional 'suggestions' field (array of strings).`,
});

const generateProfileBioFlow = ai.defineFlow(
  {
    name: 'generateProfileBioFlow',
    inputSchema: ProfileBioInputSchema,
    outputSchema: ProfileBioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
