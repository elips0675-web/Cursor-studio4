
"use client";

import { useState, useMemo, useCallback } from "react";
import { Heart, MapPin, Sparkles, X, User, Cpu, MessageCircle } from "lucide-react";
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

function HeartConfetti() {
  const hearts = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "100%", x: 0, opacity: 1 }}
          animate={{
            y: -(Math.random() * 200 + 100),
            x: (Math.random() - 0.5) * 500,
            scale: Math.random() * 1.2 + 0.8,
            opacity: [1, 1, 0],
            rotate: (Math.random() - 0.5) * 540,
          }}
          transition={{
            duration: Math.random() * 2 + 2.5,
            ease: "easeOut",
            delay: 0.2,
          }}
          className="absolute bottom-0"
        >
          <Heart
            size={Math.random() * 25 + 15}
            fill={i % 3 === 0 ? "#fe3c72" : i % 3 === 1 ? "#ff8e53" : "#ffc0cb"}
            className="text-transparent drop-shadow-lg"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
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

  const handleLike = async () => {
    if (!user) return;
    if (Math.random() > 0.6) {
      setMatchUser(user);
      getAiInsight(user);
    } else {
      setIndex(prev => prev + 1);
    }
  };

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'right') {
      handleLike();
    } else {
      setIndex(prev => prev + 1);
    }
  }, [user, filteredUsers, handleLike]);

  const getAiInsight = async (targetUser: any) => {
    setLoadingAi(true);
    try {
      const res = await generateMatchCompatibilityInsight({
        currentUser: { name: "Вы", age: 25, interests: ["Спорт", "Кино", "Кофе"], bio: "Активный парень, люблю новые знакомства." },
        matchUser: { name: targetUser.name, age: targetUser.age, interests: targetUser.interests, bio: targetUser.bio }
      });
      setCompatibility(res.explanation);
    } catch (e) {
      setCompatibility(t('match.insight_default') || "Great match!");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleStartChat = () => {
    if (matchUser) router.push(`/chats?matchId=${matchUser.id}`);
  };

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-hidden px-4 pt-4 pb-24 flex flex-col items-center relative bg-[#f8f9fb]">
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
                className="absolute w-full h-full bg-white rounded-[2.5rem] overflow-hidden app-shadow flex flex-col border-4 border-white cursor-pointer"
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

                  <motion.div style={{ opacity: nopeOpacity }} className="absolute top-12 left-8 text-rose-500 font-black text-4xl uppercase -rotate-[20deg] border-4 border-rose-500 rounded-2xl px-4 py-1 tracking-widest">НЕТ</motion.div>
                  <motion.div style={{ opacity: likeOpacity }} className="absolute top-12 right-8 text-emerald-400 font-black text-4xl uppercase rotate-[20deg] border-4 border-emerald-400 rounded-2xl px-4 py-1 tracking-widest">ЛАЙК</motion.div>

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
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-center p-8 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-muted shadow-inner">
                <X size={32} className="text-muted-foreground mb-4" />
                <h4 className="text-lg font-bold uppercase tracking-tight">{language === 'RU' ? 'Никого не нашли' : 'No one found'}</h4>
                <p className="text-xs text-muted-foreground mt-2">{language === 'RU' ? 'Попробуйте зайти позже' : 'Please try again later'}</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-around w-full max-w-md z-10 pb-4">
          <button 
            onClick={() => handleSwipe('left')} 
            disabled={filteredUsers.length === 0}
            className="w-16 h-16 rounded-full bg-white text-muted-foreground flex items-center justify-center hover:bg-muted active:scale-90 transition-all app-shadow border border-border/40 group"
          >
            <X size={28} />
          </button>
          
          <button 
            disabled={filteredUsers.length === 0}
            onClick={() => router.push(`/user?id=${user.id}`)}
            className="w-14 h-14 rounded-full bg-white text-blue-500 flex items-center justify-center hover:bg-blue-50 active:scale-90 transition-all app-shadow border border-blue-100 group"
            title={language === 'RU' ? "Просмотр Профиля" : "View Profile"}
          >
            <User size={24} />
          </button>
          
          <button 
            disabled={filteredUsers.length === 0}
            onClick={() => router.push(`/chats?matchId=${user.id}`)}
            className="w-14 h-14 rounded-full bg-white text-green-500 flex items-center justify-center hover:bg-green-50 active:scale-90 transition-all app-shadow border border-green-100 group"
            title={language === 'RU' ? "Написать ЛС" : "Write DM"}
          >
            <MessageCircle size={24} />
          </button>

          <button 
            disabled={filteredUsers.length === 0} 
            onClick={() => handleSwipe('right')} 
            className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center hover:bg-primary/5 active:scale-95 transition-all app-shadow border-2 border-primary group"
          >
            <Heart size={32} className="group-hover:fill-current transition-colors" />
          </button>
        </div>
      </main>

      <Dialog open={!!matchUser} onOpenChange={(open) => !open && setMatchUser(null)}>
        <DialogContent className="max-w-[400px] rounded-3xl border-0 p-0 overflow-hidden bg-white app-shadow">
          <div className="relative">
            <HeartConfetti />
            <div className="relative h-56 flex items-center justify-center p-6 gradient-bg">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="flex items-center justify-center gap-0 relative">
                    <motion.div 
                        initial={{ x: -60, opacity: 0, rotate: -15, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, rotate: -8, scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                        className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-10 -mr-8 bg-muted"
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
                        initial={{ x: 60, opacity: 0, rotate: 15, scale: 0.8 }}
                        animate={{ x: 0, opacity: 1, rotate: 8, scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.3 }}
                        className="w-36 h-36 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-0 bg-muted"
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
            </div>

            <div className="px-8 pt-8 pb-8 text-center">
              <DialogTitle className="text-3xl font-black font-headline mb-3 gradient-text uppercase tracking-tight">
                {t('match.title')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm mb-8 px-6 leading-relaxed font-medium">
                {language === 'RU' ? 'Вы с ' : 'You and '} <span className="font-bold text-foreground">{matchUser?.name}</span> {language === 'RU' ? 'понравились друг другу.' : 'liked each other.'}
              </DialogDescription>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative p-6 rounded-[2.5rem] mb-8 text-left border border-primary/20 bg-gradient-to-br from-white via-primary/[0.02] to-orange-500/[0.02] shadow-xl shadow-primary/5 overflow-hidden group"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl opacity-40"></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Cpu size={14} className="animate-pulse" />
                    </div>
                    <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">{t('match.insight')}</h4>
                  </div>
                  <motion.div 
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <Sparkles size={20} className="text-orange-400 opacity-60" />
                  </motion.div>
                </div>

                {loadingAi ? (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground py-2 relative z-10">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="animate-pulse font-bold uppercase tracking-widest text-[10px]">{language === 'RU' ? 'Анализируем...' : 'Analyzing...'}</span>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <p className="text-[13px] leading-relaxed text-foreground/90 font-semibold italic border-l-4 border-primary/30 pl-4 py-1">
                      "{compatibility}"
                    </p>
                  </div>
                )}

                <div className="absolute bottom-2 right-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                  <Sparkles size={48} />
                </div>
              </motion.div>
              
              <div className="flex flex-col gap-4">
                <Button onClick={handleStartChat} className="w-full h-16 rounded-full gradient-bg text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  {t('button.write_first')}
                </Button>
                <Button variant="ghost" onClick={() => {setMatchUser(null); setIndex(prev => prev + 1);}} className="w-full h-12 rounded-full text-muted-foreground font-black uppercase tracking-[0.1em] text-[10px] hover:bg-muted transition-all">
                  {t('button.continue')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <BottomNav />
    </>
  );
}
