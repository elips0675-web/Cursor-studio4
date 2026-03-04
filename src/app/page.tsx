
"use client";

import { Flame, Search, Heart, MapPin, Zap, SlidersHorizontal, Check, MessageCircle } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

// Консистентный список из 10 демо-пользователей
const ALL_DEMO_USERS = [
  { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, online: true, distance: 2, match: 87, city: 'Москва', zodiac: 'Лев', interests: ['Фотография', 'Кофе'] },
  { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, online: true, distance: 5, match: 92, city: 'Питер', zodiac: 'Овен', interests: ['Спорт', 'IT'] },
  { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, online: false, distance: 3, match: 81, city: 'Москва', zodiac: 'Рыбы', interests: ['Искусство', 'Книги'] },
  { id: 4, name: 'Дмитрий', age: 31, img: PlaceHolderImages[3].imageUrl, online: false, distance: 12, match: 75, city: 'Казань', zodiac: 'Телец', interests: ['Бизнес', 'Авто'] },
  { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, online: true, distance: 7, match: 88, city: 'Москва', zodiac: 'Дева', interests: ['Музыка', 'Гитара'] },
  { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, online: true, distance: 4, match: 69, city: 'Питер', zodiac: 'Близнецы', interests: ['Игры', 'Аниме'] },
  { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, online: true, distance: 1, match: 94, city: 'Москва', zodiac: 'Скорпион', interests: ['Йога', 'Природа'] },
  { id: 8, name: 'Иван', age: 27, img: PlaceHolderImages[7].imageUrl, online: false, distance: 15, match: 72, city: 'Сочи', zodiac: 'Стрелец', interests: ['Горы', 'Фотография'] },
  { id: 9, name: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, online: true, distance: 6, match: 83, city: 'Москва', zodiac: 'Козерог', interests: ['Мода', 'Дизайн'] },
  { id: 10, name: 'Никита', age: 30, img: PlaceHolderImages[9].imageUrl, online: false, distance: 9, match: 77, city: 'Питер', zodiac: 'Водолей', interests: ['Наука', 'История'] }
];

const INTEREST_OPTIONS = ["Фотография", "Спорт", "Музыка", "Кофе", "IT", "Искусство", "Бизнес", "Путешествия"];
const ZODIAC_SIGNS = ["Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева", "Весы", "Скорпион", "Стрелец", "Козерог", "Водолей", "Рыбы"];

export default function Home() {
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  // Filter States
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [selectedCity, setSelectedCity] = useState("Все");
  const [selectedZodiac, setSelectedZodiac] = useState("Все");

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAutoSearch = () => {
    setIsAutoSearching(true);
    setShowResults(false);
    
    toast({
      title: "Автопоиск запущен",
      description: "Применяем ваши фильтры для поиска идеальных анкет...",
    });
    
    // Имитация процесса поиска
    setTimeout(() => {
      // Фильтрация
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
      
      // Скролл к результатам
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
      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 bg-[#f8f9fb]">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-0 gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
            <Flame size={12} fill="currentColor" /> Популярное сейчас
          </Badge>
          <h2 className="text-3xl font-black font-headline mb-2 leading-tight">
            Твой идеальный <br />
            <span className="gradient-text">мэтч</span> ждет тебя
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Знакомься, общайся и находи любовь</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <Button 
            asChild
            className="h-14 rounded-2xl gradient-bg text-white font-black text-base app-shadow hover:scale-[1.02] active:scale-95 transition-all border-0 uppercase tracking-tight"
          >
            <Link href="/search">
              <Search size={20} className="mr-2 stroke-[3px]" /> Свайпы
            </Link>
          </Button>
          <Button 
            onClick={() => setIsFilterDialogOpen(true)}
            className="h-14 rounded-2xl bg-white border-2 border-primary text-primary font-black text-base app-shadow hover:scale-[1.02] hover:bg-primary/5 active:scale-95 transition-all uppercase tracking-tight"
          >
            <Zap size={20} fill={isAutoSearching ? "currentColor" : "none"} className={cn("mr-2", isAutoSearching && "animate-pulse")} /> Автопоиск
          </Button>
        </div>

        {/* Featured Users */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-black text-xl font-headline">🔥 Топ недели</h5>
            <Button asChild variant="outline" className="text-primary font-black uppercase tracking-widest text-[10px] h-9 px-6 rounded-full border-primary/20 hover:bg-primary/5 bg-white transition-all shadow-sm">
               <Link href="/search">Все</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ALL_DEMO_USERS.slice(0, 4).map((u) => (
              <FeaturedCard key={u.id} user={u} />
            ))}
          </div>
        </section>

        {/* Recommended Section */}
        <section className="scroll-mt-6 mb-10">
          <div className="flex justify-between items-end mb-4">
            <h5 className="font-black text-xl font-headline">✨ Рекомендуем</h5>
            <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground border-muted px-3 py-0.5 rounded-full uppercase tracking-tighter bg-white shadow-sm">Рядом</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ALL_DEMO_USERS.slice(4, 8).map((u) => (
              <ProfilePreviewCard key={u.id} user={u} />
            ))}
          </div>
        </section>

        {/* Auto-Search Results Section */}
        <div ref={resultsRef} className="scroll-mt-24">
          {isAutoSearching && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Ищем лучших для вас...</p>
            </div>
          )}

          {showResults && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-black text-xl font-headline">🚀 Результаты автопоиска</h5>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Найдено: {searchResults.length}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResults(false)}
                  className="text-muted-foreground text-[10px] font-bold uppercase"
                >
                  Очистить
                </Button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {searchResults.map((u) => (
                    <ProfilePreviewCard key={u.id} user={u} showActions />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[2rem] p-8 text-center app-shadow border border-dashed border-muted">
                  <p className="text-sm text-muted-foreground font-medium mb-4">К сожалению, по вашим параметрам пока никого нет.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsFilterDialogOpen(true)}
                    className="rounded-full text-[10px] font-black uppercase tracking-widest"
                  >
                    Изменить фильтры
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

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

            {/* Zodiac */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Знак зодиака</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedZodiac("Все")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border-2",
                    selectedZodiac === "Все" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-muted text-muted-foreground"
                  )}
                >
                  Любой
                </button>
                {ZODIAC_SIGNS.slice(0, 6).map(sign => (
                  <button
                    key={sign}
                    onClick={() => setSelectedZodiac(sign)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border-2",
                      selectedZodiac === sign 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-muted text-muted-foreground"
                    )}
                  >
                    {sign}
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

function FeaturedCard({ user }: { user: any }) {
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Лайк!",
      description: `Вы лайкнули ${user.name}`,
    });
  };

  return (
    <div className="w-full group active:scale-[0.98] transition-all relative">
      <Link href={`/search`} className="block">
        <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden app-shadow border-2 border-white group-hover:border-primary/20 transition-colors bg-muted">
          <Image 
            src={user.img} 
            alt={user.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
             <Badge className="bg-primary text-white text-[8px] border-0 px-2 py-1 font-black uppercase shadow-lg">
               {user.match}%
             </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <p className="text-white font-bold text-sm leading-tight">{user.name}, {user.age}</p>
            <div className="flex items-center gap-1.5 text-white/80 text-[9px] mt-1 font-bold uppercase tracking-tight">
              <MapPin size={10} className="text-primary" /> {user.distance} км
            </div>
          </div>
        </div>
      </Link>
      
      {/* Floating Heart Button */}
      <button 
        onClick={handleLike}
        className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-primary shadow-xl hover:scale-110 active:scale-90 transition-all z-20"
      >
        <Heart size={18} fill="currentColor" />
      </button>
    </div>
  );
}

function ProfilePreviewCard({ user, showActions = false }: { user: any; showActions?: boolean }) {
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Лайк!",
      description: `Вы лайкнули ${user.name}`,
    });
  };

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden app-shadow group border border-transparent hover:border-primary/10 flex flex-col h-full transition-all relative">
      <Link href={`/search`} className="relative aspect-square bg-muted block overflow-hidden cursor-pointer">
        <Image 
          src={user.img} 
          alt={user.name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {user.online && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <span className="w-1.5 h-1.5 bg-[#2ecc71] rounded-full animate-pulse"></span>
            <span className="text-white text-[8px] font-bold uppercase tracking-tight">Онлайн</span>
          </div>
        )}
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-sm">{user.name}, {user.age}</span>
            {showActions ? (
               <Badge variant="secondary" className="bg-primary/10 text-primary text-[8px] border-0 h-5 px-1.5 font-black uppercase">
                 {user.match}%
               </Badge>
            ) : (
              <button 
                onClick={handleLike}
                className="p-1.5 hover:scale-125 active:scale-95 transition-all text-muted-foreground/30 hover:text-primary"
              >
                <Heart size={16} />
              </button>
            )}
          </div>
          <div className="text-muted-foreground text-[10px] flex items-center gap-1.5 font-medium mb-3">
            <MapPin size={10} className="text-primary/60" /> {user.distance} км от вас
          </div>
        </div>

        {showActions && (
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 rounded-xl border-primary/20 text-primary hover:bg-primary/5 active:scale-95 transition-all group/heart shadow-sm"
              onClick={handleLike}
            >
              <Heart size={14} className="group-hover/heart:fill-current" />
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="h-9 rounded-xl border-muted bg-muted/30 text-foreground hover:bg-muted/50 active:scale-95 transition-all shadow-sm"
            >
              <Link href={`/chats?matchId=${user.id}`}>
                <MessageCircle size={14} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
