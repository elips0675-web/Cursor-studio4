
"use client";

import { useState, useMemo } from "react";
import { Heart, MapPin, Sparkles, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
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
  DialogDescription
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { generateMatchCompatibilityInsight } from "@/ai/flows/ai-match-compatibility-insight";

const ALL_USERS = [
  { 
    id: 1, name: 'Анна', age: 24, 
    img: PlaceHolderImages[0].imageUrl, 
    interests: ['Фотография', 'Путешествия', 'Кофе'], 
    bio: 'Люблю закаты, хороший кофе и интересные разговоры.',
    distance: 2, match: 87 
  },
  { 
    id: 2, name: 'Елена', age: 26, 
    img: PlaceHolderImages[2].imageUrl, 
    interests: ['Искусство', 'Книги', 'Вино'], 
    bio: 'Ищу кого-то, кто любит музеи и долгие прогулки.',
    distance: 5, match: 92 
  },
  { 
    id: 3, name: 'Мария', age: 23, 
    img: PlaceHolderImages[3].imageUrl, 
    interests: ['Танцы', 'Театр', 'Пицца'], 
    bio: 'Жизнь - это танец, давай танцевать вместе!',
    distance: 1, match: 78 
  },
  { 
    id: 4, name: 'София', age: 30, 
    img: PlaceHolderImages[5].imageUrl, 
    interests: ['Спорт', 'Музыка', 'Кофе'], 
    bio: 'Музыка и спорт — моя жизнь.',
    distance: 10, match: 65 
  }
];

const INTEREST_OPTIONS = ["Фотография", "Путешествия", "Кофе", "Искусство", "Книги", "Вино", "Танцы", "Театр", "Пицца", "Спорт", "Музыка"];

export default function SearchPage() {
  const [index, setIndex] = useState(0);
  const [matchUser, setMatchUser] = useState<any>(null);
  const [compatibility, setCompatibility] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Filter States
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [maxDistance, setMaxDistance] = useState([50]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return ALL_USERS.filter(user => {
      const matchesAge = user.age >= ageRange[0] && user.age <= ageRange[1];
      const matchesDistance = user.distance <= maxDistance[0];
      const matchesInterests = selectedInterests.length === 0 || 
        user.interests.some(interest => selectedInterests.includes(interest));
      
      return matchesAge && matchesDistance && matchesInterests;
    });
  }, [ageRange, maxDistance, selectedInterests]);

  const user = filteredUsers[index % filteredUsers.length];

  const handleSwipeRight = async () => {
    if (!user) return;
    if (Math.random() > 0.5) {
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

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-hidden px-5 pt-4 pb-24 flex flex-col">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="bg-white/80 p-3 rounded-2xl flex items-center gap-2 text-sm text-primary font-bold border border-primary/10 flex-1 shadow-sm">
            <Sparkles size={16} />
            <strong>Подбор:</strong> {filteredUsers.length} человек
          </div>
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-2xl h-11 w-11 bg-white border-primary/10 shadow-sm">
                <SlidersHorizontal size={18} className="text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-[2.5rem] h-[85vh] px-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl font-bold font-headline">Фильтры поиска</SheetTitle>
                <SheetDescription>Настройте параметры для идеального мэтча</SheetDescription>
              </SheetHeader>
              
              <div className="space-y-8 overflow-y-auto max-h-[60vh] pb-6 no-scrollbar">
                {/* Age Filter */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold">Возраст</Label>
                    <span className="text-sm text-primary font-bold">{ageRange[0]} - {ageRange[1]}</span>
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

                {/* Distance Filter */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold">Расстояние (км)</Label>
                    <span className="text-sm text-primary font-bold">до {maxDistance[0]} км</span>
                  </div>
                  <Slider 
                    value={maxDistance} 
                    onValueChange={setMaxDistance} 
                    min={1} 
                    max={100} 
                    step={1} 
                    className="py-4"
                  />
                </div>

                {/* Interests Filter */}
                <div className="space-y-4">
                  <Label className="text-sm font-bold">Интересы</Label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(interest => (
                      <Badge 
                        key={interest}
                        variant={selectedInterests.includes(interest) ? "default" : "secondary"}
                        className={`cursor-pointer px-3 py-1.5 rounded-full transition-all ${
                          selectedInterests.includes(interest) 
                            ? "gradient-bg text-white border-0" 
                            : "bg-muted text-muted-foreground hover:bg-border border-0"
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="mt-4">
                <Button className="w-full h-12 rounded-full gradient-bg text-white font-bold" onClick={() => setIsFilterOpen(false)}>
                  Применить
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div className="relative flex-1 mb-6">
          {filteredUsers.length > 0 ? (
            <div key={user.id} className="absolute inset-0 bg-white rounded-[2.5rem] overflow-hidden app-shadow flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative flex-[1.4]">
                <Image 
                  src={user.img} 
                  alt={user.name} 
                  fill 
                  className="object-cover"
                  data-ai-hint="dating profile photo"
                />
                <div className="absolute top-4 left-4">
                   <Badge className="bg-[#2ecc71] text-white border-0 px-2 py-0.5 text-[10px]">Онлайн</Badge>
                </div>
                <div className="absolute top-4 right-4">
                   <Badge className="gradient-bg text-white border-0 px-2 py-1 font-bold">{user.match}% совпадение</Badge>
                </div>
              </div>
              
              <div className="flex-1 p-6 text-center bg-white flex flex-col justify-center">
                <h3 className="text-2xl font-bold font-headline mb-1">{user.name}, {user.age}</h3>
                <p className="text-muted-foreground text-sm mb-3 flex items-center justify-center gap-1">
                  <MapPin size={14} className="text-primary" /> {user.distance} км от вас
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {user.interests.map(i => (
                    <span key={i} className="px-3 py-1 bg-muted text-xs rounded-full font-semibold">{i}</span>
                  ))}
                </div>
                
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 italic">
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
              <p className="text-sm text-muted-foreground mb-6">Попробуйте изменить параметры фильтров, чтобы увидеть больше людей</p>
              <Button variant="outline" className="rounded-full px-8" onClick={() => {
                setAgeRange([18, 40]);
                setMaxDistance([50]);
                setSelectedInterests([]);
              }}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <button 
            disabled={filteredUsers.length === 0}
            onClick={handleSwipeRight}
            className="w-20 h-20 rounded-full bg-white border-4 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart size={36} fill="currentColor" />
          </button>
        </div>
      </main>

      <Dialog open={!!matchUser} onOpenChange={() => setMatchUser(null)}>
        <DialogContent className="max-w-[360px] rounded-[2rem] border-0 bg-black/95 text-white">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="text-6xl mb-4 animate-bounce">💕</div>
            <DialogTitle className="text-3xl font-black font-headline mb-2 text-white">Это совпадение!</DialogTitle>
            <DialogDescription className="text-white/70 mb-6">
              Вы с {matchUser?.name} понравились друг другу
            </DialogDescription>
            
            <div className="bg-white/10 p-4 rounded-2xl mb-6 text-left w-full border border-white/5">
              <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
                <Sparkles size={12} /> AI ПОДСКАЗКА
              </h4>
              {loadingAi ? (
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Генерация инсайта...
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-white/90 italic">
                  {compatibility}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" onClick={() => setMatchUser(null)} className="rounded-full border-white/20 hover:bg-white/10 text-white">
                Позже
              </Button>
              <Button className="rounded-full gradient-bg text-white font-bold" onClick={() => setMatchUser(null)}>
                Написать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
