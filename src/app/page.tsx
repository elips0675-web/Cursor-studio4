
"use client";

import { Flame, Search, Heart, MapPin, Zap, SlidersHorizontal, Check, MessageCircle, Sparkles, X, Trophy, ChevronDown, Cpu } from "lucide-react";
import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { generateMatchCompatibilityInsight } from "@/ai/flows/ai-match-compatibility-insight";
import { useLanguage } from "@/context/language-context";

const ALL_DEMO_USERS = [
  { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, hint: PlaceHolderImages[0].imageHint, online: true, distance: 2, match: 87, city: 'Москва', zodiac: 'Лев', interests: ['Фотография', 'Кофе'], bio: 'Люблю закаты, хороший кофе и интересные разговоры.' },
  { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, hint: PlaceHolderImages[1].imageHint, online: true, distance: 5, match: 92, city: 'Питер', zodiac: 'Овен', interests: ['Спорт', 'IT'], bio: 'Ищу компанию для пробежек и обсуждения технологий.' },
  { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, hint: PlaceHolderImages[2].imageHint, online: false, distance: 3, match: 81, city: 'Москва', zodiac: 'Рыбы', interests: ['Искусство', 'Книги'], bio: 'Ищу кого-то, кто любит музеи и долгие прогулки.' },
  { id: 4, name: 'Дмитрий', age: 31, img: PlaceHolderImages[3].imageUrl, hint: PlaceHolderImages[3].imageHint, online: false, distance: 12, match: 75, city: 'Казань', zodiac: 'Телец', interests: ['Бизнес', 'Авто'], bio: 'Ценю время и качественный отдых.' },
  { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, hint: PlaceHolderImages[4].imageHint, online: true, distance: 7, match: 88, city: 'Москва', zodiac: 'Дева', interests: ['Музыка', 'Гитара'], bio: 'Мечтаю собрать свою группу и объехать мир.' },
  { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, hint: PlaceHolderImages[5].imageHint, online: true, distance: 4, match: 69, city: 'Питер', zodiac: 'Близнецы', interests: ['Игры', 'Аниме'], bio: 'Давай поиграем вместе или посмотрим сериал.' },
  { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, hint: PlaceHolderImages[6].imageHint, online: true, distance: 1, match: 94, city: 'Москва', zodiac: 'Скорпион', interests: ['Йога', 'Природа'], bio: 'Люблю готовить полезную еду и ходить в походы.' },
  { id: 8, name: 'Иван', age: 27, img: PlaceHolderImages[7].imageUrl, hint: PlaceHolderImages[7].imageHint, online: false, distance: 15, match: 72, city: 'Сочи', zodiac: 'Стрелец', interests: ['Горы', 'Фотография'], bio: 'Пейзажный фотограф в поисках приключений.' },
  { id: 9, name: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, hint: PlaceHolderImages[8].imageHint, online: true, distance: 6, match: 83, city: 'Москва', zodiac: 'Козерог', interests: ['Мода', 'Дизайн'], bio: 'Жизнь слишком коротка, чтобы носить скучную одежду.' },
  { id: 10, name: 'Никита', age: 30, img: PlaceHolderImages[9].imageUrl, hint: PlaceHolderImages[9].imageHint, online: false, distance: 9, match: 77, city: 'Питер', zodiac: 'Водолей', interests: ['Наука', 'История'], bio: 'Люблю узнавать что-то новое каждый день.' }
];

const INTEREST_OPTIONS = ["Фотография", "Спорт", "Музыка", "Кофе", "IT", "Искусство", "Бизнес", "Путешествия"];
const ITEMS_PER_PAGE = 4;

function FallingHearts() {
  const hearts = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ y: -50 }}
          animate={{ y: '100vh' }}
          transition={{
            duration: Math.random() * 3 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 60 - 30}deg)`,
          }}
        >
          <Heart 
            size={Math.random() * 15 + 10} 
            fill={i % 2 === 0 ? "rgba(254, 60, 114, 0.7)" : "rgba(255, 142, 83, 0.7)"}
            className="text-transparent"
            style={{
              filter: `blur(${Math.random() * 1.5}px)`
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function HeartConfetti() {
  const hearts = Array.from({ length: 45 });
  return (
    <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden flex items-center justify-center">
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

function TwoHeartsAnimation() {
  return (
    <div className="relative flex items-center justify-center gap-2">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [-5, 5, -5]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 p-4 bg-white rounded-2xl shadow-xl"
      >
        <Heart className="text-primary" size={28} fill="currentColor" />
      </motion.div>
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [5, -5, 5]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="relative z-10 p-4 bg-white rounded-2xl shadow-xl -ml-4 mt-4"
      >
        <Heart className="text-orange-400" size={28} fill="currentColor" />
      </motion.div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [visibleResultsCount, setVisibleResultsCount] = useState(ITEMS_PER_PAGE);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  const [matchUser, setMatchUser] = useState<any>(null);
  const [compatibility, setCompatibility] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [selectedCity, setSelectedCity] = useState("Все");

  const resultsRef = useRef<HTMLDivElement>(null);

  const paginatedResults = useMemo(() => {
    return searchResults.slice(0, visibleResultsCount);
  }, [searchResults, visibleResultsCount]);

  const hasMore = visibleResultsCount < searchResults.length;

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
      setCompatibility(t('match.insight_default') || "Вы отлично подходите друг другу!");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleLikeUser = useCallback(async (user: any) => {
    toast({
      title: "Лайк!",
      description: `Вы лайкнули ${user.name}`,
    });

    if (Math.random() > 0.7) {
      setMatchUser(user);
      getAiInsight(user);
    }
  }, []);

  const handleAutoSearch = () => {
    setIsAutoSearching(true);
    setShowResults(false);
    setVisibleResultsCount(ITEMS_PER_PAGE);
    
    setTimeout(() => {
      const filtered = ALL_DEMO_USERS.filter(user => {
        const matchesAge = user.age >= ageRange[0] && user.age <= ageRange[1];
        const matchesInterests = selectedInterests.length === 0 || 
          user.interests.some(i => selectedInterests.includes(i));
        const matchesCity = selectedCity === "Все" || user.city === selectedCity;
        
        return matchesAge && matchesInterests && matchesCity;
      });

      setSearchResults(filtered);
      setIsAutoSearching(false);
      setShowResults(true);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1500);
  };

  const handleLoadMore = () => {
    setVisibleResultsCount(prev => prev + ITEMS_PER_PAGE);
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
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border-0 gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
            <Flame size={10} fill="currentColor" /> {t('home.popular')}
          </Badge>
          <h2 className="text-xl font-black font-headline mb-1 leading-tight tracking-tight text-foreground">
            {t('home.headline')}
          </h2>
          <p className="text-muted-foreground text-[10px] font-medium">{t('home.subheadline')}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-8">
          <Button 
            asChild
            className="h-10 rounded-xl gradient-bg text-white font-black text-xs app-shadow hover:scale-[1.02] active:scale-95 transition-all border-0 uppercase tracking-tight"
          >
            <Link href="/search">
              <Search size={14} className="stroke-[3px]" /> {t('nav.swipes')}
            </Link>
          </Button>
          <Button 
            onClick={() => setIsFilterDialogOpen(true)}
            className="h-10 rounded-xl bg-white border-2 border-primary text-primary font-black text-xs app-shadow hover:scale-[1.02] hover:bg-primary/5 active:scale-95 transition-all uppercase tracking-tight"
          >
            <Zap size={14} fill={isAutoSearching ? "currentColor" : "none"} className={cn("", isAutoSearching && "animate-pulse")} /> {t('button.autosearch')}
          </Button>
        </div>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <Trophy size={16} className="text-primary" />
              <h5 className="font-black text-base font-headline tracking-tight">{t('home.top_week')}</h5>
            </div>
            <Button asChild variant="ghost" className="text-primary font-bold uppercase tracking-widest text-[9px] h-auto p-0 hover:bg-transparent">
               <Link href="/search">{t('button.close')}</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ALL_DEMO_USERS.slice(0, 4).map((u) => (
              <FeaturedCard key={u.id} user={u} onLike={() => handleLikeUser(u)} />
            ))}
          </div>
        </section>

        <section className="scroll-mt-6 mb-8">
          <div className="flex justify-between items-end mb-3 px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-primary" />
              <h5 className="font-black text-base font-headline tracking-tight">{t('home.recommend')}</h5>
            </div>
            <Badge variant="outline" className="text-[8px] font-bold text-muted-foreground border-muted px-2 py-0.5 rounded-full uppercase tracking-tighter bg-white shadow-sm">{t('home.nearby')}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ALL_DEMO_USERS.slice(6, 10).map((u) => (
              <ProfilePreviewCard key={u.id} user={u} showActions onLike={() => handleLikeUser(u)} />
            ))}
          </div>
        </section>

        <div ref={resultsRef} className="scroll-mt-24">
          {isAutoSearching && (
            <div className="py-10 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">{t('home.searching')}</p>
            </div>
          )}

          {showResults && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Zap size={16} className="text-primary fill-current" />
                  <div>
                    <h5 className="font-black text-base font-headline tracking-tight">{t('home.results')}</h5>
                    <p className="text-[8px] text-primary font-bold uppercase tracking-wider">{searchResults.length}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResults(false)}
                  className="text-muted-foreground text-[8px] font-bold uppercase"
                >
                  {t('button.close')}
                </Button>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {paginatedResults.map((u) => (
                      <ProfilePreviewCard key={u.id} user={u} showActions onLike={() => handleLikeUser(u)} />
                    ))}
                  </div>
                  
                  {hasMore && (
                    <Button 
                      onClick={handleLoadMore}
                      variant="outline"
                      className="w-full h-10 rounded-xl border-2 border-primary/20 text-primary font-black uppercase tracking-widest text-[9px] bg-white hover:bg-primary/5 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      {t('button.load_more')} <ChevronDown size={12} />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-[1.5rem] p-6 text-center app-shadow border border-dashed border-muted/50">
                  <p className="text-[10px] text-muted-foreground font-medium mb-3 leading-tight">{t('home.no_results')}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsFilterDialogOpen(true)}
                    className="rounded-full text-[8px] font-black uppercase tracking-widest h-8 px-4"
                  >
                    {t('button.filters')}
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <Dialog open={!!matchUser} onOpenChange={() => setMatchUser(null)}>
        <DialogContent className="max-w-[400px] rounded-3xl border-0 bg-white p-0 overflow-hidden app-shadow">
          <FallingHearts />
          <HeartConfetti />
          
          <div className="relative h-48 gradient-bg flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
             <TwoHeartsAnimation />
             <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <div className="px-8 py-8 text-center bg-white relative">
            <div className="flex items-center justify-center gap-0 mb-10 relative h-32">
               <motion.div 
                 initial={{ x: -60, opacity: 0, rotate: -15, scale: 0.8 }}
                 animate={{ x: 0, opacity: 1, rotate: -8, scale: 1 }}
                 transition={{ type: "spring", damping: 12, delay: 0.2 }}
                 className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-10 -mr-8 bg-muted"
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
                 className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl overflow-hidden relative z-0 bg-muted"
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

            <DialogTitle className="text-3xl font-black font-headline mb-3 gradient-text uppercase tracking-tight">
              {t('match.title')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mb-8 px-6 leading-relaxed font-medium">
              {t('match.desc')}
            </DialogDescription>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative p-6 rounded-[2.5rem] mb-8 text-left border border-primary/20 bg-gradient-to-br from-white via-primary/[0.02] to-orange-500/[0.02] shadow-xl shadow-primary/5 overflow-hidden group"
            >
              {/* Background Glass Decorations */}
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
                  <span className="animate-pulse font-bold uppercase tracking-widest text-[10px]">{t('home.searching')}</span>
                </div>
              ) : (
                <div className="relative z-10">
                  <p className="text-[13px] leading-relaxed text-foreground/90 font-semibold italic border-l-4 border-primary/30 pl-4 py-1">
                    "{compatibility}"
                  </p>
                </div>
              )}

              {/* Decorative Subtle Icon in Corner */}
              <div className="absolute bottom-2 right-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                <Sparkles size={48} />
              </div>
            </motion.div>

            <div className="flex flex-col gap-4 w-full">
              <Button 
                onClick={() => router.push(`/chats?matchId=${matchUser.id}`)} 
                className="w-full h-16 rounded-full gradient-bg text-white font-black app-shadow hover:scale-[1.02] active:scale-95 transition-all border-0 uppercase tracking-[0.2em] text-[11px] shadow-primary/30"
              >
                {t('button.write_first')}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setMatchUser(null)} 
                className="w-full rounded-full h-12 text-muted-foreground font-black hover:bg-muted transition-all uppercase tracking-[0.1em] text-[10px]"
              >
                {t('button.continue')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-[380px] rounded-[2.5rem] p-0 overflow-hidden border-0 bg-white app-shadow">
          <DialogHeader className="p-8 bg-muted/30 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg">
                <Zap size={20} fill="currentColor" />
              </div>
              <DialogTitle className="text-2xl font-black font-headline tracking-tight">{t('button.autosearch')}</DialogTitle>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{t('button.filters')}</p>
          </DialogHeader>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh] no-scrollbar">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('profile.interests')}</label>
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

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('edit.age')}</label>
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

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('profile.city')}</label>
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
              {t('button.autosearch')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}

function FeaturedCard({ user, onLike }: { user: any; onLike: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-[1rem] overflow-hidden app-shadow group border border-transparent hover:border-primary/10 flex flex-col h-full transition-all relative">
      <Link href={`/user?id=${user.id}`} className="relative aspect-[4/3] bg-muted block overflow-hidden cursor-pointer">
        <Image 
          src={user.img} 
          alt={user.name} 
          fill 
          data-ai-hint={user.hint}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-1.5 right-1.5">
             <Badge className="bg-primary text-white text-[8px] border-0 px-1.5 py-0.5 font-black uppercase shadow-lg">
               {user.match}%
             </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white font-bold text-[11px] leading-tight truncate tracking-tight">{user.name}, {user.age}</p>
          <div className="text-white/80 text-[8px] flex items-center gap-1 font-bold mt-0.5">
            <MapPin size={8} /> {user.distance} км
          </div>
        </div>
      </Link>
      <div className="p-2 mt-auto">
        <div className="grid grid-cols-2 gap-1.5">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 rounded-lg border-primary/20 text-primary hover:bg-primary/5 active:scale-95 transition-all group/heart shadow-sm"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLike(); }}
          >
            <Heart size={14} className="group-hover/heart:fill-current" />
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="sm" 
            className="h-8 rounded-lg border-muted bg-muted/30 text-foreground hover:bg-muted/50 active:scale-95 transition-all shadow-sm"
          >
            <Link href={`/chats?matchId=${user.id}`}>
              <MessageCircle size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfilePreviewCard({ user, showActions = false, onLike }: { user: any; showActions?: boolean; onLike: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-[1rem] overflow-hidden app-shadow group border border-transparent hover:border-primary/10 flex flex-col h-full transition-all relative">
      <Link href={`/user?id=${user.id}`} className="relative aspect-[16/10] bg-muted block overflow-hidden cursor-pointer">
        <Image 
          src={user.img} 
          alt={user.name} 
          fill 
          data-ai-hint={user.hint}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {user.online && (
          <div className="absolute top-1.5 left-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#2ecc71] border border-white shadow-sm"></span>
          </div>
        )}
      </Link>
      <div className="p-2 flex-1 flex flex-col justify-between">
        <div className="mb-1.5">
          <div className="flex justify-between items-center mb-0.5">
            <span className="font-bold text-[11px] truncate pr-1 tracking-tight">{user.name}, {user.age}</span>
            <span className="text-primary text-[9px] font-black">{user.match}%</span>
          </div>
          <div className="text-muted-foreground text-[8px] flex items-center gap-1 font-medium truncate">
            <MapPin size={8} /> {user.distance} км
          </div>
        </div>

        {showActions && (
          <div className="grid grid-cols-2 gap-1.5 mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 rounded-lg border-primary/20 text-primary hover:bg-primary/5 active:scale-95 transition-all group/heart shadow-sm"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLike(); }}
            >
              <Heart size={14} className="group-hover/heart:fill-current" />
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="h-8 rounded-lg border-muted bg-muted/30 text-foreground hover:bg-muted/50 active:scale-95 transition-all shadow-sm"
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
