/**
 * @fileOverview Shared constants for the application to avoid duplication.
 */

export const INTEREST_OPTIONS = [
  "Авто", "Бизнес", "Питомцы", "Игры", "Искусство", "IT технологии", "Кино", "Кофе", "Кошки", "Кулинария", 
  "Музыка", "Наука", "Природа", "Путешествия", "Рыбалка", "Рукоделие", "Садоводство", "Спорт", 
  "Творчество", "Туризм", "Фотография", "Чтение", "Йога"
];

export const DATING_GOALS = [
  "Серьезные отношения",
  "Свидания",
  "Новые друзья",
  "Просто общение",
  "Пока не знаю"
];

export const ZODIAC_SIGNS = [
  "Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева", 
  "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"
];

export const CAPITALS = [
  'Анкара', 'Берлин', 'Бразилиа', 'Буэнос-Айрес', 'Вашингтон', 'Дели', 'Джакарта', 'Каир', 'Канберра', 'Киев', 
  'Лондон', 'Мадрид', 'Мехико', 'Москва', 'Оттава', 'Париж', 'Пекин', 'Рим', 'Сеул', 'Токио'
].sort((a, b) => a.localeCompare(b));

export const PET_OPTIONS = ["Нет", "Есть собака", "Есть кошка", "Есть другие", "Спроси в чате"];
export const SLEEP_SCHEDULE_OPTIONS = ["Жаворонок", "Сова", "Когда как"];
export const EDUCATION_OPTIONS = ["Среднее", "Среднее специальное", "Неоконченное высшее", "Высшее", "Ученая степень"];

export const CIRCADIAN_RHYTHM_OPTIONS = [
    { value: 'lark', label: 'Жаворонок' },
    { value: 'owl', label: 'Сова' },
    { value: 'flexible', label: 'Когда как' },
];

export interface TitleMetadata {
  id: string;
  name_ru: string;
  name_en: string;
  color: string;
  priority: number;
}

export const ALL_TITLES: TitleMetadata[] = [
  { id: 'king', name_ru: 'Король свиданий', name_en: 'Dating King', color: 'bg-amber-50 text-amber-600', priority: 4 },
  { id: 'party', name_ru: 'Душа компании', name_en: 'Life of the Party', color: 'bg-blue-50 text-blue-600', priority: 3 },
  { id: 'romantic', name_ru: 'Обаяшка', name_en: 'Charming', color: 'bg-pink-50 text-pink-600', priority: 2 },
  { id: 'rookie', name_ru: 'Романтик', name_en: 'Romantic', color: 'bg-slate-100 text-slate-600', priority: 1 }
];
