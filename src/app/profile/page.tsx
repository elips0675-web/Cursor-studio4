
"use client";

import { useState } from "react";
import { 
  Settings, 
  MapPin, 
  CheckCircle2, 
  Star, 
  Camera, 
  Coffee, 
  Music, 
  Globe, 
  Dumbbell,
  Edit2,
  Palette,
  Plus,
  Trash2,
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
  Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ZodiacIcon = ({ sign }: { sign: string }) => {
  const signs: Record<string, string> = {
    "Овен": "♈", "Телец": "♉", "Близнецы": "♊", "Рак": "♋", "Лев": "♌", "Дева": "♍",
    "Весы": "♎", "Скорпион": "♏", "Стрелец": "♐", "Козерог": "♑", "Водолей": "♒", "Рыбы": "♓",
    "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋", "Leo": "♌", "Virgo": "♍",
    "Libra": "♎", "Scorpio": "♏", "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
  };
  return <span className="text-xl leading-none">{signs[sign] || "✨"}</span>;
};

export default function ProfilePage() {
  const { t, language } = useLanguage();
  
  const [profile] = useState({
    name: "Анна",
    age: 24,
    city: t('profile.city'),
    datingGoal: t('profile.goal_value'),
    zodiac: language === 'RU' ? "Лев" : "Leo",
    bio: language === 'RU' 
      ? "Люблю закаты, хороший кофе и интересные разговоры. Ищу человека, с которым можно разделить эти моменты."
      : "I love sunsets, good coffee, and interesting conversations. Looking for someone to share these moments with.",
    interests: language === 'RU' 
      ? ["Фотография", "Путешествия", "Кофе", "Музыка", "Спорт", "Искусство", "Собаки", "Рост: 172 см", "Сова"]
      : ["Photography", "Travel", "Coffee", "Music", "Sports", "Art", "Dogs", "Height: 172 cm", "Night owl"]
  });

  const [photos, setPhotos] = useState([
    PlaceHolderImages[0].imageUrl,
    PlaceHolderImages[2].imageUrl,
    PlaceHolderImages[4].imageUrl,
    PlaceHolderImages[6].imageUrl,
    PlaceHolderImages[8].imageUrl,
  ]);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleAddPhoto = () => {
    if (photos.length >= 10) {
      toast({
        variant: "destructive",
        title: language === 'RU' ? "Лимит достигнут" : "Limit reached",
        description: language === 'RU' ? "Максимум 10 фотографий в профиле." : "Maximum 10 photos in profile.",
      });
      return;
    }
    const newPhoto = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)].imageUrl;
    setPhotos(prev => [...prev, newPhoto]);
    toast({
      title: language === 'RU' ? "Фото добавлено" : "Photo added",
    });
  };

  const handleDeletePhoto = (index: number) => {
    if (photos.length <= 1) {
      toast({
        variant: "destructive",
        title: language === 'RU' ? "Ошибка" : "Error",
        description: language === 'RU' ? "В профиле должно быть хотя бы одно фото." : "At least one photo must be in profile.",
      });
      return;
    }
    setPhotos(prev => prev.filter((_, i) => i !== index));
    toast({
      title: language === 'RU' ? "Фото удалено" : "Photo deleted",
    });
  };

  const openPhotoViewer = (index: number) => {
    setActivePhotoIndex(index);
    setIsViewerOpen(true);
  };

  const interestMap = [
    { label: language === 'RU' ? "Фотография" : "Photography", icon: Camera },
    { label: language === 'RU' ? "Путешествия" : "Travel", icon: Globe },
    { label: language === 'RU' ? "Кофе" : "Coffee", icon: Coffee },
    { label: language === 'RU' ? "Музыка" : "Music", icon: Music },
    { label: language === 'RU' ? "Спорт" : "Sports", icon: Dumbbell },
    { label: language === 'RU' ? "Искусство" : "Art", icon: Palette },
    { label: language === 'RU' ? "Кино" : "Movies", icon: Film },
    { label: language === 'RU' ? "Йога" : "Yoga", icon: Flower2 },
    { label: language === 'RU' ? "Бизнес" : "Business", icon: Briefcase },
    { label: language === 'RU' ? "Игры" : "Gaming", icon: Gamepad2 },
    { label: language === 'RU' ? "Собаки" : "Dogs", icon: Dog },
    { label: language === 'RU' ? "Кошки" : "Cats", icon: Dog }, 
    { label: language === 'RU' ? "Рост:" : "Height:", icon: Ruler },
    { label: language === 'RU' ? "Сова" : "Night owl", icon: Moon },
    { label: language === 'RU' ? "Жаворонок" : "Early bird", icon: Sun },
  ];

  const lifestyleKeywords = [
    language === 'RU' ? "Рост:" : "Height:", 
    language === 'RU' ? "Сова" : "Night owl", 
    language === 'RU' ? "Жаворонок" : "Early bird", 
    language === 'RU' ? "Собаки" : "Dogs", 
    language === 'RU' ? "Кошки" : "Cats"
  ];

  const lifestyleDetails = profile.interests.filter(i => lifestyleKeywords.some(key => i.includes(key)));
  const generalInterests = profile.interests.filter(i => !lifestyleKeywords.some(key => i.includes(key)));
  const heightInfo = profile.interests.find(i => i.includes(language === 'RU' ? "Рост:" : "Height:"));

  return (
    <>
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        <div className="h-32 gradient-bg relative shadow-lg">
          <Link href="/settings" className="absolute top-6 right-6 text-white/90 p-2.5 bg-black/15 rounded-full hover:bg-black/25 transition-all backdrop-blur-md">
            <Settings size={20} />
          </Link>
        </div>

        <div className="px-5 -mt-12 text-center">
          <div className="relative inline-block mb-4">
            <div 
              onClick={() => openPhotoViewer(0)}
              className="relative w-36 h-36 rounded-[2.5rem] border-[6px] border-white app-shadow overflow-hidden bg-muted transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <Image src={photos[0]} alt={profile.name} fill className="object-cover" priority />
            </div>
            <div className="absolute bottom-2 right-2 bg-white p-1 rounded-xl shadow-xl border border-border">
              <Badge className="bg-primary text-white border-0 font-black text-[8px] h-5 px-2 rounded-lg uppercase tracking-widest">
                {t('profile.pro')}
              </Badge>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <h3 className="text-2xl font-black font-headline tracking-tight flex items-center justify-center gap-2">
              {profile.name}, {profile.age} <CheckCircle2 size={20} className="text-primary" fill="currentColor" />
            </h3>
            
            <div className="flex flex-col items-center gap-2.5">
              <p className="text-muted-foreground text-[10px] font-black flex items-center justify-center gap-1.5 uppercase tracking-widest opacity-80">
                <MapPin size={12} className="text-primary" /> {t('profile.city')}
              </p>
              
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-0 gap-1.5 py-1.5 px-3 font-bold text-[10px] rounded-xl shadow-sm">
                  <ZodiacIcon sign={profile.zodiac} /> {profile.zodiac}
                </Badge>
                {heightInfo && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-0 gap-1.5 py-1.5 px-3 font-bold text-[10px] rounded-xl shadow-sm">
                    <Ruler size={12} /> {heightInfo.replace(language === 'RU' ? "Рост: " : "Height: ", "")}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-primary/5 text-primary border-0 gap-1.5 py-1.5 px-3 font-bold text-[10px] rounded-xl shadow-sm">
                  <Target size={12} /> {t('profile.goal_value')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-8">
            <Button asChild className="rounded-2xl gradient-bg text-white h-12 px-10 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all border-0">
              <Link href="/profile/edit"><Edit2 size={16} className="mr-2" /> {t('profile.edit')}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl h-12 w-12 p-0 border-border bg-white shadow-sm hover:bg-muted active:scale-95 transition-all">
              <Link href="/settings"><Settings size={20} className="text-muted-foreground" /></Link>
            </Button>
          </div>

          <div className="bg-white rounded-[2rem] p-4 app-shadow border border-border/40 mb-6 flex divide-x divide-border/50">
            <div className="flex-1 py-1">
              <div className="text-xl font-black text-primary leading-none tracking-tighter">128</div>
              <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1.5 opacity-60">{t('profile.likes')}</div>
            </div>
            <div className="flex-1 py-1">
              <div className="text-xl font-black text-primary leading-none tracking-tighter">45</div>
              <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1.5 opacity-60">{t('profile.matches')}</div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-primary" />
              <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">{t('profile.about')}</h4>
            </div>
            <p className="text-[12px] text-foreground/80 leading-relaxed font-medium">
              {profile.bio}
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-6 text-left space-y-6">
            <div className="space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">{t('profile.lifestyle')}</p>
              <div className="flex flex-wrap gap-2">
                {lifestyleDetails.filter(d => !d.includes(language === 'RU' ? "Рост:" : "Height:")).map((detail) => {
                  const mapItem = interestMap.find(m => detail.includes(m.label));
                  const Icon = mapItem?.icon || Star;
                  return (
                    <Badge key={detail} variant="secondary" className="bg-blue-50/50 text-blue-600 border-0 gap-2 py-2 px-3.5 font-bold text-[10px] rounded-xl">
                      <Icon size={14} /> {detail}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-muted/60" />
            
            <div className="space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">{t('profile.interests')}</p>
              <div className="flex flex-wrap gap-2">
                {generalInterests.map((interest) => {
                  const mapItem = interestMap.find(m => interest.includes(m.label));
                  const Icon = mapItem?.icon || Heart;
                  return (
                    <Badge key={interest} variant="secondary" className="bg-muted/40 text-foreground/80 border-0 gap-2 py-2 px-3.5 font-bold text-[10px] rounded-xl hover:bg-muted transition-all">
                      <Icon size={14} className="text-primary" /> {interest}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 app-shadow border border-border/40 mb-12 text-left">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-primary" />
                <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.gallery')}</h4>
              </div>
              <button onClick={handleAddPhoto} className="text-primary flex items-center gap-1.5 text-[11px] font-black uppercase hover:underline tracking-widest">
                <Plus size={18} /> {t('profile.add')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {photos.map((url, idx) => (
                <div key={idx} onClick={() => openPhotoViewer(idx)} className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-muted group shadow-md border border-border/10 cursor-pointer hover:scale-[1.02] transition-all">
                  <Image src={url} alt={`Photo ${idx}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                    <div className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full"><Maximize2 size={20} /></div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeletePhoto(idx); }} className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-destructive/80 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {photos.length < 10 && (
                <button onClick={handleAddPhoto} className="aspect-[3/4] rounded-[2rem] border-2 border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 hover:border-primary/30 transition-all shadow-sm">
                  <Plus size={40} className="opacity-30 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-black mt-3 uppercase tracking-widest opacity-50">{t('profile.add')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[85vh] p-0 border-0 bg-transparent shadow-none flex flex-col items-center justify-center outline-none">
          <DialogTitle className="sr-only">Viewer</DialogTitle>
          <button onClick={() => setIsViewerOpen(false)} className="absolute top-4 right-4 z-50 p-3 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 active:scale-90 transition-all">
            <X size={24} />
          </button>
          
          <Carousel className="w-full h-full" opts={{ startIndex: activePhotoIndex }}>
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <CarouselItem key={idx} className="pl-0 h-[80vh] flex items-center justify-center">
                  <div className="relative w-full h-full rounded-[3rem] overflow-hidden app-shadow border-4 border-white/10">
                    <Image src={url} alt={`Gallery view ${idx}`} fill className="object-cover" sizes="(max-width: 480px) 100vw, 440px" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 h-14 w-14 bg-white/10 hover:bg-white/20 border-0 text-white backdrop-blur-md" />
            <CarouselNext className="right-4 h-14 w-14 bg-white/10 hover:bg-white/20 border-0 text-white backdrop-blur-md" />
          </Carousel>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
