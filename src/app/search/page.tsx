
"use client";

import { useState, useMemo } from "react";
import { MapPin, User, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

const ALL_USERS = [
  { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, hint: PlaceHolderImages[0].imageHint, interests: ['Фотография', 'Путешествия', 'Кофе'], bio: 'Люблю закаты, хороший кофе и интересные разговоры.', distance: 2, match: 87, gender: 'female' },
  { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, hint: PlaceHolderImages[1].imageHint, interests: ['Спорт', 'IT', 'Книги'], bio: 'Ищу компанию для пробежек и обсуждения технологий.', distance: 5, match: 92, gender: 'male' },
  { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, hint: PlaceHolderImages[2].imageHint, interests: ['Искусство', 'Книги', 'Вино'], bio: 'Ищу кого-то, кто любит музеи и долгие прогулки.', distance: 3, match: 81, gender: 'female' },
  { id: 4, name: 'Дмитрий', age: 31, img: PlaceHolderImages[3].imageUrl, hint: PlaceHolderImages[3].imageHint, interests: ['Бизнес', 'Авто', 'Спорт'], bio: 'Ценю время и качественный отдых.', distance: 12, match: 75, gender: 'male' },
  { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, hint: PlaceHolderImages[4].imageHint, interests: ['Музыка', 'Гитара', 'Фестивали'], bio: 'Мечтаю собрать свою группу и объехать мир.', distance: 7, match: 88, gender: 'female' },
  { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, hint: PlaceHolderImages[5].imageHint, interests: ['Игры', 'Аниме', 'Пицца'], bio: 'Давай поиграем вместе или посмотрим сериал.', distance: 4, match: 69, gender: 'male' },
  { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, hint: PlaceHolderImages[6].imageHint, interests: ['Йога', 'Кулинария', 'Природа'], bio: 'Люблю готовить полезную еду и ходить в походы.', distance: 1, match: 94, gender: 'female' },
  { id: 8, name: 'Иван', age: 27, img: PlaceHolderImages[7].imageUrl, hint: PlaceHolderImages[7].imageHint, interests: ['Фотография', 'Горы', 'Кемпинг'], bio: 'Пейзажный фотограф в поисках приключений.', distance: 15, match: 72, gender: 'male' },
  { id: 9, name: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, hint: PlaceHolderImages[8].imageHint, interests: ['Мода', 'Дизайн', 'Вечеринки'], bio: 'Жизнь слишком коротка, чтобы носить скучную одежду.', distance: 6, match: 83, gender: 'female' },
  { id: 10, name: 'Никита', age: 30, img: PlaceHolderImages[9].imageUrl, hint: PlaceHolderImages[9].imageHint, interests: ['Наука', 'История', 'Музеи'], bio: 'Люблю узнавать что-то новое каждый день.', distance: 9, match: 77, gender: 'male' }
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.8,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};


export default function SearchPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [ageRange] = useState([18, 40]);
  const [maxDistance] = useState([50]);
  const [selectedInterests] = useState<string[]>([]);
  const [selectedGender] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return ALL_USERS.filter(user => {
      const matchesAge = user.age >= ageRange[0] && user.age <= ageRange[1];
      const matchesDistance = user.distance <= maxDistance[0];
      const matchesInterests = selectedInterests.length === 0 || 
        user.interests.some(interest => selectedInterests.includes(interest));
      const matchesGender = selectedGender === 'all' || user.gender === selectedGender;
      return matchesAge && matchesDistance && matchesInterests && matchesGender;
    });
  }, [ageRange, maxDistance, selectedInterests, selectedGender]);

  const [[page, direction], setPage] = useState([0, 0]);
  
  const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  };

  const userIndex = wrap(0, filteredUsers.length, page);
  const user = filteredUsers[userIndex];

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  if (!user) {
    return (
        <>
            <AppHeader />
            <main className="flex-1 overflow-hidden px-4 pt-4 pb-24 flex flex-col items-center justify-center relative bg-[#f8f9fb]">
                 <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-muted shadow-inner">
                    <User size={32} className="text-muted-foreground mb-4" />
                    <h4 className="text-lg font-bold uppercase tracking-tight">{language === 'RU' ? 'Никого не нашли' : 'No one found'}</h4>
                    <p className="text-xs text-muted-foreground mt-2">{language === 'RU' ? 'Попробуйте изменить фильтры' : 'Try changing your filters'}</p>
                </div>
            </main>
            <BottomNav />
        </>
    )
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-hidden px-4 pt-4 pb-24 flex flex-col items-center relative bg-[#f8f9fb]">
        <div className="text-center mb-4">
            <Badge variant="outline" className="text-[8px] font-bold text-muted-foreground border-muted px-2 py-0.5 rounded-full uppercase tracking-tighter bg-white shadow-sm">{userIndex + 1} / {filteredUsers.length}</Badge>
        </div>
        <div className="relative w-full flex-1 mb-6 max-w-[420px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full h-full bg-white rounded-[2.5rem] overflow-hidden app-shadow flex flex-col border-4 border-white cursor-grab active:cursor-grabbing"
            >
              <div className="relative flex-1 select-none">
                  <Image 
                    src={user.img} 
                    alt={user.name} 
                    fill 
                    data-ai-hint={user.hint} 
                    className="object-cover" 
                    priority 
                  />
                  <div className="absolute top-4 left-4">
                     <Badge className="bg-[#2ecc71] text-white border-0 px-3 py-1 text-[10px] font-bold shadow-lg">{language === 'RU' ? 'Онлайн' : 'Online'}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                     <Badge className="gradient-bg text-white border-0 px-3 py-1 font-bold shadow-lg">
                       {user.match}% {language === 'RU' ? 'совпадение' : 'match'}
                     </Badge>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <h3 className="text-3xl font-black font-headline mb-1 drop-shadow-md">{user.name}, {user.age}</h3>
                    <p className="text-white/90 text-xs flex items-center gap-1 font-bold mb-3">
                      <MapPin size={14} /> {user.distance} {language === 'RU' ? 'км от вас' : 'km from you'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {user.interests.slice(0, 3).map(i => (
                        <span key={i} className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-[8px] rounded-full font-black uppercase tracking-widest border border-white/10">{i}</span>
                      ))}
                    </div>
                    <p className="text-white/80 text-[10px] leading-tight italic line-clamp-2">"{user.bio}"</p>
                  </div>
                </div>
            </motion.div>
          </AnimatePresence>
          <button onClick={() => paginate(-1)} className="absolute left-0 z-10 p-2 bg-white/50 rounded-full text-foreground backdrop-blur-sm shadow-md hover:bg-white transition-all">
             <ChevronLeft size={24}/>
          </button>
           <button onClick={() => paginate(1)} className="absolute right-0 z-10 p-2 bg-white/50 rounded-full text-foreground backdrop-blur-sm shadow-md hover:bg-white transition-all">
             <ChevronRight size={24}/>
          </button>
        </div>

        <Button 
            onClick={() => router.push(`/user?id=${user.id}`)}
            className="w-full max-w-xs h-14 rounded-full gradient-bg text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all text-sm flex items-center gap-2"
          >
            <User size={20} />
            {language === 'RU' ? "Посмотреть профиль" : "View Profile"}
        </Button>
      </main>
      
      <BottomNav />
    </>
  );
}
