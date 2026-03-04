"use client";

import { useState, useMemo } from "react";
import { Heart, MapPin, Sparkles, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { generateMatchCompatibilityInsight } from "@/ai/flows/ai-match-compatibility-insight";

const ALL_USERS = [
  { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, interests: ['Фотография', 'Путешествия', 'Кофе'], bio: 'Люблю закаты, хороший кофе и интересные разговоры.', distance: 2, match: 87, gender: 'female' },
  { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, interests: ['Спорт', 'IT', 'Книги'], bio: 'Ищу компанию для пробежек и обсуждения технологий.', distance: 5, match: 92, gender: 'male' },
  { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, interests: ['Искусство', 'Книги', 'Вино'], bio: 'Ищу кого-то, кто любит музеи и долгие прогулки.', distance: 3, match: 81, gender: 'female' },
  { id: 4, name: 'Дмитрий', age: 31, img: PlaceHolderImages[3].imageUrl, interests: ['Бизнес', 'Авто', 'Спорт'], bio: 'Ценю время и качественный отдых.', distance: 12, match: 75, gender: 'male' },
  { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, interests: ['Музыка', 'Гитара', 'Фестивали'], bio: 'Мечтаю собрать свою группу и объехать мир.', distance: 7, match: 88, gender: 'female' },
  { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, interests: ['Игры', 'Аниме', 'Пицца'], bio: 'Давай поиграем вместе или посмотрим сериал.', distance: 4, match: 69, gender: 'male' },
  { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, interests: ['Йога', 'Кулинария', 'Природа'], bio: 'Люблю готовить полезную еду и ходить в походы.', distance: 1, match: 94, gender: 'female' },
  { id: 8, name: 'Иван', age: 27, img: PlaceHolderImages[7].imageUrl, interests: ['Фотография', 'Горы', 'Кемпинг'], bio: 'Пейзажный фотограф в поисках приключений.', distance: 15, match: 72, gender: 'male' },
  { id: 9, name: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, interests: ['Мода', 'Дизайн', 'Вечеринки'], bio: 'Жизнь слишком коротка, чтобы носить скучную одежду.', distance: 6, match: 83, gender: 'female' },
  { id: 10, name: 'Никита', age: 30, img: PlaceHolderImages[9].imageUrl, interests: ['Наука', 'История', 'Музеи'], bio: 'Люблю узнавать что-то новое каждый день.', distance: 9, match: 77, gender: 'male' }
];

const INTEREST_OPTIONS = ["Фотография", "Путешествия", "Кофе", "Искусство", "Книги", "Бизнес", "Спорт", "Музыка", "Игры", "Йога", "Мода", "Дизайн", "История"];

export default function SearchPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [matchUser, setMatchUser] = useState<any>(null);
  const [compatibility, setCompatibility] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Filter States
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [maxDistance, setMaxDistance] = useState([50]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const handleSwipeRight = async () => {
    if (!user) return;
    if (Math.random() > 0.3) {
      setMatchUser(user);
      getAiInsight(user);
    }
    setIndex(prev => prev + 1);
  };

  const getAiInsight = async (targetUser: any) => {
    setLoadingAi(true);
    try {
      const res = await generateMatchCompatibilityInsight({
        currentUser: {
          name: "Вы",
          age: 25,
          interests: ["Спорт", "Кино", "Кофе"],
          bio: "Активный парень, люблю новые знакомства."
        },
        matchUser: {
          name: targetUser.name,
          age: targetUser.age,
          interests: targetUser.interests,
          bio: targetUser.bio
        }
      });
      setCompatibility(res.explanation);
    } catch (e) {
      setCompatibility("Вы отлично подходите друг другу! Общие интересы помогут завязать диалог.");
    } finally {
      setLoadingAi(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleStartChat = () => {
    if (matchUser) {
      router.push(`/chats?matchId=${matchUser.id}`);
    }
  };

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-hidden px-5 pt-4 pb-24 flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 mb-6 w-full max-w-sm">
          <div className="flex items-center gap-2">
            <div className="bg-white/90 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm text-primary font-bold border border-primary/5 shadow-sm">
              <Sparkles size={16} />
              <span>Подбор: {filteredUsers.length} человек</span>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsFilterOpen(true)}
              className="rounded-2xl h-10 w-10 bg-white border-primary/10 shadow-sm hover:bg-primary/5 transition-colors"
            >
              <SlidersHorizontal size={18} className="text-primary" />
            </Button>
          </div>
        </div>

        <div className="relative w-full flex-1 mb-8 max-w-[400px]">
          {filteredUsers.length > 0 ? (
            <div key={user.id} className="absolute inset-0 bg-white rounded-[2.5rem] overflow-hidden app-shadow flex flex-col animate-in fade-in zoom-in-95 duration-500">
              <div className="relative flex-[1.4]">
                <Image 
                  src={user.img} 
                  alt={user.name} 
                  fill 
                  className="object-cover"
                  data-ai-hint="dating profile photo"
                />
                <div className="absolute top-4 left-4">
                   <Badge className="bg-[#2ecc71] text-white border-0 px-3 py-1 text-[10px] font-bold">Онлайн</Badge>
                </div>
                <div className="absolute top-4 right-4">
                   <Badge className="gradient-bg text-white border-0 px-3 py-1 font-bold shadow-md">{user.match}% совпадение</Badge>
                </div>
              </div>
              
              <div className="flex-1 p-6 text-center bg-white flex flex-col justify-center">
                <h3 className="text-2xl font-bold font-headline mb-1">{user.name}, {user.age}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex items-center justify-center gap-1">
                  <MapPin size={14} className="text-primary" /> {user.distance} км от вас
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-5">
                  {user.interests.map(i => (
                    <span key={i} className="px-3 py-1 bg-muted text-[10px] rounded-full font-bold text-foreground/70 uppercase tracking-tight">{i}</span>
                  ))}
                </div>
                
                <p className="text-muted-foreground text-xs leading-relaxed italic px-4 line-clamp-3">
                  "{user.bio}"
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-muted">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <X size={32} className="text-muted-foreground" />
              </div>
              <h4 className="text-lg font-bold mb-2">Никого не нашли</h4>
              <p className="text-sm text-muted-foreground mb-6">Попробуйте изменить параметры фильтров</p>
              <Button variant="outline" className="rounded-full px-8" onClick={() => {
                setAgeRange([18, 40]);
                setMaxDistance([50]);
                setSelectedInterests([]);
                setSelectedGender('all');
              }}>
                Сбросить
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <button 
            disabled={filteredUsers.length === 0}
            onClick={handleSwipeRight}
            className="w-20 h-20 rounded-full bg-white border-4 border-primary text-primary flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Heart size={36} fill="currentColor" className="group-hover:animate-pulse" />
          </button>
        </div>
      </main>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-[380px] rounded-[2.5rem] p-0 overflow-hidden border-0">
          <DialogHeader className="p-6 bg-muted/30">
            <DialogTitle className="text-xl font-bold font-headline">Фильтры поиска</DialogTitle>
            <DialogDescription>Настройте параметры для идеального мэтча</DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-8 overflow-y-auto max-h-[60vh] no-scrollbar">
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Пол</Label>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'Все' },
                  { id: 'male', label: 'Мужской' },
                  { id: 'female', label: 'Женский' }
                ].map((g) => (
                  <Button
                    key={g.id}
                    variant={selectedGender === g.id ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 rounded-full text-[10px] font-bold uppercase",
                      selectedGender === g.id ? "gradient-bg text-white border-0" : "border-primary/10 text-muted-foreground"
                    )}
                    onClick={() => setSelectedGender(g.id)}
                  >
                    {g.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Возраст</Label>
                <span className="text-sm text-primary font-black">{ageRange[0]} - {ageRange[1]}</span>
              </div>
              <Slider 
                value={ageRange} 
                onValueChange={setAgeRange} 
                min={18} 
                max={60} 
                step={1} 
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Расстояние</Label>
                <span className="text-sm text-primary font-black">до {maxDistance[0]} км</span>
              </div>
              <Slider 
                value={maxDistance} 
                onValueChange={setMaxDistance} 
                min={1} 
                max={100} 
                step={1} 
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Интересы</Label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(interest => (
                  <Badge 
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "secondary"}
                    className={`cursor-pointer px-4 py-2 rounded-full transition-all border-0 font-bold text-[10px] ${
                      selectedInterests.includes(interest) 
                        ? "gradient-bg text-white shadow-sm" 
                        : "bg-muted text-muted-foreground hover:bg-border"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0">
            <Button className="w-full h-12 rounded-full gradient-bg text-white font-bold shadow-lg shadow-primary/20" onClick={() => setIsFilterOpen(false)}>
              Применить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!matchUser} onOpenChange={() => setMatchUser(null)}>
        <DialogContent className="max-w-[360px] rounded-[2.5rem] border-0 bg-white p-0 overflow-hidden shadow-2xl">
          <div className="relative h-32 gradient-bg flex items-center justify-center">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <Heart className="text-white animate-pulse" size={48} fill="currentColor" />
          </div>

          <div className="px-6 py-8 text-center -mt-10">
            <div className="flex items-center justify-center gap-0 mb-6 relative">
               <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden relative z-10 -mr-4 bg-muted">
                  <Image src={PlaceHolderImages[10].imageUrl} alt="Вы" fill className="object-cover" />
               </div>
               <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden relative z-0 bg-muted">
                  <Image src={matchUser?.img || PlaceHolderImages[0].imageUrl} alt={matchUser?.name} fill className="object-cover" />
               </div>
               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md z-20">
                  <Heart size={16} className="text-primary" fill="currentColor" />
               </div>
            </div>

            <DialogTitle className="text-2xl font-black font-headline mb-2 gradient-text">Это совпадение!</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mb-6 px-4">
              Вы с <span className="font-bold text-foreground">{matchUser?.name}</span> понравились друг другу. Не заставляйте ждать!
            </DialogDescription>
            
            <div className="bg-primary/5 p-4 rounded-3xl mb-8 text-left border border-primary/10">
              <h4 className="text-[10px] font-bold text-primary mb-2 flex items-center gap-1 uppercase tracking-wider">
                <Sparkles size={12} /> AI Инсайт
              </h4>
              {loadingAi ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Анализируем интересы...
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-foreground/80 italic">
                  {compatibility}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Button onClick={handleStartChat} className="w-full h-12 rounded-full gradient-bg text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Написать первым
              </Button>
              <Button variant="ghost" onClick={() => setMatchUser(null)} className="w-full rounded-full h-11 text-muted-foreground font-semibold hover:bg-muted">
                Продолжить поиск
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
