
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  CheckCircle2, 
  Star, 
  Camera, 
  Coffee, 
  Music, 
  Globe, 
  Dumbbell,
  Palette,
  Film,
  Flower2,
  Briefcase,
  Gamepad2,
  Maximize2,
  X,
  Dog,
  Ruler,
  Moon,
  Sun,
  Target,
  Sparkles,
  Heart,
  MessageCircle,
  ChevronLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ALL_DEMO_USERS = [
  { id: 1, name: 'Анна', age: 24, img: PlaceHolderImages[0].imageUrl, hint: PlaceHolderImages[0].imageHint, distance: 2, match: 87, city: 'Москва', zodiac: 'Лев', interests: ['Фотография', 'Кофе', 'Музыка', 'Путешествия'], bio: 'Люблю закаты, хороший кофе и интересные разговоры.', height: 172, goal: 'Серьезные отношения' },
  { id: 2, name: 'Максим', age: 28, img: PlaceHolderImages[1].imageUrl, hint: PlaceHolderImages[1].imageHint, distance: 5, match: 92, city: 'Питер', zodiac: 'Овен', interests: ['Спорт', 'IT', 'Книги'], bio: 'Ищу компанию для пробежек и обсуждения технологий.', height: 185, goal: 'Новые друзья' },
  { id: 3, name: 'Елена', age: 26, img: PlaceHolderImages[2].imageUrl, hint: PlaceHolderImages[2].imageHint, distance: 3, match: 81, city: 'Москва', zodiac: 'Рыбы', interests: ['Искусство', 'Книги', 'Вино'], bio: 'Ищу кого-то, кто любит музеи и долгие прогулки.', height: 168, goal: 'Свидания' },
  { id: 4, name: 'Дмитрий', age: 31, img: PlaceHolderImages[3].imageUrl, hint: PlaceHolderImages[3].imageHint, distance: 12, match: 75, city: 'Казань', zodiac: 'Телец', interests: ['Бизнес', 'Авто', 'Спорт'], bio: 'Ценю время и качественный отдых.', height: 182, goal: 'Серьезные отношения' },
  { id: 5, name: 'София', age: 22, img: PlaceHolderImages[4].imageUrl, hint: PlaceHolderImages[4].imageHint, distance: 7, match: 88, city: 'Москва', zodiac: 'Дева', interests: ['Музыка', 'Гитара', 'Фотография'], bio: 'Мечтаю собрать свою группу и объехать мир.', height: 165, goal: 'Просто общение' },
  { id: 6, name: 'Артем', age: 25, img: PlaceHolderImages[5].imageUrl, hint: PlaceHolderImages[5].imageHint, distance: 4, match: 69, city: 'Питер', zodiac: 'Близнецы', interests: ['Игры', 'Аниме', 'IT'], bio: 'Давай поиграем вместе или посмотрим сериал.', height: 178, goal: 'Свидания' },
  { id: 7, name: 'Мария', age: 29, img: PlaceHolderImages[6].imageUrl, hint: PlaceHolderImages[6].imageHint, distance: 1, match: 94, city: 'Москва', zodiac: 'Скорпион', interests: ['Йога', 'Природа', 'Путешествия'], bio: 'Люблю готовить полезную еду и ходить в походы.', height: 170, goal: 'Серьезные отношения' },
  { id: 8, name: 'Иван', age: 27, img: PlaceHolderImages[7].imageUrl, hint: PlaceHolderImages[7].imageHint, distance: 15, match: 72, city: 'Сочи', zodiac: 'Стрелец', interests: ['Горы', 'Фотография', 'Спорт'], bio: 'Пейзажный фотограф в поисках приключений.', height: 188, goal: 'Новые друзья' },
  { id: 9, name: 'Ксения', age: 23, img: PlaceHolderImages[8].imageUrl, hint: PlaceHolderImages[8].imageHint, distance: 6, match: 83, city: 'Москва', zodiac: 'Козерог', interests: ['Мода', 'Дизайн', 'Искусство'], bio: 'Жизнь слишком коротка, чтобы носить скучную одежду.', height: 174, goal: 'Серьезные отношения' },
  { id: 10, name: 'Никита', age: 30, img: PlaceHolderImages[9].imageUrl, hint: PlaceHolderImages[9].imageHint, distance: 9, match: 77, city: 'Питер', zodiac: 'Водолей', interests: ['Наука', 'История', 'Книги'], bio: 'Люблю узнавать что-то новое каждый день.', height: 180, goal: 'Просто общение' }
];

const ZodiacIcon = ({ sign }: { sign: string }) => {
  const signs: Record<string, string> = {
    "Овен": "♈", "Телец": "♉", "Близнецы": "♊", "Рак": "♋", "Лев": "♌", "Дева": "♍",
    "Весы": "♎", "Скорпион": "♏", "Стрелец": "♐", "Козерог": "♑", "Водолей": "♒", "Рыбы": "♓",
    "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
    "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
  };
  return <span className="text-xl leading-none">{signs[sign] || "✨"}</span>;
};

const interestIcons: Record<string, any> = {
  "Фотография": Camera,
  "Путешествия": Globe,
  "Кофе": Coffee,
  "Музыка": Music,
  "Спорт": Dumbbell,
  "Искусство": Palette,
  "Кино": Film,
  "Йога": Flower2,
  "Бизнес": Briefcase,
  "Игры": Gamepad2,
  "IT": Sparkles,
  "Книги": Star,
  "Природа": Sun,
  "Photography": Camera,
  "Travel": Globe,
  "Coffee": Coffee,
  "Music": Music,
  "Sports": Dumbbell,
  "Art": Palette,
  "Movies": Film,
  "Yoga": Flower2,
  "Business": Briefcase,
  "Gaming": Gamepad2,
  "Books": Star,
  "Nature": Sun
};

function UserProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('id');
  const { t, language } = useLanguage();

  const user = ALL_DEMO_USERS.find(u => u.id === Number(userId)) || ALL_DEMO_USERS[0];
  
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    // Populate gallery photos on client mount to avoid hydration mismatch
    setPhotos([
      user.img,
      PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)].imageUrl,
      PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)].imageUrl,
    ]);
  }, [user.img]);

  const handleLike = () => {
    toast({ title: language === 'RU' ? `Вы лайкнули ${user.name}!` : `You liked ${user.name}!` });
  };

  return (
    <div className="flex flex-col min-h-svh bg-[#f8f9fb]">
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 p-4 flex items-center justify-between">
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border border-white/20"
          >
            <ChevronLeft size={24} />
          </Button>
          <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 px-3 py-1 font-black uppercase text-[9px] tracking-widest">
            {user.match}% {language === 'RU' ? 'Совпадение' : 'Match'}
          </Badge>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="relative aspect-square w-full">
          <Image src={user.img} alt={user.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fb] via-transparent to-black/30"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
             <div className="flex items-center gap-2">
                <h3 className="text-3xl font-black font-headline text-foreground tracking-tight flex items-center gap-2">
                  {user.name}, {user.age} <CheckCircle2 size={24} className="text-primary" fill="currentColor" />
                </h3>
             </div>
             <p className="text-muted-foreground text-sm font-bold flex items-center gap-1.5 uppercase tracking-widest">
                <MapPin size={14} className="text-primary" /> {language === 'RU' ? user.city : 'Moscow'} • {user.distance} км {language === 'RU' ? 'от вас' : 'from you'}
             </p>
          </div>
        </div>

        <div className="px-5 space-y-6 -mt-2 relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-0 gap-1.5 py-2 px-4 font-bold text-[11px] rounded-xl shadow-sm whitespace-nowrap">
              <ZodiacIcon sign={user.zodiac} /> {user.zodiac}
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-0 gap-1.5 py-2 px-4 font-bold text-[11px] rounded-xl shadow-sm whitespace-nowrap">
              <Ruler size={14} /> {user.height} {language === 'RU' ? 'см' : 'cm'}
            </Badge>
            <Badge variant="secondary" className="bg-primary/5 text-primary border-0 gap-1.5 py-2 px-4 font-bold text-[11px] rounded-xl shadow-sm whitespace-nowrap">
              <Target size={14} /> {language === 'RU' ? user.goal : 'Serious relations'}
            </Badge>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 app-shadow border border-border/40">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-primary" />
              <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.about')}</h4>
            </div>
            <p className="text-[14px] text-foreground/80 leading-relaxed font-medium italic">
              "{user.bio}"
            </p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 app-shadow border border-border/40 space-y-4">
            <div className="flex items-center gap-2">
               <Star size={16} className="text-primary" />
               <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.interests')}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => {
                const Icon = interestIcons[interest] || Heart;
                return (
                  <Badge key={interest} variant="secondary" className="bg-muted/50 text-foreground/80 border-0 gap-2 py-2 px-4 font-bold text-[11px] rounded-xl">
                    <Icon size={14} className="text-primary" /> {interest}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 app-shadow border border-border/40 space-y-4">
            <div className="flex items-center gap-2">
               <Camera size={16} className="text-primary" />
               <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.gallery')}</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((url, idx) => (
                <div key={idx} onClick={() => { setActivePhotoIndex(idx); setIsViewerOpen(true); }} className="relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer group">
                  <Image src={url} alt={`Photo ${idx}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <Maximize2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-6 flex gap-4 bg-white/80 backdrop-blur-md z-40 safe-pb">
          <Button 
            onClick={() => router.back()}
            variant="outline" 
            className="w-16 h-16 rounded-full border-2 border-muted hover:bg-muted text-muted-foreground flex items-center justify-center transition-all active:scale-90"
          >
            <X size={28} />
          </Button>
          <Button 
            onClick={handleLike}
            className="flex-1 h-16 rounded-full gradient-bg text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {t('button.like')} <Heart size={20} fill="currentColor" />
          </Button>
          <Button 
            asChild
            variant="outline"
            className="w-16 h-16 rounded-full border-2 border-primary/20 text-primary hover:bg-primary/5 flex items-center justify-center transition-all active:scale-90"
          >
            <Link href={`/chats?matchId=${user.id}`}>
              <MessageCircle size={28} />
            </Link>
          </Button>
        </div>
      </main>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[85vh] p-0 border-0 bg-transparent shadow-none flex flex-col items-center justify-center">
          <DialogTitle className="sr-only">Viewer</DialogTitle>
          <button onClick={() => setIsViewerOpen(false)} className="absolute top-8 right-8 z-50 p-2 bg-black/50 text-white rounded-full">
            <X size={24} />
          </button>
          
          <Carousel className="w-full h-full" opts={{ startIndex: activePhotoIndex }}>
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <CarouselItem key={idx} className="h-[80vh] flex items-center justify-center p-4 pl-4">
                  <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden app-shadow">
                    <Image src={url} alt={`Gallery view ${idx}`} fill className="object-cover" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-black/50 border-0 text-white hover:bg-black/70" />
            <CarouselNext className="right-4 bg-black/50 border-0 text-white hover:bg-black/70" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UserProfilePage() {
  const { language } = useLanguage();
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-svh font-black">{language === 'RU' ? 'Загрузка...' : 'Loading...'}</div>}>
      <UserProfileContent />
    </Suspense>
  );
}
