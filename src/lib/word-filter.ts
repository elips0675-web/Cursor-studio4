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
  'politic', 'president', 'government', 'election', 'rally', 'opposition', 'war', 
  'навальн', 'путин', 'лукашенк', 'пересидент', 'зеленск', 'байден', 'трамп', 
  'сво', 'спецопераци', 'кремль', 'госдума', 'майдан',

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

/**
 * Checks if the text contains forbidden words.
 */
export const containsForbiddenWords = (text: string): boolean => {
  const lowerCaseText = text.toLowerCase();
  for (const root of FORBIDDEN_WORD_ROOTS) {
    if (lowerCaseText.includes(root)) {
      return true;
    }
  }
  return false;
};

/**
 * Checks if the text is likely a nonsensical keyboard mash (gibberish).
 */
export const isGibberish = (text: string): boolean => {
  const normalized = text.toLowerCase().trim();
  if (!normalized) return false;

  // 1. Repeating characters like "aaaaaaa" or "!!!!! "
  if (/(.)\1{4,}/.test(normalized)) return true;

  const words = normalized.split(/\s+/);

  for (const word of words) {
    const letters = word.replace(/[^a-zа-яё]/g, '');
    if (letters.length < 3) continue;

    // 2. No vowels at all in a word of 3+ letters.
    const vowelsMatch = letters.match(/[aeiouyаеёиоуыэюя]/g);
    const vowelsCount = vowelsMatch ? vowelsMatch.length : 0;
    if (letters.length >= 3 && vowelsCount === 0) return true;

    // 3. Check for excessive consonant clusters.
    // Whitelist for common Russian 4-consonant clusters.
    const allowed_4_consonant_clusters = [
        'взгл', // взгляд
        'вств', // чувство
        'вспл', // всплеск
        'здрв', // здравствуй
        'кстр', // экстренный
        'нтрв', // контр-
        'ртств', // черствый
        'рвств' // первенство
    ];
    // Find clusters of 4 or more consonants
    const consonantClusters = letters.match(/[bcdfghjklmnpqrstvwxzбвгджзйклмнпрстфхцчшщ]{4,}/g);
    if (consonantClusters) {
      for (const cluster of consonantClusters) {
        if (cluster.length === 4 && allowed_4_consonant_clusters.includes(cluster)) {
          continue; // It's an allowed cluster, so check the next one
        }
        // If the cluster has 5+ consonants, or it's a 4-consonant cluster not in the whitelist,
        // it's gibberish.
        return true;
      }
    }

    // 4. Common keyboard row sequences (mashing)
    const mashPatterns = [
      'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl', 'zxcv', 'xcvb',
      'йцук', 'цуке', 'укен', 'кенг', 'фыва', 'ывап', 'вапр', 'апро', 'прол', 'ролд', 'олдж',
      'ячсм', 'чсми', 'смит', 'мить',
      // User reported patterns
      'ишрл', 'шрлш', 'рлши', 'некн', 'кегн', 'егнн'
    ];

    for (const pattern of mashPatterns) {
      if (letters.includes(pattern)) return true;
    }
  }

  return false;
};