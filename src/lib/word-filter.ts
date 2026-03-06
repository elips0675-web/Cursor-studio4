const FORBIDDEN_WORD_ROOTS = [
  // A list of forbidden word roots in lowercase
  // Russian swear words (example roots)
  'хуй', 'пизд', 'ебан', 'бля', 'ебл', 'муд', 'сука', 'залуп',
  // English swear words (example roots)
  'fuck', 'cunt', 'shit', 'bitch', 'asshole',
  // Politics (RU & EN)
  'политик', 'президент', 'правительств', 'выбор', 'митинг', 'оппозици', 'война',
  'politic', 'president', 'government', 'election', 'rally', 'opposition', 'war',
  // Hate speech (RU & EN)
  'нацист', 'расист', 'фашист',
  'nazi', 'racist', 'fascist',
  // Spam / Links
  'http:', 'https:', 'www.', '.com', '.ru', '.net', '.org', 't.me', 'vk.com'
];

export const containsForbiddenWords = (text: string): boolean => {
  const lowerCaseText = text.toLowerCase();
  // Using a loop for clarity and performance over regex for this simple case.
  for (const root of FORBIDDEN_WORD_ROOTS) {
    if (lowerCaseText.includes(root)) {
      return true;
    }
  }
  return false;
};
