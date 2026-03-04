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
  mood: z
    .string()
    .optional()
    .describe("The desired mood or theme for the icebreaker (e.g., 'Funny', 'Romantic', 'Deep')."),
});
export type IcebreakerInput = z.infer<typeof IcebreakerInputSchema>;

const IcebreakerOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe("A list of AI-generated icebreaker suggestions or opening lines in Russian."),
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
  prompt: `Вы — эксперт по общению и харизматичный помощник в приложении для знакомств SwiftMatch. Ваша задача — придумать 3-4 уникальных и цепляющих фразы для начала диалога (icebreakers) на РУССКОМ ЯЗЫКЕ.

ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ:
- Имя собеседника: {{{matchedUserName}}}
- Его интересы: {{{matchedUserInterests}}}
- Его био: {{{matchedUserBio}}}
- Мои интересы: {{{currentUserInterests}}}

ЖЕЛАЕМОЕ НАСТРОЕНИЕ (MOOD):
{{#if mood}}
{{{mood}}}
{{else}}
Дружелюбное и естественное.
{{/if}}

ТРЕБОВАНИЯ:
1. Пишите только на РУССКОМ ЯЗЫКЕ.
2. Фразы должны быть короткими, живыми и не звучать как робот. 
3. Избегайте банальных "Привет, как дела?". 
4. Используйте общие интересы или детали из био для персонализации.
5. Если задан mood "Романтика", будьте милыми и искренними.
6. Если задан mood "Юмор", добавьте легкую шутку или иронию.
7. Если задан mood "Глубокое", задайте интересный вопрос о жизни или ценностях.
8. Если задан mood "Смело", будьте дерзкими, но уважительными (флирт).

Результат должен быть списком строк в формате JSON.

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
