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

export const ALL_DEMO_GROUPS = [
  { id: 1, name: 'Вечерние пробежки', members: 128, online: 12, img: 'https://picsum.photos/seed/group_run/600/400', category: 'Спорт', hint: 'people running' },
  { id: 2, name: 'Indie Music Lovers', members: 342, online: 45, img: 'https://picsum.photos/seed/group_music/600/400', category: 'Музыка', hint: 'concert crowd' },
  { id: 3, name: 'Digital Art & Chill', members: 89, online: 8, img: 'https://picsum.photos/seed/group_art/600/400', category: 'Творчество', hint: 'digital art' },
  { id: 4, name: 'Книжный клуб "Абзац"', members: 215, online: 21, img: 'https://picsum.photos/seed/group_books/600/400', category: 'Чтение', hint: 'books library' },
  { id: 5, name: 'Походы по Подмосковью', members: 176, online: 15, img: 'https://picsum.photos/seed/group_hike/600/400', category: 'Туризм', hint: 'hiking trail' },
  { id: 6, name: 'Геймеры Москвы', members: 500, online: 150, img: 'https://picsum.photos/seed/group_games/600/400', category: 'Игры', hint: 'video games' },
  { id: 7, name: 'Настолки по выходным', members: 54, online: 5, img: 'https://picsum.photos/seed/group_boardgames/600/400', category: 'Игры', hint: 'board games' },
  { id: 8, name: 'Киноклуб "4:3"', members: 112, online: 31, img: 'https://picsum.photos/seed/group_cinema/600/400', category: 'Кино', hint: 'cinema theater' },
];
