
"use client";

import { useState, useMemo, useCallback } from "react";
import { Heart, MapPin, Sparkles, X, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { generateMatchCompatibilityInsight } from "@/ai/flows/ai-match-compatibility-insight";

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

function HeartConfetti() {
  const hearts = Array.from({ length: 45 });
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [1, 1, 0], 
            scale: [0, 1.3, 0.7], 
            x: [`0px`, `${(Math.random() - 0.5) * 450}px`], 
            y: [`0px`, `${(Math.random() - 0.5) * 550}px`],
            rotate: Math.random() * 1080
          }}
          transition={{ 
            duration: 3, 
            ease: [0.16, 1, 0.3, 1], 
            delay: Math.random() * 0.5 
          }}
          className="absolute"
        >
          <Heart 
            size={Math.random() * 30 + 12} 
            fill={i % 3 === 0 ? "#fe3c72" : i % 3 === 1 ? "#ff8e53" : "#ffc0cb"} 
            className="text-transparent drop-shadow-xl" 
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [matchUser, setMatchUser] = useState<any>(null);
  const [compatibility, setCompatibility] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

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

  const user = filteredUsers[index % filteredUsers.length];

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'right') {
      handleLike();
    } else {
      setIndex(prev => prev + 1);
    }
  }, [user, filteredUsers]);

  const handleLike = async () => {
    if (!user) return;
    if (Math.random() > 0.6) {
      setMatchUser(user);
      getAiInsight(user);
    } else {
      setIndex(prev => prev + 1);
    }
  };

  const getAiInsight = async (targetUser: any) => {
    setLoadingAi(true);
    try {
      const res = await generateMatchCompatibilityInsight({
        currentUser: { name: "Вы", age: 25, interests: ["Спорт", "Кино", "Кофе"], bio: "Активный парень, люблю новые знакомства." },
        matchUser: { name: targetUser.name, age: targetUser.age, interests: targetUser.interests, bio: targetUser.bio }
      });
      setCompatibility(res.explanation);
    } catch (e) {
      setCompatibility("Вы отлично подходите друг другу!");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleStartChat = () => {
    if (matchUser) router.push(`/chats?matchId=${matchUser.id}`);
  };

  const handleDirectMessage = () => {
    if (user) router.push(`/chats?matchId=${user.id}`);
  };

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-hidden px-4 pt-4 pb-24 flex flex-col items-center relative bg-[#f8f9fb]">
        <div className="flex items-center justify-center w-full max-w-sm mb-4 z-10">
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center gap-2 text-[11px] text-primary font-bold border border-primary/5 shadow-md">
            <Sparkles size={14} />
            <span>{filteredUsers.length} анкет рядом</span>
          </div>
        </div>

        <div className="relative w-full flex-1 mb-6 max-w-[420px] flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {filteredUsers.length > 0 ? (
              <motion.div 
                key={user.id} 
                style={{ x, rotate, opacity }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) handleSwipe('right');
                  else if (info.offset.x < -100) handleSwipe('left');
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                whileDrag={{ scale: 1.05 }}
                className="absolute w-full h-full bg-white rounded-[2.5rem] overflow-hidden app-shadow flex flex-col border-4 border-white"
              >
                <div className="relative flex-1 pointer-events-none select-none">
                  <Image 
                    src={user.img} 
                    alt={user.name} 
                    fill 
                    data-ai-hint={user.hint} 
                    className="object-cover" 
                    priority 
                  />
                  <div className="absolute top-4 left-4">
                     <Badge className="bg-[#2ecc71] text-white border-0 px-3 py-1 text-[10px] font-bold shadow-lg">Онлайн</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                     <Badge className="gradient-bg text-white border-0 px-3 py-1 font-bold shadow-lg">
                       {user.match}% совпадение
                     </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <h3 className="text-3xl font-black font-headline mb-1 drop-shadow-md">{user.name}, {user.age}</h3>
                    <p className="text-white/90 text-xs flex items-center gap-1 font-bold mb-3">
                      <MapPin size={14} /> {user.distance} км от вас
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
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-muted shadow-inner">
                <X size={32} className="text-muted-foreground mb-4" />
                <h4 className="text-lg font-bold uppercase tracking-tight">Никого не нашли</h4>
                <p className="text-xs text-muted-foreground mt-2">Попробуйте зайти позже</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 z-10 pb-4">
          <button 
            onClick={() => setIndex(prev => prev + 1)} 
            className="w-14 h-14 rounded-full bg-white text-muted-foreground flex items-center justify-center hover:bg-muted active:scale-90 transition-all app-shadow border border-border/40 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform" />
          </button>
          
          <button 
            disabled={filteredUsers.length === 0} 
            onClick={handleLike} 
            className="w-20 h-20 rounded-full bg-white border-4 border-primary text-primary flex items-center justify-center hover:scale-110 active:scale-95 transition-all app-shadow disabled:opacity-50 group"
          >
            <Heart size={36} fill="currentColor" className="group-hover:animate-pulse" />
          </button>

          <button 
            disabled={filteredUsers.length === 0}
            onClick={handleDirectMessage}
            className="w-14 h-14 rounded-full bg-white text-blue-500 flex items-center justify-center hover:bg-blue-50 active:scale-90 transition-all app-shadow border border-blue-100 group"
            title="Личные сообщения"
          >
            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </main>

      <Dialog open={!!matchUser} onOpenChange={() => setMatchUser(null)}>
        <DialogContent className="max-w-[360px] rounded-[2.5rem] border-0 bg-white p-0 overflow-hidden app-shadow">
          <HeartConfetti />
          
          <div className="relative h-40 gradient-bg flex items-center justify-center">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", damping: 10, stiffness: 100 }}
               className="relative z-10 bg-white p-4 rounded-full shadow-2xl"
             >
               <Heart className="text-primary animate-pulse" size={32} fill="currentColor" />
             </motion.div>
          </div>

          <div className="px-6 py-10 text-center -mt-10 bg-white rounded-t-[2.5rem] relative">
            <div className="flex items-center justify-center gap-0 mb-8 relative h-28">
               <motion.div 
                 initial={{ x: -50, opacity: 0, rotate: -10 }}
                 animate={{ x: 0, opacity: 1, rotate: -5 }}
                 transition={{ delay: 0.2 }}
                 className="w-28 h-28 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-10 -mr-6"
               >
                  <Image 
                    src={PlaceHolderImages[10].imageUrl} 
                    alt="Вы" 
                    fill 
                    data-ai-hint={PlaceHolderImages[10].imageHint}
                    className="object-cover" 
                  />
               </motion.div>
               <motion.div 
                 initial={{ x: 50, opacity: 0, rotate: 10 }}
                 animate={{ x: 0, opacity: 1, rotate: 5 }}
                 transition={{ delay: 0.3 }}
                 className="w-28 h-28 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-0"
               >
                  <Image 
                    src={matchUser?.img || PlaceHolderImages[0].imageUrl} 
                    alt={matchUser?.name} 
                    fill 
                    data-ai-hint={matchUser?.hint || PlaceHolderImages[0].imageHint}
                    className="object-cover" 
                  />
               </motion.div>
            </div>

            <DialogTitle className="text-2xl font-black font-headline mb-2 gradient-text uppercase tracking-tight">Это совпадение!</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mb-6 px-4 leading-relaxed font-medium">
               Вы с <span className="font-bold text-foreground">{matchUser?.name}</span> понравились друг другу.
            </DialogDescription>
            
            <div className="bg-primary/5 p-5 rounded-[2rem] mb-8 text-left border border-primary/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 text-primary/20">
                <Sparkles size={24} />
              </div>
              <h4 className="text-[10px] font-black text-primary mb-2 flex items-center gap-1 uppercase tracking-widest">
                <Sparkles size={12} /> AI Инсайт
              </h4>
              {loadingAi ? (
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Анализируем...
                </div>
              ) : (
                <p className="text-[11px] leading-relaxed text-foreground/80 italic font-medium">
                  {compatibility}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={handleStartChat} className="w-full h-16 rounded-full gradient-bg text-white font-black uppercase tracking-[0.15em] text-[11px] shadow-lg shadow-primary/20">
                Написать первым
              </Button>
              <Button variant="ghost" onClick={() => setMatchUser(null)} className="w-full h-12 rounded-full text-muted-foreground font-black uppercase tracking-[0.1em] text-[10px]">
                Продолжить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <BottomNav />
    </>
  );
}
