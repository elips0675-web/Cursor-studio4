/**
 * @fileOverview Shared constants for the application to avoid duplication.
 */

export const INTEREST_OPTIONS = [
  "Авто", "Бизнес", "Животные", "Игры", "Искусство", "IT технологии", "Кино", "Кофе", "Кошки", "Кулинария", 
  "Музыка", "Наука", "Природа", "Путешествия", "Рыбалка", "Рукоделие", "Садоводство", "Собаки", "Спорт", 
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
  'Москва', 'Вашингтон', 'Лондон', 'Париж', 'Берлин', 'Пекин', 'Токио', 'Дели', 'Бразилиа', 'Канберра',
  'Оттава', 'Рим', 'Мадрид', 'Сеул', 'Мехико', 'Анкара', 'Каир', 'Буэнос-Айрес', 'Джакарта', 'Киев'
];

export const PET_OPTIONS = ["Нет", "Есть собака", "Есть кошка", "Есть другие", "Спроси в чате"];
export const SLEEP_SCHEDULE_OPTIONS = ["Жаворонок", "Сова", "Когда как"];
export const EDUCATION_OPTIONS = ["Среднее", "Среднее специальное", "Неоконченное высшее", "Высшее", "Ученая степень"];

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
