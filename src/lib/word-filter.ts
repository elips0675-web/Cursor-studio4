const FORBIDDEN_WORD_ROOTS = [
  // Нецензурная лексика (Swear words)
  'хуй', 'пизд', 'ебан', 'бля', 'ебл', 'муд', 'сука', 'залуп', 'уеб',
  'fuck', 'cunt', 'shit', 'bitch', 'asshole', 'dick',

  // Оскорбления и Дискриминация (Insults & Discrimination)
  'мразь', 'урод', 'дебил', 'шлюх', 'ниггер', 'хохол', 'кацап', 'жид',
  'scum', 'freak', 'moron', 'slut', 'nigger', 

  // Призывы к насилию (Calls to violence)
  'уби', 'насил', 'террор', 'экстрем', 'расправ', 'взорв',
  'kill', 'murder', 'violen', 'terror', 'extremis', 'slaughter',

  // Политика (Politics)
  'политик', 'президент', 'правительств', 'выбор', 'митинг', 'оппозици', 'война',
  'politic', 'president', 'government', 'election', 'rally', 'opposition', 'war', 'навальн',

  // Спам и Реклама (Spam & Ads)
  'http:', 'https:', 'www.', '.com', '.ru', '.net', '.org', 't.me', 'vk.com',
  'купи', 'продай', 'акция', 'скидк', 'заработ', 'казино', 'ставк', 'крипт',
  'buy', 'sell', 'promo', 'discount', 'earn', 'casino', 'bet', 'crypto',

  // Мошенничество (Scam)
  'бинарн', 'опцион', 'пирамид',
  'binary', 'option', 'pyramid',

  // Запрещенные товары и услуги (Forbidden goods & services)
  'нарко', 'оружи', 'проститут', 'порно',
  'drug', 'weapon', 'prostitut', 'porn',

  // Конкуренты (Competitors)
  'tinder', 'badoo', 'mamba', 'pure', 'тиндер', 'баду', 'мамба'
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
