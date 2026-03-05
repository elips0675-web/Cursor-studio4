
"use client";

import { Flame, Search, Heart, MapPin, Zap, SlidersHorizontal, Check, MessageCircle, Sparkles, X, Trophy } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { generateMatchCompatibilityInsight } from "@/ai/flows/ai-match-compatibility-insight";

// Консистентный список из 10 демо-пользователей
const ALL_DEMO_USERS = [
  { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, online: true, distance: 2, match: 87, city: 'Москва', zodiac: 'Лев', interests: ['Фотография', 'Кофе'], bio: 'Люблю закаты, хороший кофе и интересные разговоры.' },
  { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, online: true, distance: 5, match: 92, city: 'Питер', zodiac: 'Овен', interests: ['Спорт', 'IT'], bio: 'Ищу компанию для пробежек и обсуждения технологий.' },
  { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, online: false, distance: 3, match: 81, city: 'Москва', zodiac: 'Рыбы', interests: ['Искусство', 'Книги'], bio: 'Ищу кого-то, кто любит музеи и долгие прогулки.' },
  { id: 4, name: 'Дмитрий', age: 31, img: PlaceHolderImages[3].imageUrl, online: false, distance: 12, match: 75, city: 'Казань', zodiac: 'Телец', interests: ['Бизнес', 'Авто'], bio: 'Ценю время и качественный отдых.' },
  { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, online: true, distance: 7, match: 88, city: 'Москва', zodiac: 'Дева', interests: ['Музыка', 'Гитара'], bio: 'Мечтаю собрать свою группу и объехать мир.' },
  { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, online: true, distance: 4, match: 69, city: 'Питер', zodiac: 'Близнецы', interests: ['Игры', 'Аниме'], bio: 'Давай поиграем вместе или посмотрим сериал.' },
  { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, online: true, distance: 1, match: 94, city: 'Москва', zodiac: 'Скорпион', interests: ['Йога', 'Природа'], bio: 'Люблю готовить полезную еду и ходить в походы.' },
  { id: 8, name: 'Иван', age: 27, img: PlaceHolderImages[7].imageUrl, online: false, distance: 15, match: 72, city: 'Сочи', zodiac: 'Стрелец', interests: ['Горы', 'Фотография'], bio: 'Пейзажный фотограф в поисках приключений.' },
  { id: 9, name: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, online: true, distance: 6, match: 83, city: 'Москва', zodiac: 'Козерог', interests: ['Мода', 'Дизайн'], bio: 'Жизнь слишком коротка, чтобы носить скучную одежду.' },
  { id: 10, name: 'Никита', age: 30, img: PlaceHolderImages[9].imageUrl, online: false, distance: 9, match: 77, city: 'Питер', zodiac: 'Водолей', interests: ['Наука', 'История'], bio: 'Люблю узнавать что-то новое каждый день.' }
];

const INTEREST_OPTIONS = ["Фотография", "Спорт", "Музыка", "Кофе", "IT", "Искусство", "Бизнес", "Путешествия"];
const ZODIAC_SIGNS = ["Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева", "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"];

// Компонент "Салют из сердец"
function HeartConfetti() {
  const hearts = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: "50%", y: "50%" }}
          animate={{ 
            opacity: 0, 
            scale: [0, 1.5, 1], 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 1.5, ease: "easeOut", delay: Math.random() * 0.2 }}
          className="absolute"
        >
          <Heart size={Math.random() * 20 + 10} fill={i % 2 === 0 ? "#fe3c72" : "#ff8e53"} className="text-transparent" />
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  // Match States
  const [matchUser, setMatchUser] = useState<any>(null);
  const [compatibility, setCompatibility] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Filter States
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [selectedCity, setSelectedCity] = useState("Все");
  const [selectedZodiac, setSelectedZodiac] = useState("Все");

  const resultsRef = useRef<HTMLDivElement>(null);

  const getAiInsight = async (targetUser: any) => {
    setLoadingAi(true);
    try {
      const res = await generateMatchCompatibilityInsight({
        currentUser: {
          name: "Вы",
          age: 25,
          interests: ["Спорт", "Кино", "Кофе"],
          bio: "Активный пользователь SwiftMatch, люблю общение и новые открытия."
        },
        matchUser: {
          name: targetUser.name,
          age: targetUser.age,
          interests: targetUser.interests,
          bio: targetUser.bio || ""
        }
      });
      setCompatibility(res.explanation);
    } catch (e) {
      setCompatibility("Вы отлично подходите друг другу! Общие интересы станут отличным началом разговора.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLikeUser = useCallback(async (user: any) => {
    toast({
      title: "Лайк!",
      description: `Вы лайкнули ${user.name}`,
    });

    // 30% шанс совпадения
    if (Math.random() > 0.7) {
      setMatchUser(user);
      getAiInsight(user);
    }
  }, []);

  const handleAutoSearch = () => {
    setIsAutoSearching(true);
    setShowResults(false);
    
    setTimeout(() => {
      const filtered = ALL_DEMO_USERS.filter(user => {
        const matchesAge = user.age >= ageRange[0] && user.age <= ageRange[1];
        const matchesInterests = selectedInterests.length === 0 || 
          user.interests.some(i => selectedInterests.includes(i));
        const matchesCity = selectedCity === "Все" || user.city === selectedCity;
        const matchesZodiac = selectedZodiac === "Все" || user.zodiac === selectedZodiac;
        
        return matchesAge && matchesInterests && matchesCity && matchesZodiac;
      });

      setSearchResults(filtered);
      setIsAutoSearching(false);
      setShowResults(true);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1500);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-24 bg-[#f8f9fb]">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-0 gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
            <Flame size={12} fill="currentColor" /> Популярное сейчас
          </Badge>
          <h2 className="text-2xl font-black font-headline mb-2 leading-tight tracking-tight text-foreground">
            Твой идеальный <br />
            <span className="gradient-text">мэтч</span> ждет тебя
          </h2>
          <p className="text-muted-foreground text-xs font-medium">Знакомься, общайся и находи любовь</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <Button 
            asChild
            className="h-12 rounded-2xl gradient-bg text-white font-black text-sm app-shadow hover:scale-[1.02] active:scale-95 transition-all border-0 uppercase tracking-tight"
          >
            <Link href="/search">
              <Search size={18} className="mr-2 stroke-[3px]" /> Свайпы
            </Link>
          </Button>
          <Button 
            onClick={() => setIsFilterDialogOpen(true)}
            className="h-12 rounded-2xl bg-white border-2 border-primary text-primary font-black text-sm app-shadow hover:scale-[1.02] hover:bg-primary/5 active:scale-95 transition-all uppercase tracking-tight"
          >
            <Zap size={18} fill={isAutoSearching ? "currentColor" : "none"} className={cn("mr-2", isAutoSearching && "animate-pulse")} /> Автопоиск
          </Button>
        </div>

        {/* Featured Users */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-primary" />
              <h5 className="font-black text-lg font-headline tracking-tight">Топ недели</h5>
            </div>
            <Button asChild variant="ghost" className="text-primary font-bold uppercase tracking-widest text-[10px] h-auto p-0 hover:bg-transparent">
               <Link href="/search">Все</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ALL_DEMO_USERS.slice(0, 4).map((u) => (
              <FeaturedCard key={u.id} user={u} onLike={() => handleLikeUser(u)} />
            ))}
          </div>
        </section>

        {/* Recommended Section */}
        <section className="scroll-mt-6 mb-10">
          <div className="flex justify-between items-end mb-4 px-1">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <h5 className="font-black text-lg font-headline tracking-tight">Рекомендуем</h5>
            </div>
            <Badge variant="outline" className="text-[9px] font-bold text-muted-foreground border-muted px-2 py-0.5 rounded-full uppercase tracking-tighter bg-white shadow-sm">Рядом</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ALL_DEMO_USERS.slice(6, 10).map((u) => (
              <ProfilePreviewCard key={u.id} user={u} showActions onLike={() => handleLikeUser(u)} />
            ))}
          </div>
        </section>

        {/* Auto-Search Results Section */}
        <div ref={resultsRef} className="scroll-mt-24">
          {isAutoSearching && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Ищем лучших для вас...</p>
            </div>
          )}

          {showResults && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 px-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-primary fill-current" />
                  <div>
                    <h5 className="font-black text-lg font-headline tracking-tight">Результаты</h5>
                    <p className="text-[9px] text-primary font-bold uppercase tracking-wider">Найдено: {searchResults.length}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResults(false)}
                  className="text-muted-foreground text-[9px] font-bold uppercase"
                >
                  Очистить
                </Button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {searchResults.map((u) => (
                    <ProfilePreviewCard key={u.id} user={u} showActions onLike={() => handleLikeUser(u)} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] p-8 text-center app-shadow border border-dashed border-muted/50">
                  <p className="text-xs text-muted-foreground font-medium mb-4 leading-tight">По вашим параметрам пока никого нет.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsFilterDialogOpen(true)}
                    className="rounded-full text-[9px] font-black uppercase tracking-widest h-9 px-6"
                  >
                    Изменить фильтры
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Match Dialog */}
      <Dialog open={!!matchUser} onOpenChange={() => setMatchUser(null)}>
        <DialogContent className="max-w-[360px] rounded-[2.5rem] border-0 bg-white p-0 overflow-hidden app-shadow">
          <HeartConfetti />
          
          <div className="relative h-32 gradient-bg flex items-center justify-center">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="relative z-10 bg-white p-3 rounded-full shadow-2xl">
               <Heart className="text-primary animate-pulse" size={32} fill="currentColor" />
             </div>
          </div>

          <div className="px-6 py-8 text-center -mt-12 bg-white rounded-t-[2.5rem] relative">
            <div className="flex items-center justify-center gap-0 mb-6 relative">
               <div className="w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden relative z-10 -mr-4 bg-muted">
                  <Image src={PlaceHolderImages[10].imageUrl} alt="Вы" fill className="object-cover" />
               </div>
               <div className="w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden relative z-0 bg-muted">
                  <Image src={matchUser?.img || PlaceHolderImages[0].imageUrl} alt={matchUser?.name} fill className="object-cover" />
               </div>
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg z-20">
                  <Heart size={16} className="text-primary" fill="currentColor" />
               </div>
            </div>

            <DialogTitle className="text-2xl font-black font-headline mb-2 gradient-text uppercase tracking-tight">Это совпадение!</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mb-6 px-4 leading-relaxed">
              Вы с <span className="font-bold text-foreground">{matchUser?.name}</span> понравились друг другу. Не заставляйте ждать!
            </DialogDescription>
            
            <div className="bg-primary/5 p-5 rounded-[2rem] mb-8 text-left border border-primary/10 relative overflow-hidden group shadow-inner">
              <div className="absolute top-0 right-0 p-2 text-primary/20 group-hover:text-primary/40 transition-colors">
                <Sparkles size={32} />
              </div>
              <h4 className="text-[10px] font-bold text-primary mb-2 flex items-center gap-1 uppercase tracking-widest">
                <Sparkles size={12} /> AI Инсайт
              </h4>
              {loadingAi ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Анализируем ваши общие интересы...
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-foreground/80 italic relative z-10">
                  {compatibility}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button onClick={() => router.push(`/chats?matchId=${matchUser.id}`)} className="w-full h-14 rounded-full gradient-bg text-white font-bold app-shadow hover:scale-[1.02] active:scale-95 transition-all border-0 uppercase tracking-widest text-xs">
                Написать первым
              </Button>
              <Button variant="ghost" onClick={() => setMatchUser(null)} className="w-full rounded-full h-12 text-muted-foreground font-bold hover:bg-muted shadow-sm uppercase tracking-widest text-[10px]">
                Продолжить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-[380px] rounded-[2.5rem] p-0 overflow-hidden border-0 bg-white app-shadow">
          <DialogHeader className="p-8 bg-muted/30 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg">
                <Zap size={20} fill="currentColor" />
              </div>
              <DialogTitle className="text-2xl font-black font-headline tracking-tight">Автопоиск</DialogTitle>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Настройте идеальный подбор</p>
          </DialogHeader>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] no-scrollbar">
            {/* Interests */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Интересы</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(interest => (
                  <Badge 
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    variant={selectedInterests.includes(interest) ? "default" : "secondary"}
                    className={cn(
                      "cursor-pointer px-4 py-2.5 rounded-xl transition-all border-0 font-bold text-[9px] uppercase tracking-tight shadow-sm",
                      selectedInterests.includes(interest) 
                        ? "gradient-bg text-white shadow-md" 
                        : "bg-muted text-muted-foreground hover:bg-border"
                    )}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Возраст</label>
                <span className="text-xs font-black text-primary">{ageRange[0]} - {ageRange[1]}</span>
              </div>
              <Slider 
                value={ageRange} 
                onValueChange={setAgeRange} 
                min={18} 
                max={60} 
                step={1} 
                className="py-4"
              />
            </div>

            {/* City */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Город</label>
              <div className="grid grid-cols-2 gap-2">
                {["Все", "Москва", "Питер", "Казань", "Сочи"].map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={cn(
                      "h-10 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2",
                      selectedCity === city 
                        ? "border-primary bg-primary/5 text-primary shadow-sm" 
                        : "border-muted text-muted-foreground bg-transparent"
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0">
            <Button 
              onClick={() => {
                setIsFilterDialogOpen(false);
                handleAutoSearch();
              }}
              className="w-full h-14 rounded-full gradient-bg text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all border-0"
            >
              Запустить поиск
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}

function FeaturedCard({ user, onLike }: { user: any; onLike: () => void }) {
  return (
    <div className="bg-white rounded-[1.25rem] overflow-hidden app-shadow group border border-transparent hover:border-primary/10 flex flex-col h-full transition-all relative">
      <Link href={`/search`} className="relative aspect-[3/4] bg-muted block overflow-hidden cursor-pointer">
        <Image 
          src={user.img} 
          alt={user.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
             <Badge className="bg-primary text-white text-[9px] border-0 px-2 py-0.5 font-black uppercase shadow-lg">
               {user.match}%
             </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white font-bold text-sm leading-tight truncate tracking-tight">{user.name}, {user.age}</p>
          <div className="text-white/80 text-[10px] flex items-center gap-1 font-bold mt-0.5">
            <MapPin size={10} /> {user.distance} км
          </div>
        </div>
      </Link>
      <div className="p-3 mt-auto">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 rounded-xl border-primary/20 text-primary hover:bg-primary/5 active:scale-95 transition-all group/heart shadow-sm"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLike(); }}
          >
            <Heart size={16} className="group-hover/heart:fill-current" />
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="sm" 
            className="h-10 rounded-xl border-muted bg-muted/30 text-foreground hover:bg-muted/50 active:scale-95 transition-all shadow-sm"
          >
            <Link href={`/chats?matchId=${user.id}`}>
              <MessageCircle size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfilePreviewCard({ user, showActions = false, onLike }: { user: any; showActions?: boolean; onLike: () => void }) {
  return (
    <div className="bg-white rounded-[1.25rem] overflow-hidden app-shadow group border border-transparent hover:border-primary/10 flex flex-col h-full transition-all relative">
      <Link href={`/search`} className="relative aspect-square bg-muted block overflow-hidden cursor-pointer">
        <Image 
          src={user.img} 
          alt={user.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {user.online && (
          <div className="absolute top-2 left-2">
            <span className="flex h-2 w-2 rounded-full bg-[#2ecc71] border border-white shadow-sm"></span>
          </div>
        )}
      </Link>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-bold text-sm truncate pr-1 tracking-tight">{user.name}, {user.age}</span>
            <span className="text-primary text-[10px] font-black">{user.match}%</span>
          </div>
          <div className="text-muted-foreground text-[10px] flex items-center gap-1 font-medium truncate">
            <MapPin size={10} /> {user.distance} км
          </div>
        </div>

        {showActions && (
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 rounded-xl border-primary/20 text-primary hover:bg-primary/5 active:scale-95 transition-all group/heart shadow-sm"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLike(); }}
            >
              <Heart size={16} className="group-hover/heart:fill-current" />
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="h-10 rounded-xl border-muted bg-muted/30 text-foreground hover:bg-muted/50 active:scale-95 transition-all shadow-sm"
            >
              <Link href={`/chats?matchId=${user.id}`}>
                <MessageCircle size={16} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
