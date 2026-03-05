
"use client";

import { useState, useRef } from "react";
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
  Heart,
  Upload
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (photos.length >= 10) {
        toast({
          variant: "destructive",
          title: language === 'RU' ? "Лимит достигнут" : "Limit reached",
          description: language === 'RU' ? "Максимум 10 фотографий в профиле." : "Maximum 10 photos in profile.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
        toast({
          title: language === 'RU' ? "Фото добавлено" : "Photo added",
          description: language === 'RU' ? "Ваша галерея обновлена." : "Your gallery has been updated.",
        });
      };
      reader.readAsDataURL(file);
      // Сбрасываем значение input, чтобы можно было выбрать тот же файл снова
      e.target.value = '';
    }
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
      <AppHeader />
      <main className="flex-1 overflow-y-auto pb-24 bg-[#f8f9fb]">
        <div className="h-24 gradient-bg relative shadow-sm">
          <Link href="/settings" className="absolute top-4 right-6 text-white/90 p-2 bg-black/15 rounded-full hover:bg-black/25 transition-all backdrop-blur-md">
            <Settings size={18} />
          </Link>
        </div>

        <div className="px-5 -mt-10 text-center">
          <div className="relative inline-block mb-4">
            <div 
              className="relative w-32 h-32 rounded-[2.5rem] border-[6px] border-white app-shadow overflow-hidden bg-muted"
            >
              <Image src={photos[0]} alt={profile.name} fill className="object-cover" priority />
            </div>
            <Link 
              href="/profile/edit" 
              className="absolute -bottom-1 -right-1 bg-white p-2.5 rounded-2xl shadow-xl border-2 border-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
            >
               <Camera size={16} />
            </Link>
          </div>

          <div className="mb-6 space-y-2">
            <h3 className="text-2xl font-black font-headline tracking-tight flex items-center justify-center gap-2">
              {profile.name}, {profile.age} <CheckCircle2 size={20} className="text-primary" fill="currentColor" />
            </h3>
            
            <div className="flex flex-col items-center gap-2">
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

          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-6 text-left space-y-4">
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
              {generalInterests.map((interest) => {
                const mapItem = interestMap.find(m => interest.includes(m.label));
                const Icon = mapItem?.icon || Heart;
                return (
                  <Badge key={interest} variant="secondary" className="bg-muted/40 text-foreground/80 border-0 gap-2 py-2 px-3.5 font-bold text-[10px] rounded-xl">
                    <Icon size={14} className="text-primary" /> {interest}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 app-shadow border border-border/40 mb-12 text-left">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-primary" />
                <h4 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground">{t('profile.gallery')}</h4>
              </div>
              <button 
                onClick={handleTriggerFileInput} 
                className="text-primary flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity active:scale-95"
              >
                <Plus size={18} /> {t('profile.add')}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((url, idx) => (
                <div key={idx} onClick={() => openPhotoViewer(idx)} className="relative aspect-square rounded-2xl overflow-hidden bg-muted group shadow-sm border border-border/10 cursor-pointer">
                  <Image src={url} alt={`Photo ${idx}`} fill className="object-cover" />
                  
                  {/* Overlay for Maximize (Center) */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={24} className="text-white/80 drop-shadow-md" />
                  </div>

                  {/* Delete Button (Top-Right) */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeletePhoto(idx); }} 
                    className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:scale-110 z-10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[440px] w-[95vw] h-[85vh] p-0 border-0 bg-transparent shadow-none flex flex-col items-center justify-center">
          <DialogTitle className="sr-only">Viewer</DialogTitle>
          <button onClick={() => setIsViewerOpen(false)} className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full">
            <X size={24} />
          </button>
          
          <Carousel className="w-full h-full" opts={{ startIndex: activePhotoIndex }}>
            <CarouselContent className="h-full ml-0">
              {photos.map((url, idx) => (
                <div key={idx} className="flex-[0_0_100%] min-w-0 h-[80vh] flex items-center justify-center p-4">
                  <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden app-shadow">
                    <Image src={url} alt={`Gallery view ${idx}`} fill className="object-cover" />
                  </div>
                </div>
              ))}
            </CarouselContent>
          </Carousel>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  );
}
