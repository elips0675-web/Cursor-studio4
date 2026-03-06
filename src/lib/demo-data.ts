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
    id: 'music',
    name_ru: 'Музыка',
    name_en: 'Music',
    img: 'https://picsum.photos/seed/cat_music/600/400',
    hint: 'concert crowd',
    subgroups: [
      { id: 101, name: 'Хип-хоп', members: 150, online: 25 },
      { id: 102, name: 'Рок', members: 200, online: 40 },
      { id: 103, name: 'Электроника', members: 180, online: 30 },
      { id: 104, name: 'Джаз & Блюз', members: 80, online: 10 },
      { id: 105, name: 'Классика', members: 60, online: 5 },
      { id: 106, name: 'Инди', members: 120, online: 20 },
      { id: 107, name: 'Поп', members: 300, online: 50 },
      { id: 108, name: 'Метал', members: 90, online: 15 },
      { id: 109, name: 'K-Pop', members: 250, online: 60 },
      { id: 110, name: 'Авторская песня', members: 70, online: 8 },
    ]
  },
  {
    id: 'sports',
    name_ru: 'Спорт',
    name_en: 'Sports',
    img: 'https://picsum.photos/seed/cat_sports/600/400',
    hint: 'stadium sports',
    subgroups: [
      { id: 201, name: 'Футбол', members: 400, online: 80 },
      { id: 202, name: 'Баскетбол', members: 250, online: 50 },
      { id: 203, name: 'Бег', members: 180, online: 35 },
      { id: 204, name: 'Йога и Фитнес', members: 300, online: 60 },
      { id: 205, name: 'Плавание', members: 150, online: 20 },
      { id: 206, name: 'Боевые искусства', members: 120, online: 25 },
      { id: 207, name: 'Теннис', members: 100, online: 15 },
      { id: 208, name: 'Велоспорт', members: 130, online: 18 },
      { id: 209, name: 'Зимние виды', members: 90, online: 12 },
      { id: 210, name: 'Шахматы', members: 70, online: 10 },
    ]
  },
  {
    id: 'creativity',
    name_ru: 'Творчество',
    name_en: 'Creativity',
    img: 'https://picsum.photos/seed/cat_creativity/600/400',
    hint: 'art supplies',
    subgroups: [
      { id: 301, name: 'Рисование', members: 220, online: 45 },
      { id: 302, name: 'Фотография', members: 350, online: 70 },
      { id: 303, name: 'Дизайн', members: 280, online: 60 },
      { id: 304, name: 'Писательство', members: 150, online: 25 },
      { id: 305, name: 'Рукоделие', members: 180, online: 30 },
      { id: 306, name: 'Скульптура', members: 50, online: 8 },
      { id: 307, name: 'Каллиграфия', members: 90, online: 15 },
      { id: 308, name: 'Актерское мастерство', members: 110, online: 20 },
      { id: 309, name: 'Создание видео', members: 160, online: 35 },
      { id: 310, name: 'Флористика', members: 70, online: 12 },
    ]
  },
  {
    id: 'gaming',
    name_ru: 'Игры',
    name_en: 'Gaming',
    img: 'https://picsum.photos/seed/cat_gaming/600/400',
    hint: 'video games',
    subgroups: [
      { id: 401, name: 'PC Гейминг', members: 500, online: 120 },
      { id: 402, name: 'PlayStation', members: 450, online: 100 },
      { id: 403, name: 'Xbox', members: 300, online: 70 },
      { id: 404, name: 'Nintendo Switch', members: 250, online: 50 },
      { id: 405, name: 'Мобильные игры', members: 600, online: 150 },
      { id: 406, name: 'Настольные игры', members: 200, online: 40 },
      { id: 407, name: 'VR/AR', members: 80, online: 15 },
      { id: 408, name: 'Киберспорт', members: 350, online: 80 },
      { id: 409, name: 'Ретро-гейминг', members: 100, online: 20 },
      { id: 410, name: 'Стриминг', members: 180, online: 45 },
    ]
  },
  {
    id: 'movies',
    name_ru: 'Кино и Сериалы',
    name_en: 'Movies & TV',
    img: 'https://picsum.photos/seed/cat_movies/600/400',
    hint: 'cinema theater',
    subgroups: [
      { id: 501, name: 'Netflix', members: 700, online: 150 },
      { id: 502, name: 'Marvel & DC', members: 600, online: 130 },
      { id: 503, name: 'Аниме', members: 550, online: 120 },
      { id: 504, name: 'Классика кино', members: 200, online: 30 },
      { id: 505, name: 'Артхаус', members: 150, online: 25 },
      { id: 506, name: 'Ужасы', members: 300, online: 60 },
      { id: 507, name: 'Комедии', members: 400, online: 80 },
      { id: 508, name: 'Фантастика', members: 500, online: 110 },
      { id: 509, name: 'Документалки', members: 180, online: 35 },
      { id: 510, name: 'Дорамы', members: 450, online: 90 },
    ]
  },
  {
    id: 'travel',
    name_ru: 'Путешествия',
    name_en: 'Travel',
    img: 'https://picsum.photos/seed/cat_travel/600/400',
    hint: 'world map',
    subgroups: [
      { id: 601, name: 'Походы', members: 250, online: 50 },
      { id: 602, name: 'Пляжный отдых', members: 400, online: 80 },
      { id: 603, name: 'Автопутешествия', members: 300, online: 60 },
      { id: 604, name: 'Путешествия по Азии', members: 200, online: 40 },
      { id: 605, name: 'Путешествия по Европе', members: 350, online: 70 },
      { id: 606, name: 'Экстремальный туризм', members: 120, online: 25 },
      { id: 607, name: 'Бюджетные путешествия', members: 280, online: 55 },
      { id: 608, name: 'Одиночные поездки', members: 180, online: 30 },
      { id: 609, name: 'Круизы', members: 90, online: 15 },
      { id: 610, name: 'Гастро-туры', members: 160, online: 35 },
    ]
  },
  {
    id: 'food',
    name_ru: 'Еда и Кулинария',
    name_en: 'Food & Cooking',
    img: 'https://picsum.photos/seed/cat_food/600/400',
    hint: 'delicious food',
    subgroups: [
      { id: 701, name: 'Домашняя выпечка', members: 300, online: 60 },
      { id: 702, name: 'Здоровое питание', members: 250, online: 50 },
      { id: 703, name: 'Кофейные гурманы', members: 400, online: 80 },
      { id: 704, name: 'Вегетарианство/Веганство', members: 200, online: 40 },
      { id: 705, name: 'Азиатская кухня', members: 280, online: 55 },
      { id: 706, name: 'Итальянская кухня', members: 350, online: 70 },
      { id: 707, name: 'Гриль и BBQ', members: 180, online: 35 },
      { id: 708, name: 'Вино и сыр', members: 220, online: 45 },
      { id: 709, name: 'Рецепты для ленивых', members: 150, online: 30 },
      { id: 710, name: 'Молекулярная кухня', members: 50, online: 10 },
    ]
  },
  {
    id: 'tech',
    name_ru: 'Технологии и IT',
    name_en: 'Tech & IT',
    img: 'https://picsum.photos/seed/cat_tech/600/400',
    hint: 'circuit board',
    subgroups: [
      { id: 801, name: 'Frontend', members: 400, online: 90 },
      { id: 802, name: 'Backend', members: 350, online: 80 },
      { id: 803, name: 'Data Science & AI', members: 300, online: 70 },
      { id: 804, name: 'Mobile Dev', members: 250, online: 50 },
      { id: 805, name: 'DevOps', members: 150, online: 30 },
      { id: 806, name: 'Гаджеты', members: 500, online: 110 },
      { id: 807, name: 'Стартапы', members: 280, online: 60 },
      { id: 808, name: 'Кибербезопасность', members: 200, online: 40 },
      { id: 809, name: 'UI/UX Дизайн', members: 320, online: 75 },
      { id: 810, name: 'Код-новички', members: 180, online: 45 },
    ]
  },
  {
    id: 'books',
    name_ru: 'Книги и Литература',
    name_en: 'Books & Literature',
    img: 'https://picsum.photos/seed/cat_books/600/400',
    hint: 'library books',
    subgroups: [
      { id: 901, name: 'Фантастика', members: 400, online: 80 },
      { id: 902, name: 'Фэнтези', members: 450, online: 90 },
      { id: 903, name: 'Детективы', members: 350, online: 70 },
      { id: 904, name: 'Классика', members: 200, online: 40 },
      { id: 905, name: 'Нон-фикшн', members: 250, online: 50 },
      { id: 906, name: 'Поэзия', members: 100, online: 20 },
      { id: 907, name: 'Современная проза', members: 300, online: 60 },
      { id: 908, name: 'Психология', members: 280, online: 55 },
      { id: 909, name: 'Комиксы и манга', members: 320, online: 75 },
      { id: 910, name: 'Аудиокниги', members: 180, online: 35 },
    ]
  },
  {
    id: 'selfdev',
    name_ru: 'Саморазвитие',
    name_en: 'Self-Development',
    img: 'https://picsum.photos/seed/cat_selfdev/600/400',
    hint: 'meditation nature',
    subgroups: [
      { id: 1001, name: 'Продуктивность', members: 300, online: 60 },
      { id: 1002, name: 'Медитация', members: 250, online: 50 },
      { id: 1003, name: 'Финансовая грамотность', members: 280, online: 55 },
      { id: 1004, name: 'Изучение языков', members: 400, online: 80 },
      { id: 1005, name: 'Публичные выступления', members: 150, online: 30 },
      { id: 1006, name: 'Психология', members: 350, online: 70 },
      { id: 1007, name: 'Философия', members: 120, online: 25 },
      { id: 1008, name: 'Карьерный рост', members: 220, online: 45 },
      { id: 1009, name: 'Эмоциональный интеллект', members: 180, online: 35 },
      { id: 1010, name: 'Стоицизм', members: 90, online: 15 },
    ]
  }
];
