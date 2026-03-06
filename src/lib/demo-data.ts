import { PlaceHolderImages } from "./placeholder-images";

export const ALL_DEMO_USERS = [
  { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, hint: PlaceHolderImages[0].imageHint, online: true, distance: 2, match: 87, city: 'Москва', zodiac: 'Лев', interests: ['Фотография', 'Путешествия', 'Кофе', 'Музыка', 'Спорт'], bio: 'Люблю закаты, хороший кофе и интересные разговоры.', height: 172, goal: 'Серьезные отношения', gender: 'female', lookingFor: 'male' },
  
  // 5 Men for Anna
  { id: 2, name: 'Александр', age: 26, img: PlaceHolderImages[1].imageUrl, hint: PlaceHolderImages[1].imageHint, online: true, distance: 3, match: 95, city: 'Москва', zodiac: 'Овен', interests: ['Путешествия', 'Фотография', 'Бизнес'], bio: 'Всегда в движении. Ищу ту, кто разделит мою страсть к горам и кофе.', height: 185, goal: 'Серьезные отношения', gender: 'male', lookingFor: 'female' },
  { id: 4, name: 'Михаил', age: 28, img: PlaceHolderImages[3].imageUrl, hint: PlaceHolderImages[3].imageHint, online: false, distance: 5, match: 89, city: 'Москва', zodiac: 'Скорпион', interests: ['Музыка', 'Кофе', 'Кино'], bio: 'Играю на гитаре, варю лучший эспрессо. Давай сходим на концерт?', height: 182, goal: 'Свидания', gender: 'male', lookingFor: 'female' },
  { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, hint: PlaceHolderImages[5].imageHint, online: true, distance: 4, match: 84, city: 'Москва', zodiac: 'Близнецы', interests: ['IT технологии', 'Кино', 'Спорт'], bio: 'Кодю днем, бегаю вечером. Люблю умные разговоры.', height: 178, goal: 'Новые друзья', gender: 'male', lookingFor: 'female' },
  { id: 8, name: 'Иван', age: 27, img: PlaceHolderImages[7].imageUrl, hint: PlaceHolderImages[7].imageHint, online: false, distance: 8, match: 91, city: 'Москва', zodiac: 'Стрелец', interests: ['Туризм', 'Природа', 'Фотография'], bio: 'Пейзажный фотограф. Мечтаю о поездке в Исландию.', height: 188, goal: 'Серьезные отношения', gender: 'male', lookingFor: 'female' },
  { id: 10, name: 'Никита', age: 30, img: PlaceHolderImages[9].imageUrl, hint: PlaceHolderImages[9].imageHint, online: false, distance: 6, match: 78, city: 'Москва', zodiac: 'Водолей', interests: ['Наука', 'Чтение', 'Кофе'], bio: 'Ценю искренность и хороший юмор. Люблю открывать новые кофейни.', height: 180, goal: 'Свидания', gender: 'male', lookingFor: 'female' },

  // Other Women
  { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, hint: PlaceHolderImages[2].imageHint, online: false, distance: 3, match: 81, city: 'Москва', zodiac: 'Рыбы', interests: ['Искусство', 'Чтение', 'Кулинария'], bio: 'Ищу кого-то, кто любит музеи и долгие прогулки.', height: 168, goal: 'Свидания', gender: 'female', lookingFor: 'male' },
  { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, hint: PlaceHolderImages[4].imageHint, online: true, distance: 7, match: 88, city: 'Москва', zodiac: 'Дева', interests: ['Музыка', 'Творчество', 'Фотография'], bio: 'Мечтаю собрать свою группу и объехать мир.', height: 165, goal: 'Просто общение', gender: 'female', lookingFor: 'male' },
  { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, hint: PlaceHolderImages[6].imageHint, online: true, distance: 1, match: 94, city: 'Москва', zodiac: 'Скорпион', interests: ['Йога', 'Природа', 'Путешествия'], bio: 'Люблю готовить полезную еду и ходить в походы.', height: 170, goal: 'Серьезные отношения', gender: 'female', lookingFor: 'male' },
  { id: 9, name: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, hint: PlaceHolderImages[8].imageHint, online: true, distance: 6, match: 83, city: 'Москва', zodiac: 'Козерог', interests: ['Рукоделие', 'Дизайн', 'Искусство'], bio: 'Жизнь слишком коротка, чтобы носить скучную одежду.', height: 174, goal: 'Серьезные отношения', gender: 'female', lookingFor: 'male' }
];

export const GROUP_CATEGORIES = [
  {
    id: 'music', name_ru: 'Музыка', name_en: 'Music', img: 'https://picsum.photos/seed/cat_music/600/400', hint: 'concert crowd',
    subgroups: [
      { id: 101, name: 'Хип-хоп', members: 150, online: 25 }, { id: 102, name: 'Рок', members: 200, online: 40 },
      { id: 103, name: 'Электроника', members: 180, online: 30 }, { id: 104, name: 'Джаз & Блюз', members: 80, online: 10 },
      { id: 105, name: 'Классика', members: 60, online: 5 }, { id: 106, name: 'Инди', members: 120, online: 20 },
      { id: 107, name: 'Поп', members: 300, online: 50 }, { id: 108, name: 'Метал', members: 90, online: 15 },
      { id: 109, name: 'K-Pop', members: 250, online: 60 }, { id: 110, name: 'Авторская песня', members: 70, online: 8 },
      { id: 111, name: 'Техно', members: 160, online: 28 }, { id: 112, name: 'R&B / Соул', members: 130, online: 22 },
      { id: 113, name: 'Фолк', members: 50, online: 7 }, { id: 114, name: 'Саундтреки', members: 110, online: 18 },
      { id: 115, name: 'Регги', members: 85, online: 14 }, { id: 116, name: 'Кантри', members: 40, online: 4 },
      { id: 117, name: 'Панк-рок', members: 95, online: 17 }, { id: 118, name: 'Хаус', members: 140, online: 26 },
      { id: 119, name: 'Транс', members: 135, online: 24 }, { id: 120, name: 'Амбиент', members: 75, online: 9 },
    ]
  },
  {
    id: 'sports', name_ru: 'Спорт', name_en: 'Sports', img: 'https://picsum.photos/seed/cat_sports/600/400', hint: 'stadium sports',
    subgroups: [
      { id: 201, name: 'Футбол', members: 400, online: 80 }, { id: 202, name: 'Баскетбол', members: 250, online: 50 },
      { id: 203, name: 'Бег', members: 180, online: 35 }, { id: 204, name: 'Йога', members: 300, online: 60 },
      { id: 205, name: 'Плавание', members: 150, online: 20 }, { id: 206, name: 'Боевые искусства', members: 120, online: 25 },
      { id: 207, name: 'Теннис', members: 100, online: 15 }, { id: 208, name: 'Велоспорт', members: 130, online: 18 },
      { id: 209, name: 'Зимние виды', members: 90, online: 12 }, { id: 210, name: 'Шахматы', members: 70, online: 10 },
      { id: 211, name: 'Хоккей', members: 190, online: 38 }, { id: 212, name: 'Волейбол', members: 160, online: 30 },
      { id: 213, name: 'Фитнес и тренажерка', members: 350, online: 70 }, { id: 214, name: 'Автоспорт', members: 110, online: 22 },
      { id: 215, name: 'Скейтбординг', members: 80, online: 16 }, { id: 216, name: 'Настольный теннис', members: 95, online: 19 },
      { id: 217, name: 'Гольф', members: 50, online: 5 }, { id: 218, name: 'Конный спорт', members: 60, online: 8 },
      { id: 219, name: 'Сёрфинг', members: 40, online: 6 }, { id: 220, name: 'Скалолазание', members: 75, online: 14 },
    ]
  },
  {
    id: 'creativity', name_ru: 'Творчество', name_en: 'Creativity', img: 'https://picsum.photos/seed/cat_creativity/600/400', hint: 'art supplies',
    subgroups: [
      { id: 301, name: 'Рисование', members: 220, online: 45 }, { id: 302, name: 'Фотография', members: 350, online: 70 },
      { id: 303, name: 'UI/UX Дизайн', members: 280, online: 60 }, { id: 304, name: 'Писательство', members: 150, online: 25 },
      { id: 305, name: 'Рукоделие', members: 180, online: 30 }, { id: 306, name: 'Скульптура', members: 50, online: 8 },
      { id: 307, name: 'Каллиграфия', members: 90, online: 15 }, { id: 308, name: 'Актерское мастерство', members: 110, online: 20 },
      { id: 309, name: 'Создание видео', members: 160, online: 35 }, { id: 310, name: 'Флористика', members: 70, online: 12 },
      { id: 311, name: 'Графический дизайн', members: 240, online: 48 }, { id: 312, name: 'Игра на гитаре', members: 190, online: 38 },
      { id: 313, name: 'Мода и шитье', members: 140, online: 28 }, { id: 314, name: 'Гончарное дело', members: 60, online: 10 },
      { id: 315, name: 'Stand-up комедия', members: 80, online: 18 }, { id: 316, name: 'Создание украшений', members: 100, online: 21 },
      { id: 317, name: '3D-моделирование', members: 130, online: 27 }, { id: 318, name: 'DJ-инг', members: 95, online: 19 },
      { id: 319, name: 'Поэзия', members: 85, online: 16 }, { id: 320, name: 'Ландшафтный дизайн', members: 55, online: 9 },
    ]
  },
  {
    id: 'gaming', name_ru: 'Игры', name_en: 'Gaming', img: 'https://picsum.photos/seed/cat_gaming/600/400', hint: 'video games',
    subgroups: [
      { id: 401, name: 'PC Гейминг', members: 500, online: 120 }, { id: 402, name: 'PlayStation', members: 450, online: 100 },
      { id: 403, name: 'Xbox', members: 300, online: 70 }, { id: 404, name: 'Nintendo Switch', members: 250, online: 50 },
      { id: 405, name: 'Мобильные игры', members: 600, online: 150 }, { id: 406, name: 'Настольные игры', members: 200, online: 40 },
      { id: 407, name: 'VR/AR', members: 80, online: 15 }, { id: 408, name: 'Киберспорт', members: 350, online: 80 },
      { id: 409, name: 'Ретро-гейминг', members: 100, online: 20 }, { id: 410, name: 'Стриминг', members: 180, online: 45 },
      { id: 411, name: 'MMORPG', members: 420, online: 95 }, { id: 412, name: 'Инди-игры', members: 220, online: 48 },
      { id: 413, name: 'RPG', members: 380, online: 85 }, { id: 414, name: 'Стратегии', members: 260, online: 55 },
      { id: 415, name: 'Шутеры', members: 480, online: 110 }, { id: 416, name: 'Симуляторы', members: 190, online: 39 },
      { id: 417, name: 'Файтинги', members: 140, online: 28 }, { id: 418, name: 'Кооперативные игры', members: 330, online: 75 },
      { id: 419, name: 'Головоломки', members: 120, online: 24 }, { id: 420, name: 'D&D и ролёвки', members: 170, online: 35 },
    ]
  },
  {
    id: 'movies', name_ru: 'Кино и Сериалы', name_en: 'Movies & TV', img: 'https://picsum.photos/seed/cat_movies/600/400', hint: 'cinema theater',
    subgroups: [
      { id: 501, name: 'Netflix', members: 700, online: 150 }, { id: 502, name: 'Marvel & DC', members: 600, online: 130 },
      { id: 503, name: 'Аниме', members: 550, online: 120 }, { id: 504, name: 'Классика кино', members: 200, online: 30 },
      { id: 505, name: 'Артхаус', members: 150, online: 25 }, { id: 506, name: 'Ужасы', members: 300, online: 60 },
      { id: 507, name: 'Комедии', members: 400, online: 80 }, { id: 508, name: 'Фантастика', members: 500, online: 110 },
      { id: 509, name: 'Документалки', members: 180, online: 35 }, { id: 510, name: 'Дорамы', members: 450, online: 90 },
      { id: 511, name: 'HBO сериалы', members: 650, online: 140 }, { id: 512, name: 'Дисней', members: 380, online: 75 },
      { id: 513, name: 'Триллеры и детективы', members: 420, online: 88 }, { id: 514, name: 'Научная фантастика', members: 480, online: 100 },
      { id: 515, name: 'Ромкомы', members: 320, online: 65 }, { id: 516, name: 'Исторические фильмы', members: 190, online: 28 },
      { id: 517, name: 'Короткометражки', members: 90, online: 18 }, { id: 518, name: 'Европейское кино', members: 160, online: 29 },
      { id: 519, name: 'Азиатское кино', members: 280, online: 58 }, { id: 520, name: 'Кинофестивали', members: 130, online: 22 },
    ]
  },
  {
    id: 'travel', name_ru: 'Путешествия', name_en: 'Travel', img: 'https://picsum.photos/seed/cat_travel/600/400', hint: 'world map',
    subgroups: [
      { id: 601, name: 'Походы', members: 250, online: 50 }, { id: 602, name: 'Пляжный отдых', members: 400, online: 80 },
      { id: 603, name: 'Автопутешествия', members: 300, online: 60 }, { id: 604, name: 'Путешествия по Азии', members: 200, online: 40 },
      { id: 605, name: 'Путешествия по Европе', members: 350, online: 70 }, { id: 606, name: 'Экстремальный туризм', members: 120, online: 25 },
      { id: 607, name: 'Бюджетные путешествия', members: 280, online: 55 }, { id: 608, name: 'Одиночные поездки', members: 180, online: 30 },
      { id: 609, name: 'Круизы', members: 90, online: 15 }, { id: 610, name: 'Гастро-туры', members: 160, online: 35 },
      { id: 611, name: 'По России', members: 320, online: 65 }, { id: 612, name: 'США и Канада', members: 190, online: 38 },
      { id: 613, name: 'Латинская Америка', members: 140, online: 28 }, { id: 614, name: 'Африка', members: 70, online: 12 },
      { id: 615, 'name': 'Работа в путешествии', members: 210, online: 45 }, { id: 616, name: 'С палатками', members: 170, online: 34 },
      { id: 617, name: 'Экотуризм', members: 130, online: 26 }, { id: 618, name: 'Города-миллионники', members: 380, online: 78 },
      { id: 619, name: 'Острова', members: 230, online: 47 }, { id: 620, name: 'Необычные отели', members: 110, online: 21 },
    ]
  },
  {
    id: 'food', name_ru: 'Еда и Кулинария', name_en: 'Food & Cooking', img: 'https://picsum.photos/seed/cat_food/600/400', hint: 'delicious food',
    subgroups: [
      { id: 701, name: 'Домашняя выпечка', members: 300, online: 60 }, { id: 702, name: 'Здоровое питание', members: 250, online: 50 },
      { id: 703, name: 'Кофейные гурманы', members: 400, online: 80 }, { id: 704, name: 'Вегетарианство/Веганство', members: 200, online: 40 },
      { id: 705, name: 'Азиатская кухня', members: 280, online: 55 }, { id: 706, name: 'Итальянская кухня', members: 350, online: 70 },
      { id: 707, name: 'Гриль и BBQ', members: 180, online: 35 }, { id: 708, name: 'Вино и сыр', members: 220, online: 45 },
      { id: 709, name: 'Рецепты для ленивых', members: 150, online: 30 }, { id: 710, name: 'Молекулярная кухня', members: 50, online: 10 },
      { id: 711, name: 'Мексиканская кухня', members: 190, online: 38 }, { id: 712, name: 'Французская кухня', members: 170, online: 34 },
      { id: 713, name: 'Стрит-фуд', members: 320, online: 65 }, { id: 714, name: 'Коктейли и миксология', members: 210, online: 42 },
      { id: 715, name: 'Десерты', members: 290, online: 58 }, { id: 716, name: 'Ферментация', members: 80, online: 16 },
      { id: 717, name: 'Специи и соусы', members: 110, online: 22 }, { id: 718, name: 'Чайная церемония', members: 90, online: 18 },
      { id: 719, name: 'Фермерские продукты', members: 130, online: 26 }, { id: 720, name: 'Ресторанные обзоры', members: 240, online: 48 },
    ]
  },
  {
    id: 'tech', name_ru: 'Технологии и IT', name_en: 'Tech & IT', img: 'https://picsum.photos/seed/cat_tech/600/400', hint: 'circuit board',
    subgroups: [
      { id: 801, name: 'Frontend', members: 400, online: 90 }, { id: 802, name: 'Backend', members: 350, online: 80 },
      { id: 803, name: 'Data Science & AI', members: 300, online: 70 }, { id: 804, name: 'Mobile Dev', members: 250, online: 50 },
      { id: 805, name: 'DevOps', members: 150, online: 30 }, { id: 806, name: 'Гаджеты', members: 500, online: 110 },
      { id: 807, name: 'Стартапы', members: 280, online: 60 }, { id: 808, name: 'Кибербезопасность', members: 200, online: 40 },
      { id: 809, name: 'UI/UX Дизайн', members: 320, online: 75 }, { id: 810, name: 'Код-новички', members: 180, online: 45 },
      { id: 811, name: 'Python', members: 380, online: 85 }, { id: 812, name: 'JavaScript', members: 420, online: 95 },
      { id: 813, name: 'GameDev', members: 260, online: 55 }, { id: 814, name: 'QA / Тестирование', members: 190, online: 38 },
      { id: 815, name: 'Криптовалюты', members: 210, online: 42 }, { id: 816, name: 'Apple-фаны', members: 450, online: 100 },
      { id: 817, name: 'Android-фаны', members: 390, online: 88 }, { id: 818, name: 'Linux', members: 170, online: 34 },
      { id: 819, name: 'DIY Электроника', members: 110, online: 22 }, { id: 820, name: 'Умный дом', members: 230, online: 46 },
    ]
  },
  {
    id: 'books', name_ru: 'Книги', name_en: 'Books', img: 'https://picsum.photos/seed/cat_books/600/400', hint: 'library books',
    subgroups: [
      { id: 901, name: 'Фантастика', members: 400, online: 80 }, { id: 902, name: 'Фэнтези', members: 450, online: 90 },
      { id: 903, name: 'Детективы', members: 350, online: 70 }, { id: 904, name: 'Классика', members: 200, online: 40 },
      { id: 905, name: 'Нон-фикшн', members: 250, online: 50 }, { id: 906, name: 'Поэзия', members: 100, online: 20 },
      { id: 907, name: 'Современная проза', members: 300, online: 60 }, { id: 908, name: 'Психология', members: 280, online: 55 },
      { id: 909, name: 'Комиксы и манга', members: 320, online: 75 }, { id: 910, name: 'Аудиокниги', members: 180, online: 35 },
      { id: 911, name: 'Научная фантастика', members: 380, online: 78 }, { id: 912, name: 'Ужасы и мистика', members: 220, online: 44 },
      { id: 913, name: 'Романы', members: 290, online: 58 }, { id: 914, name: 'Биография', members: 160, online: 32 },
      { id: 915, name: 'Бизнес-литература', members: 210, online: 42 }, { id: 916, name: 'История', members: 190, online: 38 },
      { id: 917, name: 'Детские книги', members: 130, online: 26 }, { id: 918, name: 'Книжный клуб', members: 260, online: 52 },
      { id: 919, name: 'Молодежная литература', members: 240, online: 48 }, { id: 920, name: 'Философия', members: 140, online: 28 },
    ]
  },
  {
    id: 'selfdev', name_ru: 'Саморазвитие', name_en: 'Self-Dev', img: 'https://picsum.photos/seed/cat_selfdev/600/400', hint: 'meditation nature',
    subgroups: [
      { id: 1001, name: 'Продуктивность', members: 300, online: 60 }, { id: 1002, name: 'Медитация', members: 250, online: 50 },
      { id: 1003, name: 'Финансовая грамотность', members: 280, online: 55 }, { id: 1004, name: 'Изучение языков', members: 400, online: 80 },
      { id: 1005, name: 'Публичные выступления', members: 150, online: 30 }, { id: 1006, name: 'Психология', members: 350, online: 70 },
      { id: 1007, name: 'Философия', members: 120, online: 25 }, { id: 1008, name: 'Карьерный рост', members: 220, online: 45 },
      { id: 1009, name: 'Эмоциональный интеллект', members: 180, online: 35 }, { id: 1010, name: 'Стоицизм', members: 90, online: 15 },
      { id: 1011, name: 'Тайм-менеджмент', members: 260, online: 52 }, { id: 1012, name: 'Целеполагание', members: 230, online: 46 },
      { id: 1013, name: 'Нетворкинг', members: 190, online: 38 }, { id: 1014, name: 'Осознанность', members: 270, online: 54 },
      { id: 1015, name: 'Критическое мышление', members: 160, online: 32 }, { id: 1016, name: 'Здоровый образ жизни', members: 320, online: 64 },
      { id: 1017, name: 'Минимализм', members: 140, online: 28 }, { id: 1018, name: 'Эффективное обучение', members: 200, online: 40 },
      { id: 1019, name: 'Борьба с прокрастинацией', members: 240, online: 48 }, { id: 1020, name: 'Духовные практики', members: 110, online: 22 },
    ]
  },
  {
    id: 'fashion', name_ru: 'Мода и Стиль', name_en: 'Fashion & Style', img: 'https://picsum.photos/seed/cat_fashion/600/400', hint: 'fashion runway',
    subgroups: [
      { id: 1101, name: 'Стритвир', members: 300, online: 60 }, { id: 1102, name: 'Высокая мода', members: 150, online: 30 },
      { id: 1103, name: 'Винтаж', members: 180, online: 35 }, { id: 1104, name: 'Кроссовки', members: 250, online: 50 },
      { id: 1105, name: 'Минимализм', members: 200, online: 40 }, { id: 1106, name: 'Аксессуары', members: 170, online: 34 },
      { id: 1107, name: 'Уход за собой', members: 280, online: 56 }, { id: 1108, name: 'Парфюмерия', members: 220, online: 44 },
      { id: 1109, name: 'Капсульный гардероб', members: 160, online: 32 }, { id: 1110, name: 'DIY одежда', members: 130, online: 26 },
      { id: 1111, name: 'Люксовые бренды', members: 190, online: 38 }, { id: 1112, name: 'Эко-мода', members: 110, online: 22 },
      { id: 1113, name: 'Мужской стиль', members: 260, online: 52 }, { id: 1114, name: 'Женский стиль', members: 350, online: 70 },
      { id: 1115, name: 'История моды', members: 90, online: 18 }, { id: 1116, name: 'Макияж', members: 290, online: 58 },
      { id: 1117, name: 'Прически', members: 240, online: 48 }, { id: 1118, name: 'Секонд-хенд', members: 210, online: 42 },
      { id: 1119, name: 'Модные блоги', members: 270, online: 54 }, { id: 1120, name: 'Шопинг-советы', members: 320, online: 64 },
    ]
  },
  {
    id: 'health', name_ru: 'Здоровье', name_en: 'Health', img: 'https://picsum.photos/seed/cat_health/600/400', hint: 'healthy food yoga',
    subgroups: [
      { id: 1201, name: 'Правильное питание', members: 350, online: 70 }, { id: 1202, name: 'Фитнес дома', members: 300, online: 60 },
      { id: 1203, name: 'Тренажерный зал', members: 280, online: 56 }, { id: 1204, name: 'Йога и пилатес', members: 250, online: 50 },
      { id: 1205, name: 'Медитация', members: 200, online: 40 }, { id: 1206, name: 'Психическое здоровье', members: 220, online: 44 },
      { id: 1207, name: 'Бег', members: 180, online: 36 }, { id: 1208, name: 'Витамины и БАДы', members: 160, online: 32 },
      { id: 1209, name: 'Рецепты ПП', members: 290, online: 58 }, { id: 1210, name: 'Биохакинг', members: 130, online: 26 },
      { id: 1211, name: 'Интервальное голодание', members: 170, online: 34 }, { id: 1212, name: 'Кроссфит', members: 140, online: 28 },
      { id: 1213, name: 'Здоровый сон', members: 210, online: 42 }, { id: 1214, name: 'Закаливание', members: 90, online: 18 },
      { id: 1215, name: 'Детокс', members: 110, online: 22 }, { id: 1216, name: 'Массаж', members: 150, online: 30 },
      { id: 1217, name: 'Ароматерапия', members: 80, online: 16 }, { id: 1218, name: 'Веганство', members: 190, online: 38 },
      { id: 1219, name: 'Спортивное питание', members: 160, online: 32 }, { id: 1220, name: 'Челенджи здоровья', members: 230, online: 46 },
    ]
  },
  {
    id: 'pets', name_ru: 'Питомцы', name_en: 'Pets', img: 'https://picsum.photos/seed/cat_pets/600/400', hint: 'cute dog cat',
    subgroups: [
      { id: 1301, name: 'Собачники', members: 500, online: 100 }, { id: 1302, name: 'Кошатники', members: 600, online: 120 },
      { id: 1303, name: 'Грызуны', members: 150, online: 30 }, { id: 1304, name: 'Аквариумистика', members: 120, online: 24 },
      { id: 1305, name: 'Птицы', members: 100, online: 20 }, { id: 1306, name: 'Экзотические животные', members: 80, online: 16 },
      { id: 1307, name: 'Дрессировка', members: 200, online: 40 }, { id: 1308, name: 'Груминг', members: 180, online: 36 },
      { id: 1309, name: 'Волонтерство', members: 130, online: 26 }, { id: 1310, name: 'Фото питомцев', members: 300, online: 60 },
      { id: 1311, name: 'Породистые собаки', members: 220, online: 44 }, { id: 1312, name: 'Породистые кошки', members: 250, online: 50 },
      { id: 1313, name: 'Рептилии', members: 70, online: 14 }, { id: 1314, name: 'Здоровье питомцев', members: 190, online: 38 },
      { id: 1315, name: 'Смешные видео', members: 400, online: 80 }, { id: 1316, name: 'Выставки', members: 90, online: 18 },
      { id: 1317, name: 'Путешествия с животными', members: 110, online: 22 }, { id: 1318, name: 'Помощь бездомным', members: 160, online: 32 },
      { id: 1319, name: 'Амуниция и игрушки', members: 140, online: 28 }, { id: 1320, name: 'Конный спорт', members: 60, online: 12 },
    ]
  },
  {
    id: 'science', name_ru: 'Наука', name_en: 'Science', img: 'https://picsum.photos/seed/cat_science/600/400', hint: 'galaxy space',
    subgroups: [
      { id: 1401, name: 'Космос', members: 300, online: 60 }, { id: 1402, name: 'Физика', members: 200, online: 40 },
      { id: 1403, name: 'Биология', members: 250, online: 50 }, { id: 1404, name: 'Химия', members: 180, online: 36 },
      { id: 1405, name: 'Математика', members: 150, online: 30 }, { id: 1406, name: 'Научпоп', members: 400, online: 80 },
      { id: 1407, name: 'История науки', members: 120, online: 24 }, { id: 1408, name: 'Нейробиология', members: 220, online: 44 },
      { id: 1409, name: 'Экология', members: 190, online: 38 }, { id: 1410, name: 'Генетика', members: 160, online: 32 },
      { id: 1411, name: 'Астрономия', members: 280, online: 56 }, { id: 1412, name: 'Квантовая физика', members: 170, online: 34 },
      { id: 1413, name: 'Антропология', members: 110, online: 22 }, { id: 1414, name: 'Психология', members: 350, online: 70 },
      { id: 1415, name: 'Геология', members: 90, online: 18 }, { id: 1416, name: 'Лингвистика', members: 130, online: 26 },
      { id: 1417, name: 'Робототехника', members: 210, online: 42 }, { id: 1418, name: 'Будущее технологий', members: 320, online: 64 },
      { id: 1419, name: 'Научные эксперименты', members: 140, online: 28 }, { id: 1420, name: 'Дикая природа', members: 260, online: 52 },
    ]
  },
  {
    id: 'business', name_ru: 'Бизнес', name_en: 'Business', img: 'https://picsum.photos/seed/cat_business/600/400', hint: 'city skyline office',
    subgroups: [
      { id: 1501, name: 'Стартапы', members: 300, online: 60 }, { id: 1502, name: 'Инвестиции', members: 350, online: 70 },
      { id: 1503, name: 'Маркетинг', members: 280, online: 56 }, { id: 1504, name: 'Продажи', members: 250, online: 50 },
      { id: 1505, name: 'Менеджмент', members: 220, online: 44 }, { id: 1506, name: 'Криптовалюты', members: 400, online: 80 },
      { id: 1507, name: 'Недвижимость', members: 180, online: 36 }, { id: 1508, name: 'Личные финансы', members: 320, online: 64 },
      { id: 1509, name: 'E-commerce', members: 260, online: 52 }, { id: 1510, name: 'Нетворкинг', members: 200, online: 40 },
      { id: 1511, name: 'Франшизы', members: 120, online: 24 }, { id: 1512, name: 'HR и рекрутинг', members: 160, online: 32 },
      { id: 1513, name: 'Тайм-менеджмент', members: 290, online: 58 }, { id: 1514, name: 'Деловые переговоры', members: 190, online: 38 },
      { id: 1515, name: 'Женщины в бизнесе', members: 230, online: 46 }, { id: 1516, name: 'Пассивный доход', members: 270, online: 54 },
      { id: 1517, name: 'Бизнес-книги', members: 210, online: 42 }, { id: 1518, name: 'IT-бизнес', members: 380, online: 76 },
      { id: 1519, name: 'Социальное предпринимательство', members: 110, online: 22 }, { id: 1520, name: 'Ораторское искусство', members: 140, online: 28 },
    ]
  },
  {
    id: 'home', name_ru: 'Дом и Сад', name_en: 'Home & Garden', img: 'https://picsum.photos/seed/cat_home/600/400', hint: 'cozy interior garden',
    subgroups: [
      { id: 1601, name: 'Дизайн интерьера', members: 300, online: 60 }, { id: 1602, name: 'Садоводство', members: 250, online: 50 },
      { id: 1603, name: 'Комнатные растения', members: 350, online: 70 }, { id: 1604, name: 'DIY-ремонт', members: 200, online: 40 },
      { id: 1605, name: 'Минимализм', members: 180, online: 36 }, { id: 1606, name: 'Организация пространства', members: 220, online: 44 },
      { id: 1607, name: 'Умный дом', members: 280, online: 56 }, { id: 1608, name: 'Ландшафтный дизайн', members: 150, online: 30 },
      { id: 1609, name: 'Загородная жизнь', members: 190, online: 38 }, { id: 1610, name: 'Эко-дом', members: 120, online: 24 },
      { id: 1611, name: 'Скандинавский стиль', members: 260, online: 52 }, { id: 1612, name: 'Лофт', members: 170, online: 34 },
      { id: 1613, name: 'Балконные сады', members: 140, online: 28 }, { id: 1614, name: 'Мебель своими руками', members: 110, online: 22 },
      { id: 1615, name: 'Декор', members: 290, online: 58 }, { id: 1616, name: 'Строительство дома', members: 90, online: 18 },
      { id: 1617, name: 'Хюгге', members: 230, online: 46 }, { id: 1618, name: 'Вертикальные фермы', members: 70, online: 14 },
      { id: 1619, name: 'Вторая жизнь вещей', members: 160, online: 32 }, { id: 1620, name: 'Сезонные украшения', members: 130, online: 26 },
    ]
  },
  {
    id: 'cars', name_ru: 'Автомобили', name_en: 'Cars', img: 'https://picsum.photos/seed/cat_cars/600/400', hint: 'sports car',
    subgroups: [
      { id: 1701, name: 'Спорткары', members: 250, online: 50 }, { id: 1702, name: 'Классические авто', members: 180, online: 36 },
      { id: 1703, name: 'Внедорожники', members: 300, online: 60 }, { id: 1704, name: 'Электромобили', members: 220, online: 44 },
      { id: 1705, name: 'Тюнинг', members: 280, online: 56 }, { id: 1706, name: 'Автопутешествия', members: 200, online: 40 },
      { id: 1707, name: 'Мотоциклы', members: 350, online: 70 }, { id: 1708, name: 'Формула-1', members: 190, online: 38 },
      { id: 1709, name: 'Ремонт и обслуживание', members: 150, online: 30 }, { id: 1710, name: 'Автозвук', members: 120, online: 24 },
      { id: 1711, name: 'BMW', members: 290, online: 58 }, { id: 1712, name: 'Mercedes', members: 270, online: 54 },
      { id: 1713, name: 'Audi', members: 260, online: 52 }, { id: 1714, name: 'Японские авто', members: 320, online: 64 },
      { id: 1715, name: 'Американские авто', members: 170, online: 34 }, { id: 1716, name: 'Дрифт', members: 140, online: 28 },
      { id: 1717, name: 'Автовыставки', members: 110, online: 22 }, { id: 1718, name: 'Картинг', members: 90, online: 18 },
      { id: 1719, name: 'Ралли', members: 80, online: 16 }, { id: 1720, name: 'Продажа/покупка авто', members: 230, online: 46 },
    ]
  },
  {
    id: 'humor', name_ru: 'Юмор', name_en: 'Humor', img: 'https://picsum.photos/seed/cat_humor/600/400', hint: 'laughing people',
    subgroups: [
      { id: 1801, name: 'Мемы', members: 800, online: 150 }, { id: 1802, name: 'Stand-up', members: 400, online: 80 },
      { id: 1803, name: 'Черный юмор', members: 250, online: 50 }, { id: 1804, name: 'Анекдоты', members: 300, online: 60 },
      { id: 1805, name: 'Смешные видео', members: 700, online: 140 }, { id: 1806, name: 'Ирония и сарказм', members: 350, online: 70 },
      { id: 1807, name: 'КВН', members: 180, online: 36 }, { id: 1808, name: 'Комедийные шоу', members: 280, online: 56 },
      { id: 1809, name: 'Каламбуры', members: 220, online: 44 }, { id: 1810, name: 'Абсурдный юмор', members: 190, online: 38 },
      { id: 1811, name: 'Смешные истории из жизни', members: 450, online: 90 }, { id: 1812, name: 'Пранки', members: 150, online: 30 },
      { id: 1813, name: 'Комиксы', members: 320, online: 64 }, { id: 1814, name: 'Животные-приколисты', members: 500, online: 100 },
      { id: 1815, name: 'Профессиональный юмор', members: 170, online: 34 }, { id: 1816, name: 'Позитив', members: 600, online: 120 },
      { id: 1817, name: 'Пародии', members: 210, online: 42 }, { id: 1818, name: 'Тонкий юмор', members: 290, online: 58 },
      { id: 1819, name: 'IT-юмор', members: 260, online: 52 }, { id: 1820, name: 'Сатира', members: 160, online: 32 },
    ]
  },
  {
    id: 'dance', name_ru: 'Танцы', name_en: 'Dance', img: 'https://picsum.photos/seed/cat_dance/600/400', hint: 'dancing couple',
    subgroups: [
      { id: 1901, name: 'Хип-хоп', members: 250, online: 50 }, { id: 1902, name: 'Сальса и Бачата', members: 300, online: 60 },
      { id: 1903, name: 'Современные танцы', members: 220, online: 44 }, { id: 1904, name: 'Балет', members: 120, online: 24 },
      { id: 1905, name: 'Танго', members: 150, online: 30 }, { id: 1906, name: 'Клубные танцы', members: 350, online: 70 },
      { id: 1907, name: 'Народные танцы', members: 100, online: 20 }, { id: 1908, name: 'Брейк-данс', members: 180, online: 36 },
      { id: 1909, name: 'Джаз-модерн', members: 130, online: 26 }, { id: 1910, name: 'Вог', members: 160, online: 32 },
      { id: 1911, name: 'Зумба', members: 280, online: 56 }, { id: 1912, name: 'Свинг', members: 90, online: 18 },
      { id: 1913, name: 'Контемпорари', members: 190, online: 38 }, { id: 1914, name: 'Танцы на пилоне', members: 170, online: 34 },
      { id: 1915, name: 'K-Pop cover dance', members: 290, online: 58 }, { id: 1916, name: 'Исторические танцы', members: 70, online: 14 },
      { id: 1917, name: 'Тверк', members: 140, online: 28 }, { id: 1918, name: 'Танцевальная терапия', members: 110, online: 22 },
      { id: 1919, name: 'Фламенко', members: 80, online: 16 }, { id: 1920, name: 'Импровизация', members: 210, online: 42 },
    ]
  },
  {
    id: 'history', name_ru: 'История', name_en: 'History', img: 'https://picsum.photos/seed/cat_history/600/400', hint: 'ancient ruins',
    subgroups: [
      { id: 2001, name: 'Древний мир', members: 200, online: 40 }, { id: 2002, name: 'Средневековье', members: 250, online: 50 },
      { id: 2003, name: 'Новое время', members: 180, online: 36 }, { id: 2004, name: 'XX век', members: 300, online: 60 },
      { id: 2005, name: 'Военная история', members: 220, online: 44 }, { id: 2006, name: 'Археология', members: 150, online: 30 },
      { id: 2007, name: 'Мифология', members: 280, online: 56 }, { id: 2008, name: 'История России', members: 260, online: 52 },
      { id: 2009, name: 'Альтернативная история', members: 190, online: 38 }, { id: 2010, name: 'Реконструкция', members: 130, online: 26 },
      { id: 2011, name: 'История моды', members: 170, online: 34 }, { id: 2012, name: 'История искусств', members: 210, online: 42 },
      { id: 2013, name: 'Генеалогия', members: 110, online: 22 }, { id: 2014, name: 'История науки', members: 160, online: 32 },
      { id: 2015, name: 'Викинги', members: 230, online: 46 }, { id: 2016, name: 'Римская империя', members: 240, online: 48 },
      { id: 2017, name: 'Древний Египет', members: 190, online: 38 }, { id: 2018, name: 'Исторические мемы', members: 350, online: 70 },
      { id: 2019, name: 'Геральдика', members: 80, online: 16 }, { id: 2020, name: 'Культурология', members: 140, online: 28 },
    ]
  },
];
